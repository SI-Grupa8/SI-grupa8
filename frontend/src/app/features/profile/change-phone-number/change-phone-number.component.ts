import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../../core/services/http/user.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRequest } from '../../../core/models/user-request';
import { CommonModule, NgIf } from '@angular/common';
import { CodeInputModule } from 'angular-code-input';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-phone-number',
  standalone: true,
  imports: [FormsModule,NgIf, ReactiveFormsModule, CodeInputModule , CommonModule],
  templateUrl: './change-phone-number.component.html',
  styleUrl: './change-phone-number.component.scss'
})
export class ChangePhoneNumberComponent {
  @Output() userEdited: EventEmitter<any> = new EventEmitter<any>();
  editUserForm: FormGroup;
  userRequest: UserRequest = {
  };

  constructor(public f: FormBuilder, public dialogRef: MatDialogRef<ChangePhoneNumberComponent>, private userService: UserService,  @Inject(MAT_DIALOG_DATA) public data: { user: UserRequest, companyId: number}, private snackBar: MatSnackBar) {
    this.editUserForm = this.f.group({
      phoneNumber: [data.user?.phoneNumber || '']
    });
    this.userRequest = data.user
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  edit(event: Event) {
    let phoneNumber = this.editUserForm.get('phoneNumber')?.value
    this.userService.getUserByPhoneNumber(phoneNumber).subscribe({
      next: response2 => {
        this.fieldTakenPopup("This phone number is already taken.");
      },
      error: err => {
        this.userRequest.phoneNumber = phoneNumber;
        if (err.status === 500) {
          this.userService.changePhoneNumber(this.userRequest).subscribe(() => {
            this.userEdited.emit();
            console.log("Edited:");
            console.log(this.userRequest);
            console.log('User edited successfully');
            this.closeDialog();
          });
        } else {
          console.error("An unexpected error occurred:", err);
        }
      }
    });
    
    /*this.userService.changePhoneNumber(this.userRequest).subscribe(() => {
      this.userEdited.emit();
      console.log("Edited:");
      console.log(this.userRequest);
      console.log('User edited successfully');
      this.closeDialog();
    });*/

    /*this.userService.getUserByPhoneNumber(this.userRequest.phoneNumber as string).subscribe({
      next: response => {
        this.fieldTakenPopup("This phone number is already taken.");
      },
      error: err => {
        this.userService.changePhoneNumber(this.userRequest).subscribe(() => {
          this.userEdited.emit();
          console.log("Edited:");
          console.log(this.userRequest);
          console.log('User edited successfully');
          this.closeDialog();
        });
      }
    });*/
  }

  fieldTakenPopup(str: string) {
    this.snackBar.open(str, 'Close', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      politeness: 'assertive'
    });
  }
}