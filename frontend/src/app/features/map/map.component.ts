import { Component, ElementRef, OnInit, ViewChild  } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { DeviceService } from '../../core/services/http/device.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/http/auth.service';
import { DeviceFilterComponent } from './device-filter/device-filter.component';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/http/user.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [ GoogleMapsModule, CommonModule, DeviceFilterComponent, FormsModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'] 
})

export class MapComponent implements OnInit{
  devices: any[] = [];
  markerOptions: any = {}; 
  iframeSrc!: SafeResourceUrl | undefined;
  //companyId: any;
  selectedDeviceTypeId : number[] = [];
  markers: any[] = [
    { lat: 43.856430, lng: 18.413029 },
    { lat: 44.53842, lng: 18.66709 }
  ];

  constructor(private deviceService: DeviceService, private authService : AuthService, private userService: UserService, private sanitizer: DomSanitizer) {}



  ngOnInit(): void {
    this.userService.getUser().subscribe(user => {
      this.deviceService.getCompanyDevices(user.companyID).subscribe(devices => { 
        this.devices = devices; }); 
      })
      this.markerOptions = { 
      icon: { 
        url: 'assets/images/location-pin-48.png', 
        scaledSize: { width: 32, height: 32 } } 
      }; 
    }
    
  parseCoordinates(device: any): { lat: number, lng: number } {
    return { 
      lat: parseFloat(device.xCoordinate),
      lng: parseFloat(device.yCoordinate)
    };
  }
  display: any;
  center: google.maps.LatLngLiteral = {
      lat: 22.2736308,
      lng: 70.7512555
  };
  zoom = 6;

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = (event.latLng.toJSON());
}

move(event: google.maps.MapMouseEvent) {
  if (event.latLng != null) this.display = event.latLng.toJSON();
}

onDeviceTypeSelected(event: any): void {
  this.selectedDeviceTypeId = event;
  this.deviceService.getFilteredDevices(this.selectedDeviceTypeId).subscribe(x =>{
    console.log(x);
    this.devices = x;
  })
}

}
