import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserRequest } from '../../../core/models/user-request';
import { UserService } from '../../../core/services/http/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControl,Validators,ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CodeInputModule } from 'angular-code-input';
import { NgIf } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-new-user',
  standalone: true,
  imports: [FormsModule,NgIf, ReactiveFormsModule, CodeInputModule ],
  templateUrl: './add-new-user.component.html',
  styleUrl: './add-new-user.component.scss'
})
export class AddNewUserComponent {
  @Output() userAdded: EventEmitter<any> = new EventEmitter<any>();
  addUserForm: FormGroup;
  userRequest: UserRequest = {
  };

  constructor(public f: FormBuilder,public dialogRef: MatDialogRef<AddNewUserComponent>, private userService: UserService, private snackBar: MatSnackBar) {
    this.addUserForm = this.f.group({
      name: [''],
      surname: [''],
      role:[''],
      email: [''],
      phoneNumber: [''],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
    
  }

  get passControl() {
    return this.addUserForm.get('password');
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  add(event: Event) {
    if (this.addUserForm.invalid) {
      Object.values(this.addUserForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    this.userRequest.email = this.addUserForm.get('email')?.value;
    this.userRequest.phoneNumber = this.addUserForm.get('phoneNumber')?.value;
    this.userRequest.name = this.addUserForm.get('name')?.value;
    this.userRequest.surname = this.addUserForm.get('surname')?.value;
    this.userRequest.password = this.addUserForm.get('password')?.value;
    this.userRequest.roleID=this.addUserForm.get('role')?.value;

    event.preventDefault();
    this.userService.getUserByEmail(this.userRequest.email as string).subscribe({
      next: response => {
        this.fieldTakenPopup("This email is already taken.");
      },
      error: err => {
        this.userService.getUserByPhoneNumber(this.userRequest.phoneNumber as string).subscribe({
          next: response => {
            this.fieldTakenPopup("This phone number is already taken.");
          },
          error: err => {
            this.userService.addUser(this.userRequest).subscribe(() => {
              this.userAdded.emit();
              console.log('User added successfully');
              this.closeDialog();
            });
          }
        });
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

