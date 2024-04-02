import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { QRCodeModule } from 'angularx-qrcode';
import { OpenEnable2faService } from '../../../core/services/dialogs/open-enable-2fa.service';
import { AuthTfaRequest } from '../../../core/models/auth-tfa-request';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/http/auth.service';
import { VerifyRequest } from '../../../core/models/verify-request';

@Component({
  selector: 'app-enable-twofa',
  standalone: true,
  imports: [QRCodeModule, FormsModule],
  templateUrl: './enable-twofa.component.html',
  styleUrl: './enable-twofa.component.scss'
})
export class EnableTwofaComponent {
  twoFaEnabled: boolean = false;
  @Output() dialogClosed = new EventEmitter<boolean>();
  public myAngularxQrCode: string = window.location.href

  loginTfaRequest: AuthTfaRequest = {};
  verifyRequest: VerifyRequest = {};

  @Input() public imageUrl: string = localStorage.getItem("qrcode") as string;
  @Input() public key: string = localStorage.getItem("key") as string;;
  constructor(
    private twofaService: OpenEnable2faService,
    private authService: AuthService
    //private dialogRef: MatDialogRef<EnableTwofaComponent>,
    ) {
      console.log("Loaded: " + this.imageUrl);
      this.imageUrl = localStorage.getItem("qrcode") as string; 
      this.key = localStorage.getItem("key") as string; 
      this.twoFaEnabled=false;
      this.loginTfaRequest.email = localStorage.getItem("email") as string;
      this.verifyRequest.email = localStorage.getItem("email") as string;
    }

  closeDialog(): void {
    //this.dialogRef.close();
    this.twofaService.closeEnable2fa();
    this.dialogClosed.emit(this.twoFaEnabled);
  }

  loginTfa() {
    this.authService.loginTfa(this.loginTfaRequest).subscribe(response => {
      console.log( 'response: ', response );
      if (response) {
         localStorage.setItem('2fa', 'true');
         //console.log("toggle")
         this.closeDialog();
      } else {
        //this.checked=false;
        console.log("Wrong pin");
      }
    })
  }
/*
  enable2fa() {
    this.authService.enable2fa().subscribe(response => {
      if(response){
        console.log("Good pin!");
        this.closeDialog();
      }
      else {
        console.log("Wrong pin!");
      }
    })
  }
  */
  set2fa(){
    this.authService.store2fa(this.verifyRequest).subscribe(response => {
      if(response){
        console.log("Good pin!");
        localStorage.setItem("2fa", "true");
        this.twoFaEnabled = true;
        this.closeDialog();
      }
      else {
        console.log("Wrong pin!");
      }
    })
  }
  
}
