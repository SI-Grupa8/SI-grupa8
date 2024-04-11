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
  roles: string[] = ['Admin', 'Dispatcher', 'Driver'];
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
      password: [''],
      companyId:[''],
      roleID: 1
    });
    this.companyId = data.companyId;

  }

  closeDialog(): void {
    this.dialogRef.close();
    //this.openAddedUserMessage();
  }

  add(event: Event) {
    this.userRequest.email = this.addAdminForm.get('email')?.value;
    this.userRequest.name = this.addAdminForm.get('name')?.value;
    this.userRequest.surname = this.addAdminForm.get('surname')?.value;
    this.userRequest.password = this.addAdminForm.get('password')?.value;
    this.userRequest.companyID=this.companyId;
    this.userRequest.roleID=1;
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