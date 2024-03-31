import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-new-device',
  standalone: true,
  imports: [],
  templateUrl: './add-new-device.component.html',
  styleUrl: './add-new-device.component.scss'
})
export class AddNewDeviceComponent {
  deviceName: string = '';

  constructor(public dialogRef: MatDialogRef<AddNewDeviceComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
  add(){

  }

}
