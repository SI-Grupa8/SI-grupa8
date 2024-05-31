import { CommonModule, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CodeInputModule } from 'angular-code-input';
import { UserRequest } from '../../../core/models/user-request';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../../core/services/http/user.service';
import { ChangePasswordRequest } from '../../../core/models/change-password-request';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule,NgIf, ReactiveFormsModule, CodeInputModule , CommonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  editUserForm: FormGroup;
  changePasswordRequest: ChangePasswordRequest = {
  };

  constructor(public f: FormBuilder, public dialogRef: MatDialogRef<ChangePasswordComponent>, private userService: UserService,  @Inject(MAT_DIALOG_DATA) public data: { user: UserRequest}) {
    this.editUserForm = this.f.group({
      currentPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
    this.changePasswordRequest.userID = data.user.userID
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  get passControl() {
    return this.editUserForm.get('currentPassword');
  }

  get passControl2() {
    return this.editUserForm.get('newPassword');
  }

  edit() {
    if (this.editUserForm.invalid) {
      Object.values(this.editUserForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    this.changePasswordRequest.currentPassword = this.editUserForm.get('currentPassword')?.value;
    this.changePasswordRequest.newPassword = this.editUserForm.get('newPassword')?.value;

    console.log(this.changePasswordRequest);

    this.userService.changePassword(this.changePasswordRequest).subscribe(() => {
      console.log("Edited:");
      console.log(this.changePasswordRequest);
      console.log('User edited successfully');
      this.closeDialog();
    });
  }
}
