import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { QRCodeModule } from 'angularx-qrcode';
import { OpenEnable2faService } from '../../../core/services/dialogs/open-enable-2fa.service';
import { AuthTfaRequest } from '../../../core/models/auth-tfa-request';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/http/auth.service';

@Component({
  selector: 'app-enable-twofa',
  standalone: true,
  imports: [QRCodeModule, FormsModule],
  templateUrl: './enable-twofa.component.html',
  styleUrl: './enable-twofa.component.scss'
})
export class EnableTwofaComponent {
  public myAngularxQrCode: string = window.location.href

  loginTfaRequest: AuthTfaRequest = {};

  @Input() public imageUrl: string = localStorage.getItem("qrcode") as string;
  @Input() public  key: string = '';
  constructor(
    private twofaService: OpenEnable2faService,
    private authService: AuthService
    //private dialogRef: MatDialogRef<EnableTwofaComponent>,
    ) {
      console.log("Loaded: " + this.imageUrl);
      this.imageUrl = localStorage.getItem("qrcode") as string; 
      
      this.loginTfaRequest.email = localStorage.getItem("email") as string;
    }

  closeDialog(): void {
    //this.dialogRef.close();
    this.twofaService.closeEnable2fa();
  }

  loginTfa() {
    this.authService.loginTfa(this.loginTfaRequest).subscribe(response => {
      console.log( 'response: ', response );
      if (response) {
         localStorage.setItem('checked', 'true');
         //console.log("toggle")
         this.closeDialog();
      } else {
        //this.checked=false;
        console.log("Wrong pin");
      }
    })
  }
  
}
