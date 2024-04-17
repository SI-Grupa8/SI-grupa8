import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserRequest } from '../../../core/models/user-request';
import { UserService } from '../../../core/services/http/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControl,Validators,ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CodeInputModule } from 'angular-code-input';
import { NgIf } from '@angular/common';
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

  constructor(public f: FormBuilder,public dialogRef: MatDialogRef<AddNewUserComponent>, private userService: UserService) {
    this.addUserForm = this.f.group({
      name: [''],
      surname: [''],
      role:[''],
      email: [''],
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
    this.userRequest.name = this.addUserForm.get('name')?.value;
    this.userRequest.surname = this.addUserForm.get('surname')?.value;
    this.userRequest.password = this.addUserForm.get('password')?.value;
    this.userRequest.roleID=this.addUserForm.get('role')?.value;

    event.preventDefault();
    this.userService.addUser(this.userRequest).subscribe(() => {
      this.userAdded.emit();
      console.log('User added successfully');
      this.closeDialog();
    });

    
  }
}
