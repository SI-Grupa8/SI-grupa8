import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DeviceRequest } from '../../../core/models/device-request';
import { UserService } from '../../../core/services/http/user.service';

@Component({
  selector: 'app-device-details',
  standalone: true,
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.scss']
})
export class DeviceDetailsComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() selectedDevice: DeviceRequest | null = null; 

  userName: string | undefined;

  constructor(private userService: UserService) {}

  ngOnInit() {
    if (this.selectedDevice) {
      this.getUserName(this.selectedDevice.userID);
    }
  }

  closeDetails() {
    this.close.emit();
  }

  getUserName(userId: number | undefined) {
    if (userId) {
      this.userService.getUser().subscribe(
        (user: any) => {
          this.userName = user.email;
        },
        (error: any) => {
          console.error('Error fetching user:', error);
        }
      );
    }
  }
}
