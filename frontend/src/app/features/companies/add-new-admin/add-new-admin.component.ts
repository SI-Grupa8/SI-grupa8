import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserRequest } from '../../../core/models/user-request';
import { UserService } from '../../../core/services/http/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControl,Validators,ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CodeInputModule } from 'angular-code-input';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';


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
  //companies: any[]; 

  constructor(
    public f: FormBuilder,
    public dialogRef: MatDialogRef<AddNewAdminComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {


    this.addAdminForm = this.f.group({
      name: [''],
      surname: [''],
      email: [''],
      password: [''],
      companyId:[''],
      roleID: 1
    });
    //this.companies = data.companies;

  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  add(event: Event) {
    this.userRequest.email = this.addAdminForm.get('email')?.value;
    this.userRequest.name = this.addAdminForm.get('name')?.value;
    this.userRequest.surname = this.addAdminForm.get('surname')?.value;
    this.userRequest.password = this.addAdminForm.get('password')?.value;
    this.userRequest.companyID=this.addAdminForm.get('companyId')?.value;
    this.userRequest.roleID=1;
    event.preventDefault();
    this.userService.addUser(this.userRequest).subscribe(() => {
      this.userAdded.emit();
      console.log('Admin added successfully');
      this.closeDialog();
    });
  }
}