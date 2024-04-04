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

  edit(event: Event) {
    
  }
  /*add(event: Event){
    this.deviceRequest.deviceName = this.addDeviceForm.get('deviceName')?.value;
      this.deviceRequest.reference = this.addDeviceForm.get('ref')?.value;
      this.deviceRequest.xCoordinate = this.addDeviceForm.get('xcoord')?.value;
      this.deviceRequest.yCoordinate = this.addDeviceForm.get('ycoord')?.value;

      event.preventDefault();
    this.deviceService.createDevice(this.deviceRequest).subscribe(()=>{
      this.deviceAdded.emit();
      console.log('Device added successfully');
      this.closeDialog();
    });*/
}

