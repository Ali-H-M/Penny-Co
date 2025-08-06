import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private fb = inject(FormBuilder); // Injecting the FormBuilder 

  // Creat login form with validators
  loginForm: FormGroup = this.fb.group({ // initializ a form group
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  Submit() {
    if (this.loginForm.valid) {
      // TODO:
    }
  }
}
