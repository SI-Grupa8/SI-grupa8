import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DeviceRequest } from '../../../core/models/device-request';

@Component({
  selector: 'app-device-details',
  standalone: true,
  imports: [],
  templateUrl: './device-details.component.html',
  styleUrl: './device-details.component.scss'
})
export class DeviceDetailsComponent {
  @Output() close = new EventEmitter<void>();
  @Input() selectedDevice: DeviceRequest | null = null; // Input property to receive selected device details

  closeDetails() {
    console.log("close");
    this.close.emit();
  }
}
