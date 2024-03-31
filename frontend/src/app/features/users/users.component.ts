import { Component } from '@angular/core';
import { NgIf } from '@angular/common'; 
import { FormBuilder,FormControl,FormGroup,Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/http/auth.service';
import { RegisterRequest } from '../../core/models/register-request';
import { MatDialog } from '@angular/material/dialog';
import { AuthResponse } from '../../core/models/auth-response';
import { AddNewUserComponent } from './add-new-user/add-new-user.component';

function emailOrPhoneValidator(control: FormControl) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phonePattern = /^\d{10}$/;

  if (!emailPattern.test(control.value) && !phonePattern.test(control.value)) {
    return { invalidFormat: true };
  }
  return null;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, FormsModule, RouterModule ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})


export class UsersComponent {
  modalVisible: boolean = false;

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(AddNewUserComponent, {
      disableClose: true 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  edit(){

  }
  delete(){
    
  }
}
