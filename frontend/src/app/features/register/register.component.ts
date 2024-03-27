import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';


function emailOrPhoneValidator(control: FormControl) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phonePattern = /^\d{10}$/;

  if (!emailPattern.test(control.value) && !phonePattern.test(control.value)) {
    return { invalidFormat: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  temp=true;

  registerForm: FormGroup;
  constructor(private f: FormBuilder, private router: Router){
    this.registerForm = this.f.group({
      usermail: ['', [Validators.required, emailOrPhoneValidator]],
      pass:['', [Validators.required]]
    });
  }

  click(): void {
    this.router.navigateByUrl('/profile');
  }

  onClick(): void{
    this.temp=!this.temp;

    if(this.registerForm.valid){
      console.log('It is valid!')
    }
    else{
      console.log('Invalid form.')
    }
  }

  forgotPass(): void{
    console.log("Link is clicked, must add logic.")
  }
}
