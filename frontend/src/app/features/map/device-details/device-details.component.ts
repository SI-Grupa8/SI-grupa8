import { Component, Input } from '@angular/core';
import { DeviceRequest } from '../../../core/models/device-request';

@Component({
  selector: 'app-device-details',
  standalone: true,
  imports: [],
  templateUrl: './device-details.component.html',
  styleUrl: './device-details.component.scss'
})
export class DeviceDetailsComponent {
  @Input() selectedDevice: DeviceRequest | null = null; // Input property to receive selected device details
}
