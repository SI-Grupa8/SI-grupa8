import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DeviceRequest } from '../../../core/models/device-request';
import { UserService } from '../../../core/services/http/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-device-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.scss']
})
export class DeviceDetailsComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() selectedDevice: DeviceRequest | null = null; 

  userEmail: string | undefined;
  deviceStatus: string = 'active';

  constructor(private userService: UserService) {}

  ngOnInit() {
    if (this.selectedDevice) {
      this.getUserEmail(this.selectedDevice.userID);
    }
  }

  closeDetails() {
    this.close.emit();
  }

  getUserEmail(userId: number | undefined) {
    if (userId) {
      this.userService.getUser().subscribe(
        (user: any) => {
          this.userEmail = user.email;
        },
        (error: any) => {
          console.error('Error fetching user:', error);
        }
      );
    }
  }
}
