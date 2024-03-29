import { Component } from '@angular/core';
import { NgIf } from '@angular/common'; 
import { FormBuilder,FormControl,FormGroup,Validators,ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CodeInputComponent, CodeInputModule } from 'angular-code-input';
import { AuthRequest } from '../../core/models/auth-request';
import { AuthService } from '../../core/services/http/auth.service';
import { AuthResponse } from '../../core/models/auth-response';
import { Route, Router } from '@angular/router';
import { AuthTfaRequest } from '../../core/models/auth-tfa-request';
import { AuthTfaResponse } from '../../core/models/auth-tfa-response';


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
  imports: [NgIf, ReactiveFormsModule, CodeInputModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  temp=true;

  authRequest: AuthRequest = {};
  authRequestTfa: AuthTfaRequest = {};
  authResponseTfa: AuthTfaResponse = {};
  loginForm: FormGroup;
  authResponse: AuthResponse = {};
  constructor(private f: FormBuilder, private authService: AuthService, private router: Router){
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
  login() {
    this.authService.login(this.authRequest)
      .subscribe({
        next: (response) => {
          this.authResponse = response;
          console.log(response);
          if (!this.authResponse.twoFaEnabled) {
            localStorage.setItem('email', this.authResponse.email as string);
            localStorage.setItem('token', this.authResponse.token as string);
            localStorage.setItem("checked", "false");

            console.log(this.authResponse.email)
            console.log(this.authResponse.token);
            //this.authService.setRefreshToken();
            this.router.navigate(['profile']);
          }
          else {
            this.temp = false;
            this.authRequestTfa.email = this.authRequest.email;

          }
        }
      });
  }
  verify(){
    //this.authRequestTfa.twoFactorCodeSix
    this.authService.loginTfa(this.authRequestTfa).subscribe({
      next: (response) => {
        this.authResponseTfa = response;
        localStorage.setItem('email', this.authResponse.email as string);
            localStorage.setItem('token', this.authResponse.token as string);
            localStorage.setItem("checked", "true");
            //this.authService.setRefreshToken();

            console.log(this.authResponse.email)
            console.log(this.authResponse.token);
            this.router.navigate(['profile']);
            
      }
    })
  }


}
