import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DeviceRequest } from '../../../core/models/device-request';
import { DeviceService } from '../../../core/services/http/device.service';

@Component({
  selector: 'app-add-new-device',
  standalone: true,
  imports: [],
  templateUrl: './add-new-device.component.html',
  styleUrl: './add-new-device.component.scss'
})
export class AddNewDeviceComponent {
  deviceName: string = '';

  constructor(public dialogRef: MatDialogRef<AddNewDeviceComponent>, private deviceService: DeviceService) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
  add(){
    const adminEmail = localStorage.getItem("email")!;
    const request: DeviceRequest = {
      adminEmail: adminEmail,
    };

    this.deviceService.createDevice(request).subscribe(()=>{
      console.log('Device added successfully');
    });
  }

}
