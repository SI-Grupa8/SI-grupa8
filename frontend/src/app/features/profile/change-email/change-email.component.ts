import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../../core/services/http/user.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRequest } from '../../../core/models/user-request';
import { CommonModule, NgIf } from '@angular/common';
import { CodeInputModule } from 'angular-code-input';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-email',
  standalone: true,
  imports: [FormsModule,NgIf, ReactiveFormsModule, CodeInputModule , CommonModule],
  templateUrl: './change-email.component.html',
  styleUrl: './change-email.component.scss'
})
export class ChangeEmailComponent {
  @Output() userEdited: EventEmitter<any> = new EventEmitter<any>();
  editUserForm: FormGroup;
  userRequest: UserRequest = {
  };

  constructor(public f: FormBuilder, public dialogRef: MatDialogRef<ChangeEmailComponent>, private userService: UserService,  @Inject(MAT_DIALOG_DATA) public data: { user: UserRequest, companyId: number}, private snackBar: MatSnackBar) {
    this.editUserForm = this.f.group({
      email: [data.user?.email || '']
    });
    this.userRequest = data.user
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  edit(event: Event) {;
    let email = this.editUserForm.get('email')?.value;
    this.userService.getUserByEmail(email as string).subscribe({
      next: response2 => {
        this.fieldTakenPopup("This email is already taken.");
      },
      error: err => {
        this.userRequest.email = this.editUserForm.get('email')?.value
        if (err.status === 500) {
          event.preventDefault(); //////
          this.userService.changeEmail(this.userRequest).subscribe(() => {
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
