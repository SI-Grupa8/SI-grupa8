import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DeviceService } from '../../../core/services/http/device.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-device-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './device-filter.component.html',
  styleUrl: './device-filter.component.scss'
})
export class DeviceFilterComponent implements OnInit {

  selectedDeviceType: number = 0;
  @Output() deviceTypeSelectedId = new EventEmitter<number[]>();

  constructor(private deviceService : DeviceService){}

  deviceFilter : any[] = []

  ngOnInit(){
    this.deviceService.getDeviceTypes().subscribe(x => {
      this.deviceFilter = x;
    })
  }

  applyFilter(){
    const selectedTypes = this.deviceFilter.filter(type => type.selected).map(type => type.deviceTypeID);
    this.deviceTypeSelectedId.emit(selectedTypes);
  }


}
