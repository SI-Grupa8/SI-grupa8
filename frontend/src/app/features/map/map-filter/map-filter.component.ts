import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import { DeviceService } from '../../../core/services/http/device.service';
import { AuthService } from '../../../core/services/http/auth.service';
import { DeviceRequest } from '../../../core/models/device-request';

@Component({
  selector: 'app-map-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTabsModule],
  templateUrl: './map-filter.component.html',
  styleUrl: './map-filter.component.scss'
})
export class MapFilterComponent {
  searchQuery: string = '';
  allDevices: any[] = [];
  searchedDevices: any[] = [];

  @Input() filteredDevices: any[] = [];
  @Output() closedFilter = new EventEmitter<void>();
  companyId : number = 0;
  @Output() zoomEvent = new EventEmitter<number>();
  @Output() search = new EventEmitter<DeviceRequest[]>();

  selectedDeviceIds: number[] = [];

  beforeFiltered: any[] =[];
  temp: any[] = [];
  searchDevices(): void {
    if (this.searchQuery.trim() !== '') {
      this.filteredDevices = this.beforeFiltered.filter(device => 
        device.deviceName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      this.search.emit(this.filteredDevices);
    } else {
      this.filteredDevices = this.beforeFiltered;
    }
  }

  zoomToSpecificPoint(deviceID: number) {
    console.log("deviceID:",deviceID);
    if(deviceID!=0){
      this.zoomEvent.emit(deviceID);
    }
          

  }
  onMarkerClicked(deviceID: number) {
    
    console.log('Marker clicked:', deviceID);
    
  }
  toggleActiveDevice(deviceId: number) {
    const index = this.selectedDeviceIds.indexOf(deviceId);
    if (index !== -1) {
        // If device is already selected, remove it from the array
        this.selectedDeviceIds.splice(index, 1);
    } else {
        // If device is not selected, add it to the array
        this.selectedDeviceIds.push(deviceId);
    }
}


 
isDeviceActive(deviceId: number) {
  return this.selectedDeviceIds.includes(deviceId);
}


  constructor(private deviceService: DeviceService, private authService: AuthService){
    this.authService.getCurrentUser().subscribe((res : any) => {
      this.companyId = res.companyID;
      this.getAll(res.companyID);
      
    })
    //this.searchedDevices = this.filteredDevices;
  }
  
  selectedView: string = 'view1';

  switchView() {}

  closeFilterComponent(): void {
    this.closedFilter.emit();
  }

  getAll(companyId : number): void {
    this.deviceService.getCompanyDevices(companyId).subscribe(devices => {
      this.filteredDevices = devices;
      this.beforeFiltered = devices;
    });
  }

  
}
