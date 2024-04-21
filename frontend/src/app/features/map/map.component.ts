import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DeviceService } from '../../core/services/http/device.service';
import { AuthService } from '../../core/services/http/auth.service';
import { DeviceFilterComponent } from './device-filter/device-filter.component';
import { UserService } from '../../core/services/http/user.service';
import { forkJoin, of } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-map',
  standalone: true,
  imports:[CommonModule, DeviceFilterComponent],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
  devices: any[] = [];
  locations: any[] = [];
  center: google.maps.LatLngLiteral = {
    lat: 44.44929,
    lng: 18.64978
  };
  zoom = 7;
  directionsService: google.maps.DirectionsService;
  directionsRenderer: google.maps.DirectionsRenderer;

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
    this.userService.getUser().pipe(
      concatMap(user => {
        if (user) {
          return this.deviceService.getCompanyDevices(user.companyID).pipe(
            concatMap(devices => {
              this.devices = devices;
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

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = (event.latLng.toJSON());
  }

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