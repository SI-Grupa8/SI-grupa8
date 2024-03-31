import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddNewDeviceComponent } from './add-new-device/add-new-device.component';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.scss'
})
export class DevicesComponent {
  modalVisible: boolean = false;

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(AddNewDeviceComponent, {
      disableClose: true 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  edit(){

  }
  delete(){
    
  }
}
