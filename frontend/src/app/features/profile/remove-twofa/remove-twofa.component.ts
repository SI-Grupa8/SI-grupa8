import { Component } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { OpenEnable2faService } from '../../../core/services/dialogs/open-enable-2fa.service';
import { TwoFaRequest } from '../../../core/models/two-fa-request';
import { AuthService } from '../../../core/services/http/auth.service';

@Component({
  selector: 'app-remove-twofa',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './remove-twofa.component.html',
  styleUrl: './remove-twofa.component.scss'
})
export class RemoveTwofaComponent {

  twoFaRequest: TwoFaRequest = {}//, item.getStorage na false

  constructor(
    //private dialogRef: MatDialogRef<RemoveTwofaComponent>,
    private twofaService: OpenEnable2faService,
    private authService: AuthService
    ) {
      this.twoFaRequest.email = localStorage.getItem("email");
    }

    

  closeDialog(): void {
    this.twofaService.closeRemove2fa();
  }
  disable2fa() {
    this.authService.disable2fa(this.twoFaRequest);
    localStorage.setItem('checked', 'false');
    this.closeDialog();
  }
  nothing() {
//this.authService.enable2fa(this.twoFaRequest);
    localStorage.setItem('checked', 'true');
    this.closeDialog();
  }
}
