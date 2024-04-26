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
import { UserService } from '../../core/services/http/user.service';
import { UserRequest } from '../../core/models/user-request';
import { ChangeEmailComponent } from './change-email/change-email.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

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
userData: any={};
  constructor(
    private openEnable2faService: OpenEnable2faService,
    private dialog: MatDialog,
    private authService: AuthService,
    private userService:  UserService
  ) {
    this.twoFaRequest.email = localStorage.getItem("email");
    if(localStorage.getItem('2fa') == "true"){
      this.twoFaEnabled = true;
    }
   }

  twoFaRequest: TwoFaRequest = {}
  twoFaResponse: TwoFaResponse = {}
  message='';
ngOnInit(): void{
  if(localStorage.getItem("email")){
    this.userService.getUser().subscribe(
      (data) => {
        this.userData = data;
      },
  )};
};
  openEnable2fa(): void {
    //this.get2fa();
      console.log("code:" + this.twoFaResponse.qrCodeImageUrl);
      const dialogRef = this.dialog.open(EnableTwofaComponent, {
        data: {
          imageUrl: this.twoFaResponse.qrCodeImageUrl,
          key: this.twoFaResponse.manualEntryKey,          
        }        
      });
      dialogRef.componentInstance.dialogClosed.subscribe((twoFaEnabled: boolean) => {
        this.twoFaEnabled = twoFaEnabled;
      });
  }
  get2fa() {
    this.authService.enable2fa().subscribe({
      next: (response) => {
        if(response) {
          this.twoFaResponse = response;
          localStorage.setItem("qrcode", this.twoFaResponse.qrCodeImageUrl as string);
          localStorage.setItem("key", this.twoFaResponse.manualEntryKey as string);
          this.openEnable2fa();
        }
        else {
          console.log("Could not open enable 2fa");
        }
      }
    })
  }
  openRemove2fa(): void {
    const dialogRef = this.dialog.open(RemoveTwofaComponent, {});
    dialogRef.componentInstance.dialogClosed.subscribe((twoFaEnabled: boolean) => {
      this.twoFaEnabled = twoFaEnabled;
    });
  }

  editEmailDialog(user: UserRequest): void {
    const dialogRef = this.dialog.open(ChangeEmailComponent, {
      disableClose: true ,
      data: { user: user }
      // scrollStrategy: new NoopScrollStrategy()
    });
    console.log(user)
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
     dialogRef.componentInstance.userEdited.subscribe(() => {
      console.log("evo update")
       // Refresh after user is edited
       this.userService.getUser().subscribe((userData) => {
        this.userData = userData;
      });
     });

  }

  editPasswordDialog(user: UserRequest): void {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      disableClose: true ,
      data: { user: user }
      // scrollStrategy: new NoopScrollStrategy()
    });
    console.log(user)
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
    //  dialogRef.componentInstance.userEdited.subscribe(() => {
    //   console.log("evo update")
    //    // Refresh after user is edited
    //    this.userService.getUser().subscribe((userData) => {
    //     this.userData = userData;
    //   });
    //  });

  }

}
