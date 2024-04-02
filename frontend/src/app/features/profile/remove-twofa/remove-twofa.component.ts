import { Component, EventEmitter, Output } from '@angular/core';
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
  twoFaEnabled: boolean = true;
  twoFaRequest: TwoFaRequest = {}//, item.getStorage na false
  @Output() dialogClosed = new EventEmitter<boolean>();
  constructor(
    //private dialogRef: MatDialogRef<RemoveTwofaComponent>,
    private twofaService: OpenEnable2faService,
    private authService: AuthService
    ) {
      this.twoFaRequest.email = localStorage.getItem("email");
    }

    

  closeDialog(): void {
    this.twofaService.closeRemove2fa();
    this.dialogClosed.emit(this.twoFaEnabled);
  }
  disable2fa() {
    this.authService.disable2fa().subscribe((response)=> {
      console.log(response);
    })
    localStorage.setItem('2fa', 'false');
    this.twoFaEnabled = false;
    this.closeDialog();
  }
  nothing() {
//this.authService.enable2fa(this.twoFaRequest);
    localStorage.setItem('2fa', 'true');
    this.closeDialog();
  }
}
