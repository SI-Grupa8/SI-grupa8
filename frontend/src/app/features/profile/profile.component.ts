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

  checked: boolean = false;
  private allow2faDialogOpen: boolean = true;
toggleChecked: any;

qrCode: string = '';

  constructor(
    private openEnable2faService: OpenEnable2faService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.twoFaRequest.email = localStorage.getItem("email");
    if(localStorage.getItem('checked') == "true"){
      this.checked = true;
    }
   }

  twoFaRequest: TwoFaRequest = {}
  twoFaResponse: TwoFaResponse = {}
  message='';
  openEnable2fa(): void {
   
      //this.openEnable2faService.openEnable2fa();
      //this.dialog.open(EnableTwofaComponent, { disableClose: true, });
      console.log("code:" + this.twoFaResponse.qrCodeImageUrl);
      const dialogRef = this.dialog.open(EnableTwofaComponent, {
        data: {
          imageUrl: this.twoFaResponse.qrCodeImageUrl
  
        }
        
      });
      
      
    
  }

  //openRemove2fa(): void {
    //  this.openEnable2faService.openRemove2fa();
  //}
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

  change(e: { source: { checked: boolean; }; }) {
    if (this.checked) {
      // at first, reset to the previous value
      // so that the user could not see that the mat-slide-toggle has really changed
      e.source.checked = true;

      const dialogRef = this.dialog.open(RemoveTwofaComponent);
      dialogRef.afterClosed().subscribe(response => {
        console.log( 'response ', response );
        if (response) {
           this.checked = !this.checked;
           console.log("toggle")
        } else {
          this.checked=false;
          console.log("toggle should not change if I click the cancel button")
        }
      })
    } else {
      this.checked = !this.checked;
      //this.openEnable2faService.openEnable2fa();
      console.log("aha?")
  
      this.enable2fa();
      //this.openEnable2fa();
    }
  }

  enable2fa(): void {
    console.log(this.twoFaRequest.email)
    this.allow2faDialogOpen = true;

    this.authService.enable2fa(this.twoFaRequest).subscribe({
      next: (response) => {
        if(response) {
          this.allow2faDialogOpen = true;
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
