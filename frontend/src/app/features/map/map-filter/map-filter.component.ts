import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
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
export class MapFilterComponent implements OnInit {
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
  toggled: boolean = false;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filteredDevices'] && changes['filteredDevices'].currentValue) {
      console.log('Filtered devices changed:', changes['filteredDevices'].currentValue);
      // this.higlightAllDevices();
    }
  }

  ngOnInit(): void {
    
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
        this.tripButtonList.push(device.deviceID);
    }
    }
    event.stopPropagation();
    this.toggled = true;
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

  tripButtonList: any[] = [];

  getAll(companyId : number): void {
    this.deviceService.getCompanyDevices(companyId).subscribe(devices => {
      this.beforeFiltered = devices;
      // this.filteredDevices = devices;
      // The method is called here to ensure devices are selected in the checkbox when being loaded
      // this.higlightAllDevices();
      this.selectedDeviceIds = this.tripButtonList;
    });
  }

  //isHighlighted: boolean = false;

  onDeviceIconClicked(event: MouseEvent, device:any) {
    device.isHighlighted = !device.isHighlighted;
    console.log("Just button clicked");
    // empties the selectedDeviceIds, so the color of trip button changes so that its function doesn't invert
    // maybe the other option is to check if the selectedDeviceIds is empty, and if it is not just enable the device to be clickable
    this.selectedDeviceIds = [];
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
    this.selectedDeviceIds = [];
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
  if(device.isHighlighted){
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
  
}
