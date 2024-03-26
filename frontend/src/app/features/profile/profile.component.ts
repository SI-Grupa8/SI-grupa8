import { Component } from '@angular/core';
import { OpenEnable2faService } from '../../core/services/dialogs/open-enable-2fa.service';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatInputModule,MatFormFieldModule,MatSelectModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  constructor(
    private openEnable2faService: OpenEnable2faService
  ){}
  openEnable2fa(): void {
    this.openEnable2faService.openEnable2fa();
  }
  openRemove2fa(): void {
    this.openEnable2faService.openRemove2fa();
  }

  toggleChanged(event: any) {
    if (event.target.checked) {
      this.openEnable2fa();
    } else {
      this.openRemove2fa();
    }
  }
}
