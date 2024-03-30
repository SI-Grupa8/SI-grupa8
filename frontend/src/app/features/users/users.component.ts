import { Component } from '@angular/core';
import { NgIf } from '@angular/common'; 
import { FormBuilder,FormControl,FormGroup,Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/http/auth.service';
import { RegisterRequest } from '../../core/models/register-request';
import { AuthResponse } from '../../core/models/auth-response';

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

  addingUser: RegisterRequest = {};
  authResponse: AuthResponse = {};
  message = '';
  registerForm: FormGroup;
  constructor(private f: FormBuilder, private router: Router, private authService: AuthService){
    this.registerForm = this.f.group({
      usermail: ['', [Validators.required, emailOrPhoneValidator]],
      pass:['', [Validators.required]]
    });
  }

  addNewUser(): void {
    this.authService.register(this.addingUser).subscribe({
      next: (response) => {
        if(response) {
          this.authResponse = response;
        }
        else {
          this.message= 'Successfully added user!';
        }
      }
    })
  }

  edit() {

  }

  delete() {

  }
  
  

}
