import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { DeviceService } from '../../core/services/http/device.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/http/auth.service';
import { DeviceFilterComponent } from './device-filter/device-filter.component';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/http/user.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { forkJoin, of } from 'rxjs';
import { switchMap, map, tap, catchError, concatMap } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [ GoogleMapsModule, CommonModule, DeviceFilterComponent, FormsModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'] 
})
export class MapComponent implements OnInit {
  devices: any[] = [];
  locations: any[] = [];
  markerOptions: any = {};
  selectedDeviceTypeId: number[] = [];
  display: any;
  center: google.maps.LatLngLiteral = {
    lat: 44.44929, 
    lng: 18.64978
  };
  zoom = 7;
  routeCoordinates: google.maps.LatLngLiteral[] = [];

  constructor(
    private deviceService: DeviceService,
    private authService: AuthService,
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {} 

  ngOnInit(): void {
    this.userService.getUser().pipe(
      concatMap(user => {
        if (user) {
          return this.deviceService.getCompanyDevices(user.companyID).pipe(
            concatMap(devices => {
              this.devices=devices;
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
        this.routeCoordinates = this.locations.map(location => this.parseCoordinates(location)).filter(coord => coord !== null) as google.maps.LatLngLiteral[];
        this.cdr.detectChanges();
      } else {
        this.routeCoordinates = [];
      }
    });
  }
  parseCoordinatesd(device: any): { lat: number, lng: number } {
    return { 
      lat: parseFloat(device.xCoordinate),
      lng: parseFloat(device.yCoordinate)
    };
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
  
    this.routeCoordinates = sortedLocations.map(location => this.parseCoordinates(location)).filter(coord => coord !== null) as google.maps.LatLngLiteral[];
    this.cdr.detectChanges();
  }
  
  private sortAndFilterLocationsForDevice(deviceId: string): any[] {
    const deviceLocations = this.locations.filter(location => location.deviceID === parseInt(deviceId, 10));
    return deviceLocations.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }
}
