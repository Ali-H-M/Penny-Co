import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from './environment';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  SignupStatusMessage = '';
  SignupError = false;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private http = inject(HttpClient);

  get isPasswordInvalid() {
  const pwd = this.signupForm.get('password');
  return pwd?.invalid && pwd?.touched;
  }

  get passwordsDoNotMatch() {
  return this.signupForm.hasError('passwordMismatch') &&
         this.signupForm.get('confirmPassword')?.touched;
  }

  get showStatusMessage() {
  return this.SignupStatusMessage;
  }

  // Creat signup form with validators
  signupForm = this.fb.group(
    {
      // initializ a form group
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator }
  );

  Submit() {
    if (this.signupForm.valid) {
      const { username, email, password } = this.signupForm.value;

      // Post to path (localhost:3000) used by the backend
      this.http.post(`${environment.apiUrl}/auth/signup`, {
          username,
          email,
          password,
        })
        .subscribe({
          next: () => {
            this.SignupStatusMessage = 'Signup successful';
            this.SignupError = false;

            // Redirect user after a delay
            setTimeout(() => this.router.navigate(['/login']), 2000);
          },
          error: (error) => {
            // Show the error message from the backend
            this.SignupStatusMessage =
              error?.error?.message || 'Signup failed. Please try again.';
            this.SignupError = true;
          },
        });
    } else {
      this.SignupStatusMessage = 'Invalid input.';
      this.SignupError = true;
    }
  }
}

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

