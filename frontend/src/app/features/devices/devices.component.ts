import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddNewDeviceComponent } from './add-new-device/add-new-device.component';
import { DeviceService } from '../../core/services/http/device.service';
import { DeviceResponse } from '../../core/models/device-response';
import { DeviceRequest } from '../../core/models/device-request';
import { UpdateDeviceRequest } from '../../core/models/update-device-request';
import { DeleteDeviceRequest } from '../../core/models/delete-device-request';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.scss'
})
export class DevicesComponent {
  modalVisible: boolean = false;
  devices: DeviceResponse[] = [];

  constructor(public dialog: MatDialog,
    private deviceService: DeviceService) { }

  ngOnInit(): void {
    this.getAll();
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(AddNewDeviceComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  edit(device: any): void {
    const adminEmail = localStorage.getItem("email")!;
    const request: UpdateDeviceRequest = {
      adminEmail: adminEmail,
      deviceId: device.id
    };
    this.deviceService.updateDevice(request).subscribe(() => {
      console.log('Device updated successfully');
    });
  }

  delete(device: DeviceResponse): void {
    const adminEmail = localStorage.getItem("email")!;

    const request: DeleteDeviceRequest = {
      adminEmail: adminEmail,
      deviceId: device.id
    };
    this.deviceService.deleteDevice(request).subscribe(() => {
      console.log('Device deleted successfully');
    });

  }

  getAll(): void {
    const adminEmail = localStorage.getItem("email")!;

    const request: DeviceRequest = { adminEmail:adminEmail};
    this.deviceService.getCompanyDevices(request).subscribe(devices => {
      this.devices = devices;
    });
  }
}
