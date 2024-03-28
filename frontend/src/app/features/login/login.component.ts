import { Component } from '@angular/core';
import { NgIf } from '@angular/common'; 
import { FormBuilder,FormControl,FormGroup,Validators,ReactiveFormsModule } from '@angular/forms';
import { CodeInputComponent, CodeInputModule } from 'angular-code-input';
import { AuthRequest } from '../../core/models/auth-request';
import { AuthService } from '../../core/services/http/auth.service';


function emailOrPhoneValidator(control: FormControl) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phonePattern = /^\d{10}$/;

  if (!emailPattern.test(control.value) && !phonePattern.test(control.value)) {
    return { invalidFormat: true };
  }
  return null;
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, CodeInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  temp=true;

  authRequest: AuthRequest = {};

  loginForm: FormGroup;
  constructor(private f: FormBuilder, private authService: AuthService){
    this.loginForm = this.f.group({
      usermail: ['', [Validators.required, emailOrPhoneValidator]],
      pass:['', [Validators.required]]
    });
  }


  onClick(): void{
    this.temp=!this.temp;

    if(this.loginForm.valid){
      console.log('It is valid!')
    }
    else{
      console.log('Invalid form.')
    }
  }

  forgotPass(): void{
    console.log("Link is clicked, must add logic.")
  }


  //code related
  onCodeChanged(code: string) {

  }
  onCodeCompleted(code: string) {
    
  }
  login(): void {
    this.authService.login(this.authRequest);
  }

}
