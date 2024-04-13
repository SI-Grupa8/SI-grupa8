import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../../core/services/http/user.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRequest } from '../../../core/models/user-request';
import { CommonModule, NgIf } from '@angular/common';
import { CodeInputModule } from 'angular-code-input';

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

  constructor(public f: FormBuilder, public dialogRef: MatDialogRef<ChangeEmailComponent>, private userService: UserService,  @Inject(MAT_DIALOG_DATA) public data: { user: UserRequest, companyId: number}) {
    this.editUserForm = this.f.group({
      email: [data.user?.email || '']
    });
    this.userRequest = data.user
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  edit(event: Event) {
    // if (this.editUserForm.invalid) {
    //   Object.values(this.editUserForm.controls).forEach(control => {
    //     control.markAsTouched();
    //   });
    //   return;
    // }

    this.userRequest.email = this.editUserForm.get('email')?.value;
    // this.userRequest.name = this.editUserForm.get('name')?.value;
    // this.userRequest.surname = this.editUserForm.get('surname')?.value;
    // this.userRequest.companyID = this.data.user.companyID;
    // this.userRequest.password = this.data.user.password;
    // this.userRequest.userID = this.data.user.userID;
    
    // const selectedRole = this.editUserForm.get('role')?.value;
    // console.log("Iz forme je:"+ selectedRole);

    this.userService.changeEmail(this.userRequest).subscribe(() => {
      this.userEdited.emit();
      console.log("Edited:");
      console.log(this.userRequest);
      console.log('User edited successfully');
      this.closeDialog();
    });
  }

}
