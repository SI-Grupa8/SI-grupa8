
//import { Component, ElementRef, OnInit, ViewChild  } from '@angular/core';
import { GoogleMap, GoogleMapsModule, MapAdvancedMarker } from '@angular/google-maps';

import { Component, OnInit, ChangeDetectorRef, Renderer2,ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { DeviceService } from '../../core/services/http/device.service';
import { AuthService } from '../../core/services/http/auth.service';
import { DeviceFilterComponent } from './device-filter/device-filter.component';
import { UserService } from '../../core/services/http/user.service';
import jsPDF from 'jspdf';
import { NgxPrintModule, NgxPrintService } from 'ngx-print';


import {  DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MapFilterComponent } from "./map-filter/map-filter.component";
import {MatChipsModule} from '@angular/material/chips';
import { DeviceRequest } from '../../core/models/device-request';
import { DeviceDetailsComponent } from "./device-details/device-details.component";
import { FormsModule } from '@angular/forms';
import { DateRequest } from '../../core/models/date-request';
import { OwlDateTimeFormats, OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { DatePipe } from '@angular/common';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
  

@Component({
    selector: 'app-map',
    standalone: true,
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    providers: [DatePipe],
    imports: [MapAdvancedMarker, GoogleMapsModule, CommonModule, DeviceFilterComponent, OwlDateTimeModule, OwlNativeDateTimeModule, FormsModule, MapFilterComponent, MatChipsModule, DeviceDetailsComponent,NgxPrintModule]
})

export class MapComponent implements OnInit, AfterViewInit {
  //center: google.maps.LatLngLiteral = { lat: 43.8563, lng: 18.4131 };
  //zoom = 15;

  currentDate: Date = new Date();
  last24Hours: number = 24 * 60 * 60 * 1000;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  maxDateTime: Date = new Date();
  minDateTime: Date = new Date(this.currentDate.getTime() - this.last24Hours);

  dateTimePickerFormat: OwlDateTimeFormats = {
    parseInput: 'YYYY-MM-DD HH:mm',
    fullPickerInput: 'YYYY-MM-DD HH:mm',
    datePickerInput: 'YYYY-MM-DD',
    timePickerInput: 'HH:mm',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  };
  
  filteredDevices: any[] = [];
  devices: any[] = [];
  locations: any[] = [];
  date1: Date = new Date();
  date2: Date = new Date();
  last24HoursDateTime: string = '';
  
  defaultCenter:google.maps.LatLngLiteral = {
    lat: 44.44929,
    lng: 18.64978
  };
  center: google.maps.LatLngLiteral = {
    lat: 44.44929,
    lng: 18.64978
  };
  zoom = 7;
  directionsService: google.maps.DirectionsService;
  directionsRenderer: google.maps.DirectionsRenderer;

  dateRequest: DateRequest = {
    date1: this.date1,
    date2: this.date2
  }
  activeDeviceId: number | null | undefined;
  
  allDevicesSelected: boolean = true;
  mobileDevicesSelected: boolean = false;
  gpsDevicesSelected: boolean = false;
  carDevicesSelected: boolean = false;
  selectedDevice: any;
  //printService: any;

  selectAllDevices() {
    this.allDevicesSelected = true;
    this.mobileDevicesSelected = false;
    this.gpsDevicesSelected = false;
    this.carDevicesSelected = false;
    this.getFilteredDevices();
  }

  toggleDeviceSelection(deviceType: string) {
    switch(deviceType) {
        case 'mobile':
            this.mobileDevicesSelected = !this.mobileDevicesSelected;
            break;
        case 'gps':
            this.gpsDevicesSelected = !this.gpsDevicesSelected;
            break;
        case 'car':
            this.carDevicesSelected = !this.carDevicesSelected;
            break;
        
    }
    
    // Use setTimeout to delay the state check
    setTimeout(() => {
        // Check if all devices are selected
        if (this.mobileDevicesSelected && this.gpsDevicesSelected && this.carDevicesSelected) {
            // If all devices are selected, deselect individual devices
            this.selectAllDevices();
        } else if (!this.mobileDevicesSelected && !this.gpsDevicesSelected && !this.carDevicesSelected) {
            // If no individual devices are selected, select the "All devices" option
            this.selectAllDevices();
        } else {
            // If not all devices are selected, deselect the "All devices" option
            this.allDevicesSelected = false;
        }
        // Call getFilteredDevices method with updated selected chips
        this.getFilteredDevices();
        this.initMap()
    });
}


  deselectAllIfAllSelected() {
    if (this.allDevicesSelected) {
        this.allDevicesSelected = false;
    }
  }


  showFilterComponent: boolean = true;

  toggleMapFilter() {
    this.showFilterComponent = !this.showFilterComponent;
  }
  markerOptions: any = {
    // Default marker options here
  };
  mapOptions: any = {
    mapTypeId: 'roadmap', // or 'satellite', 'hybrid', 'terrain'
    fullscreenControl: false, // Hide the fullscreen control
    mapTypeControl: false // Hide the map type control (mode chooser)
  };

  iframeSrc!: SafeResourceUrl | undefined;
  
  selectedDeviceTypeId : number[] = [];
  markers: any[] = [
    { lat: 43.856430, lng: 18.413029 },
    { lat: 44.53842, lng: 18.66709 }
  ];

  //constructor(private deviceService: DeviceService, private authService : AuthService, private userService: UserService, private sanitizer: DomSanitizer) {}


  @ViewChild('mapContainer')
  mapContainer!: ElementRef;

  constructor(
    private deviceService: DeviceService,
    private userService: UserService,
    private authService : AuthService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private noResult: MatSnackBar,
    private printService: NgxPrintService,
    private renderer: Renderer2, private elementRef: ElementRef
  ) {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.printService=printService
  }

  ngOnInit(): void {

      /*this.markerOptions = { 
        
      icon: { 
        url: 'assets/images/location-pin-48.png', 
        scaledSize: { width: 32, height: 32 } } 
      }; */
      

    this.userService.getUser().pipe(
      concatMap(user => {
        if (user) {
          return this.deviceService.getCompanyDevices(user.companyID).pipe(
            concatMap(devices => {
              this.filteredDevices = devices;
              const deviceObservables = devices.map(device => {
                const deviceId = device.deviceID;
                if (!deviceId || deviceId === 0) {
                  console.error('Invalid device ID:', deviceId);
                  return of([]);
                }
                return this.deviceService.getDeviceLocations(deviceId);
              });
              return forkJoin(deviceObservables);
            })
          );
        }
        return of(null);
      }),
      catchError(error => {
        console.error('Error fetching devices:', error);
        return of(null);
      })
    ).subscribe(locations => {
      if (locations && locations.length > 0) {
        this.locations = locations.flat();
        //this.displayRoute(this.locations.map(location => this.parseCoordinates(location)).filter(coord => coord !== null) as google.maps.LatLngLiteral[]);
        this.initMap();
      }
    });
  }

  ngAfterViewInit(): void {
    //this.displayRoute();
  }

  parseCoordinates(location: any): google.maps.LatLngLiteral | null {
    const lat = parseFloat(location.xCoordinate);
    const lng = parseFloat(location.yCoordinate);

    if (isNaN(lat) || isNaN(lng)) {
      console.error('Invalid coordinates for location:', location);
      return null;

    }

    return {
      lat: lat,
      lng: lng
    };
  }

  display: any;
  

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = (event.latLng.toJSON());
  }

/*
  onDeviceTypeSelected(event: any): void {
    this.deviceService.getFilteredDevices(event).subscribe(devices => {
      this.devices = devices;
    });
  }*/


  calculateAndDisplayRoute(): void {
    //const selectedDeviceId = (document.getElementById('start') as HTMLSelectElement).value;
    
    const sortedLocations = this.sortAndFilterLocationsForDevice(this.selectedDevice.deviceID);
    const routeCoordinates = sortedLocations.map(location => this.parseCoordinates(location)).filter(coord => coord !== null) as google.maps.LatLngLiteral[];
    this.displayRoute(routeCoordinates);
    
  }



  getFilteredDevices() {
    
    const selectedDeviceTypeIds: number[] = [];
    if (this.mobileDevicesSelected) {
        selectedDeviceTypeIds.push(1);
    }
    if (this.gpsDevicesSelected) {
        selectedDeviceTypeIds.push(2);
    }
    if (this.carDevicesSelected) {
        selectedDeviceTypeIds.push(3);
    }

    
    this.deviceService.getFilteredDevices(selectedDeviceTypeIds, [])
        .subscribe(devices => {
            
            this.filteredDevices = devices;

            this.initMap()
            console.log(this.filteredDevices);
        });
  }

  getSearchDevices(deviceRequest: DeviceRequest[]) {
    this.filteredDevices = deviceRequest;

    this.initMap()
  }

  parseCoordinatesNew(device: any): { lat: number, lng: number } {
    return { 
      lat: parseFloat(device.xCoordinate),
      lng: parseFloat(device.yCoordinate)
    };
  }

  initMap(): void {
    const myLatLng = { lat: 43.8582, lng: 18.3566 };
  
    const map = new google.maps.Map(
      document.getElementById("mapContainer") as HTMLElement,
      {
        zoom: 10,
        center: myLatLng,
      }
    );
  
    this.filteredDevices.forEach(device => {
      const deviceLatLng =  this.parseCoordinatesNew(device) ;
      console.log(device);
      const markerOptions = this.getMarkerOptions(device);
      new google.maps.Marker({
        position: deviceLatLng,
        map: map,
        title: device.deviceName,
        icon: markerOptions.icon
      });
    });
  }

  @ViewChild(GoogleMap) map!: GoogleMap;
  unzoomFromDevice(deviceId: number){}
  
  zoomToSpecificPoint(deviceID: number) {
    const device = this.filteredDevices.find((device) => device.deviceID === deviceID);
    if (device) {
        const { xCoordinate, yCoordinate } = device;
        const newPosition: google.maps.LatLngLiteral = { lat: parseFloat(xCoordinate), lng: parseFloat(yCoordinate) };

        if (this.activeDeviceId === deviceID) {
            this.activeDeviceId = null;
            this.center = this.defaultCenter;
            this.zoom = 15;
            this.selectedDevice = null;
            this.initMap()
            //console.log(this.selectedDevice)
            const dateDiv = document.querySelector('.date');
            if (dateDiv) {
                dateDiv.classList.add('hide');
            }
            
            
        } else {
            this.activeDeviceId = deviceID;
            this.center = newPosition;
            this.zoom = 16;
            this.selectedDevice = device;
            this.calculateAndDisplayRoute()
        }
    }
}
  
  getMarkerOptions(device: DeviceRequest): any {
    if (device.deviceTypeID == 1){
      return {
          icon: {
              
              url: 'assets/images/mobile-marker.png',
              scaledSize: { width: 70, height: 70 } 
          }
      };
    }
    else if (device.deviceTypeID == 2){
      return {
          icon: {
              
              url: 'assets/images/gps-marker.png',
              scaledSize: { width: 70, height: 70 } 
          }
      };
    }
    else if (device.deviceTypeID == 3){
      return {
          icon: {
              
              url: 'assets/images/car-marker.png',
              scaledSize: { width: 70, height: 70 } 
          }
      };
    }
  }
  closeDetails() {
    this.selectedDevice = null;
    
    console.log(this.selectedDevice);
  }


  private sortAndFilterLocationsForDevice(deviceId: number): any[] {
    const deviceLocations = this.locations.filter(location => location.deviceID === deviceId);
    return deviceLocations.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  private displayRoute(coordinates?: google.maps.LatLngLiteral[]): void {
    console.log("KOO:" + coordinates);
    if (!coordinates || coordinates.length === 0) {
        console.error('No coordinates provided for displaying route.');
        return;
    }
    let filterCoordinates = coordinates;
    filterCoordinates.forEach(x => {

    })
    const start = new google.maps.LatLng(coordinates[0].lat, coordinates[0].lng);
    const end = new google.maps.LatLng(coordinates[coordinates.length - 1].lat, coordinates[coordinates.length - 1].lng);
  
    const waypts = coordinates.slice(1, -1).map(coord => ({ location: new google.maps.LatLng(coord.lat, coord.lng) }));
  
    const request = {
      origin: start,
      destination: end,
      waypoints: waypts,
      travelMode: google.maps.TravelMode.DRIVING,
    };
  
    this.directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setDirections(result);
        this.directionsRenderer.setMap(new google.maps.Map(this.mapContainer.nativeElement, {
          center: this.center,
          zoom: this.zoom,
          mapTypeControl: false
        }));
      } else {
        console.error('Directions request failed due to ' + status);
      }
    });
}

showTimeStamps(date1: Date, date2: Date) {
  console.log(date1.toISOString().replace('Z', ''), date2.toISOString().replace('Z', '')); 

  var deviceId = this.activeDeviceId ? this.activeDeviceId : this.selectedDevice.deviceID
  this.deviceService.getDateTimeStamps({date1: date1.toISOString().replace('Z', ''), date2: date2.toISOString().replace('Z', '')}, deviceId).subscribe(x => {
    
    if(x.length === 0){
      this.noResult.open('No routes available for the selected time interval.', 'Close', {
        duration: 4000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      return;
    }
    var coordinates : any = []
    coordinates =  x.map(location => this.parseCoordinates(location)).filter(coord => coord !== null) as google.maps.LatLngLiteral[];


    this.displayRoute(coordinates);

  })
  }

  printMap() {
    const hostElement = this.elementRef.nativeElement;

    const computedStyle = window.getComputedStyle(hostElement);

    if (computedStyle.marginLeft){
    
      this.renderer.setStyle(hostElement, 'margin-left', 'unset');
    }
    if(computedStyle.width){     
       this.renderer.setStyle(hostElement, 'width', 'unset');
    }
    if(computedStyle.minHeight){
      this.renderer.setStyle(hostElement,'min-height', 'unset');
    }
    const hideElements = document.querySelectorAll('.home-header, .show-filters, .filtclass, .detclass, .sort, .date, .print, .map-nav');
    hideElements.forEach((element: Element) => {
        if ((element as HTMLElement).style) {
            (element as HTMLElement).style.display = 'none';
        }
    });

    const hideElements2 = document.querySelectorAll('app-sidebar, app-header');
    hideElements2.forEach((element: Element) => {
        if ((element as HTMLElement).style) {
            (element as HTMLElement).style.display = 'none';
        }
    });
    window.document.title="Print mape";
    window.print();
    setTimeout(() => {
        hideElements.forEach((element: Element) => {
            if ((element as HTMLElement).style) {
                (element as HTMLElement).style.display = '';
            }
        });
        hideElements2.forEach((element: Element) => {
          if ((element as HTMLElement).style) {
              (element as HTMLElement).style.display = '';
          }
      });
      this.renderer.setStyle(hostElement, 'margin-left', '200px');
      this.renderer.setStyle(hostElement, 'width', 'calc(100% - 200px)');
      this.renderer.setStyle(hostElement, 'min-height', 'calc(100vh - 60px)');

    }, 500); 
  
}

}

