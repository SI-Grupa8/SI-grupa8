import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserRequest } from '../../../core/models/user-request';
import { UserService } from '../../../core/services/http/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControl,Validators,ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CodeInputModule } from 'angular-code-input';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';


@Component({
  selector: 'app-add-new-admin',
  standalone: true,
  imports: [FormsModule, NgIf, ReactiveFormsModule, CodeInputModule, CommonModule ],
  templateUrl: './add-new-admin.component.html',
  styleUrl: './add-new-admin.component.scss'
})export class AddNewAdminComponent {
  @Output() userAdded: EventEmitter<any> = new EventEmitter<any>();
  addAdminForm: FormGroup;
  userRequest: UserRequest = {};
  companyId: number = 0;
  roles: string[] = ['Admin', 'Dispatcher', 'FleetManager', 'User'];
  //companies: any[]; 

  constructor(
    public f: FormBuilder,
    public dialogRef: MatDialogRef<AddNewAdminComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private addedUserMessage: MatSnackBar
  ) {


    this.addAdminForm = this.f.group({
      name: [''],
      surname: [''],
      email: [''],
      password: ['', [Validators.required, Validators.minLength(8)]],
      companyId:[''],
      role: new FormControl(this.roles),
    });
    this.companyId = data.companyId;

  }

  closeDialog(): void {
    this.dialogRef.close();
    //this.openAddedUserMessage();
  }

  get passControl() {
    return this.addAdminForm.get('password');
  }

  add(event: Event) {
    if (this.addAdminForm.invalid) {
      Object.values(this.addAdminForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    this.userRequest.email = this.addAdminForm.get('email')?.value;
    this.userRequest.name = this.addAdminForm.get('name')?.value;
    this.userRequest.surname = this.addAdminForm.get('surname')?.value;
    this.userRequest.password = this.addAdminForm.get('password')?.value;
    this.userRequest.companyID=this.companyId;
    

    const selectedRole = this.addAdminForm.get('role')?.value;
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

    //this.userRequest.roleID=1;
    event.preventDefault();
    this.userService.addUser(this.userRequest).subscribe(() => {
      this.userAdded.emit();
      console.log('Admin added successfully');
      this.closeDialog();
      this.openAddedUserMessage();
    });
  }

  durationInSeconds = 5;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  openAddedUserMessage() {
    this.addedUserMessage.open('User added!', 'Close', {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
}