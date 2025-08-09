import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';
import {
  emailValidator,
  usernameValidator,
  passwordMatchValidator,
} from '../../validators/validators';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  SignupStatusMessage = signal('');
  SignupError = signal(false);

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private http = inject(HttpClient);

  get isUsernameInvalid() {
    const control = this.signupForm.get('username');
    return (
      control?.touched &&
      (control.invalid ||
        control.errors?.['maxlength'] ||
        control.errors?.['invalidUsername'])
    );
  }

  get isEmailInvalid() {
    const control = this.signupForm.get('email');
    return (
      control?.touched && (control.invalid || control.errors?.['invalidEmail'])
    );
  }

  get isPasswordInvalid() {
    const control = this.signupForm.get('password');
    return control?.touched && control.invalid;
  }

  get passwordsDoNotMatch() {
    return (
      this.signupForm.get('confirmPassword')?.touched &&
      this.signupForm.hasError('passwordMismatch')
    );
  }

  get showStatusMessage() {
    return this.SignupStatusMessage;
  }

  // Creat signup form with validators
  signupForm = this.fb.group(
    {
      // initializ a form group
      username: [
        '',
        [Validators.required, Validators.maxLength(25), usernameValidator],
      ],
      email: ['', [Validators.required, Validators.email, emailValidator]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator }
  );

  Submit() {
    if (this.signupForm.valid) {
      const { username, email, password } = this.signupForm.value;

      // Post to path (localhost:3000) used by the backend
      this.http
        .post(`${environment.apiUrl}/auth/signup`, {
          username,
          email,
          password,
        })
        .subscribe({
          next: () => {
            this.SignupStatusMessage.set('Signup successful');
            this.SignupError.set(false);

            // Redirect user after a delay
            setTimeout(() => this.router.navigate(['/signin']), 1200);
          },
          error: (error) => {
            // Show the error message from the backend
            this.SignupStatusMessage.set(
              error?.error?.message || 'Signup failed. Please try again'
            );
            this.SignupError.set(true);
          },
        });
    } else {
      this.SignupStatusMessage.set('Invalid input');
      this.SignupError.set(true);
    }
  }
}
