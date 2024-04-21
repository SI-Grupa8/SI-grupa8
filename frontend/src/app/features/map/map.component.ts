
import { Component, ElementRef, OnInit, ViewChild  } from '@angular/core';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';

import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { DeviceService } from '../../core/services/http/device.service';
import { AuthService } from '../../core/services/http/auth.service';
import { DeviceFilterComponent } from './device-filter/device-filter.component';
import { UserService } from '../../core/services/http/user.service';


import {  DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MapFilterComponent } from "./map-filter/map-filter.component";
import {MatChipsModule} from '@angular/material/chips';
import { DeviceRequest } from '../../core/models/device-request';
import { DeviceDetailsComponent } from "./device-details/device-details.component";

@Component({
    selector: 'app-map',
    standalone: true,
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    imports: [GoogleMapsModule, CommonModule, DeviceFilterComponent, FormsModule, MapFilterComponent, MatChipsModule, DeviceDetailsComponent]
})

export class MapComponent implements OnInit, AfterViewInit {
  //center: google.maps.LatLngLiteral = { lat: 43.8563, lng: 18.4131 };
  zoom = 15;
  filteredDevices: any[] = [];
  devices: any[] = [];
  locations: any[] = [];
  center: google.maps.LatLngLiteral = {
    lat: 44.44929,
    lng: 18.64978
  };
  zoom = 7;
  directionsService: google.maps.DirectionsService;
  directionsRenderer: google.maps.DirectionsRenderer;

  
  activeDeviceId: number | null = null;
  
  allDevicesSelected: boolean = true;
  mobileDevicesSelected: boolean = false;
  gpsDevicesSelected: boolean = false;
  carDevicesSelected: boolean = false;
selectedDevice: any;

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

  constructor(private deviceService: DeviceService, private authService : AuthService, private userService: UserService, private sanitizer: DomSanitizer) {}


  @ViewChild('mapContainer')
  mapContainer!: ElementRef;

  constructor(
    private deviceService: DeviceService,
    private userService: UserService,
  ) {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
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
        this.displayRoute(this.locations.map(location => this.parseCoordinates(location)).filter(coord => coord !== null) as google.maps.LatLngLiteral[]);
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
  


  onDeviceTypeSelected(event: any): void {
    this.deviceService.getFilteredDevices(event).subscribe(devices => {
      this.devices = devices;
    });
  }


  calculateAndDisplayRoute(): void {
    const selectedDeviceId = (document.getElementById('start') as HTMLSelectElement).value;
    const sortedLocations = this.sortAndFilterLocationsForDevice(selectedDeviceId);
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
            console.log(this.filteredDevices);
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
            this.map.panTo(this.center);
            
            this.zoom = 15;
            this.selectedDevice = null;
        } else {
            this.activeDeviceId = deviceID;
            this.map.panTo(newPosition);

            
            this.zoom = 16;
            this.selectedDevice = device;
        }
    }
  }
  
  getMarkerOptions(device: DeviceRequest): any {
    if (device.deviceTypeID == 1){
      return {
          icon: {
              
              url: 'assets/images/phone.png',
              scaledSize: { width: 40, height: 40 } 
          }
      };
    }
    else if (device.deviceTypeID == 2){
      return {
          icon: {
              
              url: 'assets/images/gps.png',
              scaledSize: { width: 40, height: 40 } 
          }
      };
    }
    else if (device.deviceTypeID == 3){
      return {
          icon: {
              
              url: 'assets/images/car.png',
              scaledSize: { width: 40, height: 40 } 
          }
      };
    }
  }
  closeDetails() {
    this.selectedDevice = null;
    
    console.log(this.selectedDevice);
  }
}

  private sortAndFilterLocationsForDevice(deviceId: string): any[] {
    const deviceLocations = this.locations.filter(location => location.deviceID === parseInt(deviceId, 10));
    return deviceLocations.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  private displayRoute(coordinates?: google.maps.LatLngLiteral[]): void {
    if (!coordinates) {
      coordinates = this.locations.map(location => this.parseCoordinates(location)).filter(coord => coord !== null) as google.maps.LatLngLiteral[];
    }
    
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
          zoom: this.zoom
        }));
      } else {
        console.error('Directions request failed due to ' + status);
      }
    });
  }
  
}

