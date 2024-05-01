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

  activeDeviceId: number | null = null; 
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
  zoomToSpecificPoint(deviceID: number) {
    this.zoomEvent.emit(deviceID);
  }
  onMarkerClicked(deviceID: number) {
    
    console.log('Marker clicked:', deviceID);
    
  }
  toggleActiveDevice(deviceId: number) {
    if (this.activeDeviceId === deviceId) {
      
      this.activeDeviceId = null;
    } else {
      
      this.activeDeviceId = deviceId;
    }
  }

 
  isDeviceActive(deviceId: number) {
    return this.activeDeviceId === deviceId;
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
  
}
