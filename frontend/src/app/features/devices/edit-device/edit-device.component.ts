import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeviceRequest } from '../../../core/models/device-request';
import { DeviceService } from '../../../core/services/http/device.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { CodeInputModule } from 'angular-code-input';

@Component({
  selector: 'app-edit-device',
  standalone: true,
  imports: [FormsModule,NgIf, ReactiveFormsModule, CodeInputModule],
  templateUrl: './edit-device.component.html',
  styleUrl: './edit-device.component.scss'
})
export class EditDeviceComponent {
  @Output() deviceEdited: EventEmitter<any> = new EventEmitter<any>();
  editDeviceForm: FormGroup;
  deviceRequest: DeviceRequest = {
    userID: 1
  };
  constructor(public f: FormBuilder,public dialogRef: MatDialogRef<EditDeviceComponent>, private deviceService: DeviceService,  @Inject(MAT_DIALOG_DATA) public data: { device: any }) {
    this.editDeviceForm = this.f.group({
      deviceName: [data.device.deviceName],
      ref: [data.device.reference],
      xcoord: [data.device.xCoordinate], 
      ycoord: [data.device.yCoordinate]
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  edit(device:any, event: Event) {
    const deviceId = device.deviceID;
    console.log(deviceId)
    this.deviceRequest.deviceName = this.editDeviceForm.get('deviceName')?.value;
    this.deviceRequest.reference = this.editDeviceForm.get('ref')?.value;
    this.deviceRequest.xCoordinate = this.editDeviceForm.get('xcoord')?.value;
    this.deviceRequest.yCoordinate = this.editDeviceForm.get('ycoord')?.value;
    this.deviceRequest.userID = this.data.device.userID;
    this.deviceRequest.deviceTypeID = this.data.device.deviceTypeID;
    this.deviceRequest.deviceID = deviceId;
    event.preventDefault();
    this.deviceService.updateDevice(this.deviceRequest).subscribe(() => {
      this.deviceEdited.emit();
      console.log('Device edited successfully');
      this.closeDialog();
    });
  }
}

