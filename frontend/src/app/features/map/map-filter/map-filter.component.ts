import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import { DeviceService } from '../../../core/services/http/device.service';
import { AuthService } from '../../../core/services/http/auth.service';

@Component({
  selector: 'app-map-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTabsModule],
  templateUrl: './map-filter.component.html',
  styleUrl: './map-filter.component.scss'
})
export class MapFilterComponent {


  @Input() filteredDevices: any[] = [];
  @Output() closedFilter = new EventEmitter<void>();
  companyId : number = 0;
  @Output() zoomEvent = new EventEmitter<number>();

  activeDeviceId: number | null = null; // Track the ID of the active device

  zoomToSpecificPoint(deviceID: number) {
    this.zoomEvent.emit(deviceID);
  }

  toggleActiveDevice(deviceId: number) {
    if (this.activeDeviceId === deviceId) {
      // If the clicked device ais already active, deactivate it
      this.activeDeviceId = null;
    } else {
      // Otherwise, activate the clicked device
      this.activeDeviceId = deviceId;
    }
  }

  // Function to check if a device is active
  isDeviceActive(deviceId: number) {
    return this.activeDeviceId === deviceId;
  }

  constructor(private deviceService: DeviceService, private authService: AuthService){
    this.authService.getCurrentUser().subscribe((res : any) => {
      this.companyId = res.companyID;
      this.getAll(res.companyID);
    })
  }
  
  //filteredDevices: any[] = [];
  //selectedView: string = '';
  selectedView: string = 'view1';

  switchView() {}

  closeFilterComponent(): void {
    this.closedFilter.emit();
  }

  getAll(companyId : number): void {
    this.deviceService.getCompanyDevices(companyId).subscribe(devices => {
      this.filteredDevices = devices;
    });
  }

  
}
