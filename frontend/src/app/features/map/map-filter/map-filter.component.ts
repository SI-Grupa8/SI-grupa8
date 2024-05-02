import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
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
  @Output() emptyMap = new EventEmitter<void>();
  @Output() fillMap = new EventEmitter<void>();
  @Output() updateMap = new EventEmitter<DeviceRequest>();
  @Output() zoomDevice = new EventEmitter<DeviceRequest>();
  @Output() zoomRoute = new EventEmitter<DeviceRequest>();
  @Output() zoomDefault = new EventEmitter<void>();

  selectedDeviceIds: number[] = [];

  beforeFiltered: any[] =[];
  temp: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filteredDevices'] && changes['filteredDevices'].currentValue) {
      console.log('Filtered devices changed:', changes['filteredDevices'].currentValue);
      this.higlightAllDevices();
    }
  }


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

  zoomToSpecificPoint(device: DeviceRequest, event: MouseEvent) {
    if(device.isHighlighted){
    console.log("deviceID:",device.deviceID);
    if(device.deviceID!=0){
      this.zoomEvent.emit(device.deviceID);
    }
    }
    event.stopPropagation();
  }

  onMarkerClicked(deviceID: number) {
    console.log('Marker clicked:', deviceID);
  }

  toggleActiveDevice(device: DeviceRequest, event: MouseEvent) {
    if(device.isHighlighted){
    const index = this.selectedDeviceIds.indexOf(device.deviceID!);
    if (index !== -1) {
        // If device is already selected, remove it from the array
        this.selectedDeviceIds.splice(index, 1);
    } else  if(this.selectedDeviceIds.length<5){
        // If device is not selected, add it to the array
        this.selectedDeviceIds.push(device.deviceID!);
    }
    }
    event.stopPropagation();
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
      // The method is called here to ensure devices are selected in the checkbox when being loaded
      this.higlightAllDevices();
    });
  }

  //isHighlighted: boolean = false;

  onDeviceIconClicked(event: MouseEvent, device:any) {
    // This method will be triggered when the button is clicked
    // You can handle button click events here, such as triggering a trip
    // Stop propagation to prevent the div click event from being triggered
    device.isHighlighted = !device.isHighlighted;
    console.log("Just button clicked");
    this.updateMap.emit(device);
    event.stopPropagation();
}

higlightAllDevices(): void {
  // Loop through each device and set its isHighlighted property to true
  this.filteredDevices.forEach(device => {
      device.isHighlighted = true;
  });
  this.fillMap.emit();
}

hideAllDevices(): void {
  // Loop through each device and set its isHighlighted property to false
  this.filteredDevices.forEach(device => {
    device.isHighlighted = false;
  });
  this.emptyMap.emit();
}

zoomToDevice(device: any){
  if(device.isHighlighted){
    this.zoomDevice.emit(device);
  }
}

zoomToRoute(device: any) {
  this.zoomEvent.emit(device.deviceID); // Emit the device ID event
  this.zoomRoute.emit(device); // Emit the device object event
}

zoomToDefault(): void{
  this.zoomDefault.emit()
}

checkTripButtonClicked(device: DeviceRequest, event: MouseEvent) {
  //this.zoomEvent.emit(device.deviceID); // Emit the device ID event
  if (this.selectedDeviceIds.length != 0) {
    if(this.selectedDeviceIds.includes(device.deviceID!)){
    this.zoomRoute.emit(device);
    }
  }
  else{
    this.zoomDevice.emit(device);
  }
}
  
}
