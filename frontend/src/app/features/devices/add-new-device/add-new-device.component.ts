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
  deviceRequest: DeviceRequest = {
    adminId: 0
  };

  constructor(public dialogRef: MatDialogRef<AddNewDeviceComponent>, private deviceService: DeviceService) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
  add(){
    this.deviceService.createDevice(this.deviceRequest).subscribe(()=>{
      console.log('Device added successfully');
    });
  }

}
