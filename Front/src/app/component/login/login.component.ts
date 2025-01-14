import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../auth.service';
import { SharedService } from '../../shared/shared.service';


@Component({
  standalone: true,
  selector: 'app-login',
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule, RouterModule,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  signUpForm!: FormGroup;
  isLoginActive = true;
  showAlert: boolean = false;
  alertMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    // Initialize login and signup forms
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
    });
  }

  // Method to toggle between login and sign-up forms
  toggleTab(isLogin: boolean): void {
    this.isLoginActive = isLogin;
  }

  // Method to submit login form
  onSubmitLogin(): void {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      this.http.post('http://localhost:3000/login', loginData).subscribe(
        (response: any) => {
          const email = response.email; // Récupérer l'email de la réponse
          localStorage.setItem('email', email); // Optionnel : stocker dans localStorage
          this.sharedService.setEmail(email); // Stocker l'email dans le service partagé
          console.log('Login successful', response);

          this.showAlert = true;
          this.authService.setUser(response.firstName);
          this.alertMessage = 'Login successful! Welcome back.';
          setTimeout(() => {
            this.showAlert = false;
            this.router.navigate(['Acc_after_login']);
          }, 2000);
        },
        (error) => {
          this.showAlert = true;
          this.alertMessage = 'Login failed! Please try again.';
          setTimeout(() => {
            this.showAlert = false;
          }, 2000);
        }
      );
    }
  }

  // Method to submit sign-up form
  onSubmitSignUp(): void {
    if (this.signUpForm.valid) {
      const signUpData = this.signUpForm.value;
      this.http
        .post('http://localhost:3000/signup', signUpData)
        .subscribe(
          (response) => {
            console.log('Sign Up successful', response);
            this.showAlert = true;
            this.alertMessage = 'signup successful! Welcome to VoteDAIA.';
            setTimeout(() => {
              this.showAlert = false;
              window.location.reload();
            }, 2000);
          },
          (error) => {
            console.error('Sign Up failed', error);
            this.showAlert = true;
            this.alertMessage = 'SignUp failed! Because this email already exists.';
            setTimeout(() => {
              this.showAlert = false;
            }, 2000);
          }
        );
    }
  }
  
}
