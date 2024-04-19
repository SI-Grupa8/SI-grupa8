import { Component, ElementRef, OnInit, ViewChild  } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { DeviceService } from '../../core/services/http/device.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/http/auth.service';
import { DeviceFilterComponent } from './device-filter/device-filter.component';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/http/user.service';
import {  DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MapFilterComponent } from "./map-filter/map-filter.component";
import {MatChipsModule} from '@angular/material/chips';

@Component({
    selector: 'app-map',
    standalone: true,
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    imports: [GoogleMapsModule, CommonModule, DeviceFilterComponent, FormsModule, MapFilterComponent,MatChipsModule]
})

export class MapComponent implements OnInit{
  filteredDevices: any[] = [];
  
  allDevicesSelected: boolean = true;
  mobileDevicesSelected: boolean = false;
  gpsDevicesSelected: boolean = false;
  carDevicesSelected: boolean = false;

  selectAllDevices() {
    this.allDevicesSelected = true;
    this.mobileDevicesSelected = false;
    this.gpsDevicesSelected = false;
    this.carDevicesSelected = false;
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
        // Add cases for other device types if needed
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

  //markerOptions: any = {}; 

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
        this.filteredDevices = devices; }); 
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
/*
onDeviceTypeSelected(event: any): void {
  this.selectedDeviceTypeId = event;
  this.deviceService.getFilteredDevices(this.selectedDeviceTypeId).subscribe(x =>{
    console.log(x);
    this.filteredDevices = x;
  })
}*/

getFilteredDevices() {
  // Extract selected chip IDs based on their state
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

  // Call the service method to get filtered devices
  this.deviceService.getFilteredDevices(selectedDeviceTypeIds, [])
      .subscribe(devices => {
          // Update the filteredDevices attribute with the retrieved devices
          this.filteredDevices = devices;
          console.log(this.filteredDevices);
      });
  }
}
