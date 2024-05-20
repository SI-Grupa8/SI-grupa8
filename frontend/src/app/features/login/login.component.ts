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
import { MatSnackBar } from '@angular/material/snack-bar';


function emailOrPhoneValidator(control: FormControl) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phonePattern = /^\d{9}$/;

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
  showLoginForm=true;
  refreshToken = '';
  authRequest: AuthRequest = {
    phoneNumber: ''
  };
  authRequestTfa: AuthTfaRequest = {};
  authResponseTfa: AuthTfaResponse = {};
  loginForm: FormGroup;
  loginTwofaForm: FormGroup;
  authResponse: AuthResponse = {};

  

  constructor(private f: FormBuilder, private authService: AuthService, private router: Router, private snackBar: MatSnackBar){
    this.loginForm = this.f.group({
      email: ['', [Validators.required, emailOrPhoneValidator]],
      pass:['', [Validators.required, Validators.minLength(8)]]
    });
    this.loginTwofaForm = this.f.group({
      pincode:['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    })
  }

// for more readable validation in html
  get emailControl() {
    return this.loginForm.get('email');
  }
  get passControl() {
    return this.loginForm.get('pass');
  }
  get pinControl() {
    return this.loginTwofaForm.get('pincode');
  }


// auth methods
  forgotPass(): void{
    console.log("Link is clicked, must add logic.")
  }

  login() {

    const input = this.loginForm.get('email')?.value;
    if (input.match(/^\d{9}$/)) { 
      this.authRequest.phoneNumber = input;
    } else {
      this.authRequest.email = input;
    } 
    // Mark all form controls as touched to display errors
    if (this.loginForm.invalid) {
      Object.values(this.loginForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    this.authRequest.password = this.loginForm.get('pass')?.value;

    this.authService.login(this.authRequest)
      .subscribe({
        next: (response) => {
          setTimeout(() => {
            this.router.navigate(['login']); ///logout after 30 minutes 
            localStorage.clear();
            this.expiredSessionPopup();
          }, 1000 * 60 * 30);
          this.authResponse = response;
          console.log(response);
          if (!this.authResponse.twoFaEnabled) {
            localStorage.setItem('email', this.authResponse.email as string);
            localStorage.setItem('token', this.authResponse.token as string);
            localStorage.setItem('2fa', this.authResponse.twoFaEnabled as unknown as string);

            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 30); 
            console.log(expirationDate);
            document.cookie = "refresh="+this.authResponse.refresh+"; expires="+expirationDate;

            localStorage.setItem("refresh", this.authResponse.refresh as string);
            console.log(this.authResponse.email)
            console.log(this.authResponse.token);
            this.authService.setUserRole(response.role);
            this.router.navigate(['']);
            this.authService.getCurrentUser().subscribe((res  : any)=> {
              this.authService.user.next(res);
            })
          }
          else {
            this.showLoginForm = false;
            this.authRequestTfa.email = this.authRequest.email;
          }
        },
        error: error => {
          this.showInvalid2FAPopup("Wrong password!");
      }
      });
      
  }
  verify(){
    // Mark all form controls as touched to display errors
    if (this.loginForm.invalid) {
      Object.values(this.loginForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    this.authRequestTfa.email = this.authRequest.email;
    this.authRequestTfa.twoFactorCodeSix = this.loginTwofaForm.get('pincode')?.value;
    this.authService.loginTfa(this.authRequestTfa).subscribe({
      next: (response) => {
        this.authResponseTfa = response;
        localStorage.setItem('email', this.authResponseTfa.email as string);
        localStorage.setItem('token', this.authResponseTfa.token as string);
        localStorage.setItem("2fa", "true");
        document.cookie = "refresh="+this.authResponseTfa.refresh+"; expires="+this.authResponse.expires;
        localStorage.setItem("refresh", this.authResponseTfa.refresh as string);
        this.authService.setUserRole(response.role);

        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30); 
        console.log(expirationDate);
        document.cookie = "refresh="+this.authResponse.refresh+"; expires="+expirationDate;

        this.router.navigate(['']);
            
      },
        error: error => {
          this.showInvalid2FAPopup("Wrong pin!");
      }
    })
  }

  expiredSessionPopup(str: string = "Your session has expired!") {
    this.snackBar.open(str, 'Close', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      politeness: 'assertive'
    });
  }

  showInvalid2FAPopup(str: string) {
    this.snackBar.open(str, 'Close', {
      duration: 2000, 
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}
