import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signin.html',
  styleUrl: './signin.css',
})
export class Signin implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  signinForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  SigninStatusMessage = signal('');
  SigninError = signal('');
  isLoading = signal(false);

  ngOnInit() {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  Submit() {
    this.SigninStatusMessage.set('');
    this.SigninError.set('');
    
    if (!this.signinForm.valid) {
      this.SigninError.set('Please fill in all required fields correctly');
      return;
    }

    this.isLoading.set(true);
    const { email, password } = this.signinForm.value;

    // AuthService handles everything including navigation
    this.authService.signin(email, password).subscribe({
      next: (response) => {
        this.SigninStatusMessage.set('Sign in successful!');
        this.isLoading.set(false);
        // Navigation is handled by AuthService
      },
      error: (error) => {
        this.SigninError.set(
          error.error?.message || 'Incorrect email or password'
        );
        this.isLoading.set(false);
      }
    });
  }

  hasError(control: string): boolean {
    const c = this.signinForm.get(control);
    return !!(c && c.invalid && c.touched);
  }
}