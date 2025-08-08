import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environment';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './signin.html',
  styleUrl: './signin.css',
})
export class Signin {

  private fb = inject(FormBuilder); // Injecting the FormBuilder 
  private http = inject(HttpClient);
  private router = inject(Router);

  // Creat signin form with validators
  singinForm: FormGroup = this.fb.group({ // initializ a form group
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  SigninStatusMessage = signal('');
  SigninError = signal('');

  Submit() {
  if (this.singinForm.valid) {

    const { email, password } = this.singinForm.value;

    // Post to path (localhost:3000) used by the backend
      this.http.post(`${environment.apiUrl}/auth/signin`, {
        email, 
        password,
      }).subscribe({
        next: () => {
          this.SigninStatusMessage.set('Sign In successful');
          this.SigninError.set('');
          this.router.navigate(['./dashboard']); // Redirect user to dashboard page
        },
        error: (err) => {
          this.SigninStatusMessage.set('');
          this.SigninError.set(err.error.message || 'Sign In failed');
        }
      });
    }
  }

  hasError(control: string): boolean {
    const c = this.singinForm.get(control);
    return !!(c && c.invalid && c.touched);
  }
}
