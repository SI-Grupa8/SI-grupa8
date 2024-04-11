import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { UserService } from '../../../core/services/http/user.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-user',
  standalone: true,
  imports: [],
  templateUrl: './delete-user.component.html',
  styleUrl: './delete-user.component.scss'
})
export class DeleteUserComponent {
  userId: number =0;
  @Output() userDeleted = new EventEmitter<boolean>();

  durationInSeconds = 5;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private userService: UserService, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private deletedMessage: MatSnackBar
    ) {
      this.userId=data.userId;
    }

    
  closeDialog(): void {
    this.dialog.closeAll();
    //this.dialogClosed.emit();
    //this.dialogClosed.emit(this.twoFaEnabled);
  }
  /*
  deleteCompany() {
    this.companyService.deleteCompany().subscribe((response)=> {
      console.log(response);
    })
    localStorage.setItem('2fa', 'false');
    this.twoFaEnabled = false;
    this.closeDialog();
  }*/
  nothing() {
    //localStorage.setItem('2fa', 'true');
    this.closeDialog();
  }
  deleteUser() {
    this.userService.deleteUser(this.userId).subscribe(response => {
      this.userDeleted.emit();
  
    })
    this.openDeletedMessage();
    this.closeDialog();
  }
  openDeletedMessage() {
    this.deletedMessage.open('User deleted!', 'Close', {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
}
