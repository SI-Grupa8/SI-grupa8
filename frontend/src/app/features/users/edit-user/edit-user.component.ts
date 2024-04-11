import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { UserRequest } from '../../../core/models/user-request';
import { UserService } from '../../../core/services/http/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControl,Validators,ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CodeInputModule } from 'angular-code-input';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [FormsModule,NgIf, ReactiveFormsModule, CodeInputModule ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent {
  @Output() userEdited: EventEmitter<any> = new EventEmitter<any>();
  editUserForm: FormGroup;
  userRequest: UserRequest = {
  };

  constructor(public f: FormBuilder,public dialogRef: MatDialogRef<EditUserComponent>, private userService: UserService, @Inject(MAT_DIALOG_DATA) public data: { user: UserRequest, companyId: number}) {
    this.editUserForm = this.f.group({
      name: [data.user?.name || ' '],
      surname: [data.user?.surname || ''],
      email: [data.user?.email || ''],
      password: [data.user?.password || '']
    });
    this.userRequest = data.user
    //this.userRequest.companyID = data.companyId;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }


  edit(event: Event) {
    
    this.userRequest.email = this.editUserForm.get('email')?.value;
    this.userRequest.name = this.editUserForm.get('name')?.value;
    this.userRequest.surname = this.editUserForm.get('surname')?.value;
    this.userRequest.companyID = this.data.user.companyID;
    this.userRequest.password = this.data.user.password;
    this.userRequest.userID = this.data.user.userID;

    event.preventDefault();
    this.userService.updateUser(this.userRequest).subscribe(() => {
      this.userEdited.emit();
      console.log("Edited:");
      console.log(this.userRequest);
      console.log('User edited successfully');
      this.closeDialog();
    });
  }
}