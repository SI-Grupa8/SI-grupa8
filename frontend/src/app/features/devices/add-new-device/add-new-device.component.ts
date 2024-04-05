import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DeviceRequest } from '../../../core/models/device-request';
import { DeviceService } from '../../../core/services/http/device.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { CodeInputModule } from 'angular-code-input';

@Component({
  selector: 'app-add-new-device',
  standalone: true,
  imports: [FormsModule,NgIf, ReactiveFormsModule, CodeInputModule],
  templateUrl: './add-new-device.component.html',
  styleUrl: './add-new-device.component.scss'
})
export class AddNewDeviceComponent {
  @Output() deviceAdded: EventEmitter<any> = new EventEmitter<any>();

  addDeviceForm: FormGroup;
  deviceRequest: DeviceRequest = {
  };

  constructor(public f: FormBuilder,public dialogRef: MatDialogRef<AddNewDeviceComponent>, private deviceService: DeviceService) {
    this.addDeviceForm = this.f.group({
      deviceName: [''],
      user: [''],
      ref: [''],
      xcoord: [''], 
      ycoord: ['']
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  add(event: Event){
    this.deviceRequest.deviceName = this.addDeviceForm.get('deviceName')?.value;
      this.deviceRequest.reference = this.addDeviceForm.get('ref')?.value;
      //hardkodiran userID
      this.deviceRequest.userID=1;
      this.deviceRequest.xCoordinate = this.addDeviceForm.get('xcoord')?.value;
      this.deviceRequest.yCoordinate = this.addDeviceForm.get('ycoord')?.value;

      event.preventDefault();
    this.deviceService.createDevice(this.deviceRequest).subscribe(()=>{
      this.deviceAdded.emit();
      console.log('Device added successfully');
      this.closeDialog();
    });
  }

}