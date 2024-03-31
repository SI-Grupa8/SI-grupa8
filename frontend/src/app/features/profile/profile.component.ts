import { Component } from '@angular/core';
import { OpenEnable2faService } from '../../core/services/dialogs/open-enable-2fa.service';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { RemoveTwofaComponent } from './remove-twofa/remove-twofa.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { AuthService } from '../../core/services/http/auth.service';
import { TwoFaRequest } from '../../core/models/two-fa-request';
import { TwoFaResponse } from '../../core/models/two-fa-response';
import { EnableTwofaComponent } from './enable-twofa/enable-twofa.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatInputModule,MatFormFieldModule,MatSelectModule,MatSlideToggleModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  twoFaEnabled: boolean = false;
  qrCode: string = '';

  constructor(
    private openEnable2faService: OpenEnable2faService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.twoFaRequest.email = localStorage.getItem("email");
    if(localStorage.getItem('checked') == "true"){
      this.twoFaEnabled = true;
    }
   }

  twoFaRequest: TwoFaRequest = {}
  twoFaResponse: TwoFaResponse = {}
  message='';

  openEnable2fa(): void {
    //this.enable2fa();
      console.log("code:" + this.twoFaResponse.qrCodeImageUrl);
      const dialogRef = this.dialog.open(EnableTwofaComponent, {
        data: {
          imageUrl: this.twoFaResponse.qrCodeImageUrl,
          key: this.twoFaResponse.manualEntryKey
        }
        
      });
  }

  openRemove2fa(): void {
    this.openEnable2faService.openRemove2fa();
  }
/*
  toggleChanged(event: any) {
    if (event.target.checked) {
      this.allow2faDialogOpen = true;
      //this.openEnable2fa();
    } else {
      this.allow2faDialogOpen = false;
      this.openRemove2fa();
    }
  }*/


  enable2fa(): void {
    console.log(this.twoFaRequest.email)
    //this.allow2faDialogOpen = true;

    this.authService.enable2fa().subscribe({
      next: (response) => {
        if(response) {
          //this.allow2faDialogOpen = true;
          this.twoFaResponse = response;
          localStorage.setItem("qrcode", this.twoFaResponse.qrCodeImageUrl as string);
          console.log("key: " +this.twoFaResponse.manualEntryKey);
          console.log("image:" + this.twoFaResponse.qrCodeImageUrl);
          this.openEnable2fa();
        }
        else {
          console.log("nothing");
        }
      }
    })
  }
}
