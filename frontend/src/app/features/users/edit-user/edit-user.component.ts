import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { UserRequest } from '../../../core/models/user-request';
import { UserService } from '../../../core/services/http/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControl,Validators,ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CodeInputModule } from 'angular-code-input';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [FormsModule,NgIf, ReactiveFormsModule, CodeInputModule , CommonModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent {
  @Output() userEdited: EventEmitter<any> = new EventEmitter<any>();
  editUserForm: FormGroup;
  userRequest: UserRequest = {
  };

  roles: string[] = ['Admin', 'Dispatcher', 'FleetManager', 'User'];

  constructor(public f: FormBuilder,public dialogRef: MatDialogRef<EditUserComponent>, private userService: UserService, @Inject(MAT_DIALOG_DATA) public data: { user: UserRequest, companyId: number}) {
    this.editUserForm = this.f.group({
      name: [data.user?.name || ' '],
      surname: [data.user?.surname || ''],
      email: [data.user?.email || ''],
      password: [data.user?.password || '', [Validators.minLength(8)]],
      role: [this.getRoleName(data.user?.roleID) || '']
    });
    this.userRequest = data.user
    //this.userRequest.companyID = data.companyId;
  }

  getRoleName(roleID: number | undefined): string | null {
    if (typeof roleID === 'undefined') {
      return null; // Return null if roleID is undefined
    }
  
    switch (roleID) {
      case 1:
        return 'Admin';
      case 2:
        return 'SuperAdmin';
      case 3:
        return 'Dispatcher';
      case 4:
        return 'FleetManager';
      case 5:
        return 'User';
      default:
        return null;
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  get passControl() {
    return this.editUserForm.get('password');
  }


  edit(event: Event) {
    if (this.editUserForm.invalid) {
      Object.values(this.editUserForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    this.userRequest.email = this.editUserForm.get('email')?.value;
    this.userRequest.name = this.editUserForm.get('name')?.value;
    this.userRequest.surname = this.editUserForm.get('surname')?.value;
    this.userRequest.companyID = this.data.user.companyID;
    this.userRequest.password = this.data.user.password;
    this.userRequest.userID = this.data.user.userID;
    
    const selectedRole = this.editUserForm.get('role')?.value;
    console.log("Iz forme je:"+ selectedRole);

    // Map the selected role to the corresponding role ID
    switch(selectedRole) {
        case 'Admin':
            this.userRequest.roleID = 1; // Assuming 'Admin' corresponds to role ID 1

            break;
        //case 'SuperAdmin':
          //  this.userRequest.roleID = 2; // Assuming 'SuperAdmin' corresponds to role ID 2
            //break;
        case 'Dispatcher':
            //document.getElementById('')
            this.userRequest.roleID = 3; // Assuming 'Dispatcher' corresponds to role ID 3
            break;
        case 'FleetManager':
            this.userRequest.roleID = 4; // Assuming 'Driver' corresponds to role ID 4
            break;
        case 'User':
            this.userRequest.roleID = 5; // Assuming 'Driver' corresponds to role ID 4
            break;
        default:
            this.userRequest.roleID = 0; // Default to role ID 1 if no matching role found
            break;
    }

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