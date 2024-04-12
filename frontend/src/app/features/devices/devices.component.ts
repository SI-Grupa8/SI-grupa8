import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddNewDeviceComponent } from './add-new-device/add-new-device.component';
import { DeviceService } from '../../core/services/http/device.service';
import { DeviceRequest } from '../../core/models/device-request';
import { CommonModule } from '@angular/common';
import { EditDeviceComponent } from './edit-device/edit-device.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/http/auth.service';
import { NoopScrollStrategy } from '@angular/cdk/overlay';


@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.scss'
})
export class DevicesComponent {
  @Output() deviceDeleted: EventEmitter<any> = new EventEmitter<any>();
  
  modalVisible: boolean = false;
  devices: DeviceRequest[] = [];
  deviceRequest: DeviceRequest = {
    userID: 0
  };
  companyId : number = 0;
  searchQuery: string = ''; 

  constructor(public dialog: MatDialog,
    private deviceService: DeviceService, private authService : AuthService) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((res : any) => {
      this.companyId = res.companyID;
      this.getAll(res.companyID);
    })
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(AddNewDeviceComponent, {
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy()
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
    dialogRef.componentInstance.deviceAdded.subscribe(() => {
      this.getAll(this.companyId); // Refresh table after user is added
    });
  }

  editDialog(device: any): void {
    const dialogRef = this.dialog.open(EditDeviceComponent, {
      scrollStrategy: new NoopScrollStrategy(),
      disableClose: true ,
      data: { device: device }
    });
    console.log(device)
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
    dialogRef.componentInstance.deviceEdited.subscribe(() => {
      this.getAll(this.companyId); // Refresh table after user is added
    });

  }

  delete(device:any, event: Event): void {
    console.log(device);
    const deviceId=device.deviceID;
    event.preventDefault();

    const confirmDelete = window.confirm('Are you sure you want to delete this device?');

    if(confirmDelete) {
      this.deviceService.deleteDevice(deviceId).subscribe(() => {
        this.deviceDeleted.emit();
        console.log('Device deleted successfully');
        this.getAll(this.companyId);
      });
    }

  }
  
  filterDevices(): void {
    this.deviceService.getCompanyDevices(this.companyId).subscribe(devices => {
      this.devices = devices.filter(device => 
        device.deviceName.toLowerCase().startsWith(this.searchQuery.toLowerCase()) ||
        device.reference.toLowerCase().startsWith(this.searchQuery.toLowerCase()) ||
        device.user.company.companyName.toLowerCase().startsWith(this.searchQuery.toLowerCase())
      );
    });
  }

  getAll(companyId : number): void {
    this.deviceService.getCompanyDevices(companyId).subscribe(devices => {
      this.devices = devices;
      this.filterDevices();
    });
  }
}
