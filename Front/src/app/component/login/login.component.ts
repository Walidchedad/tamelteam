import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoginActive = true; // Toggle between login and sign up

  // Reactive form for Login
  loginForm: FormGroup;

  // Reactive form for Sign-Up
  signUpForm: FormGroup;

  constructor(@Inject(FormBuilder) private fb: FormBuilder) {

    // Initialize Login Form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Initialize Sign Up Form
    this.signUpForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // Toggle between Login and Sign-Up
  toggleTab(isLogin: boolean): void {
    this.isLoginActive = isLogin;
  }

  // Handle Login Form Submission
  onSubmitLogin(): void {
    if (this.loginForm.valid) {
      console.log('Login data:', this.loginForm.value);
    } else {
      console.log('Form is invalid');
    }
  }

  // Handle Sign Up Form Submission
  onSubmitSignUp(): void {
    if (this.signUpForm.valid) {
      console.log('Sign Up data:', this.signUpForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
