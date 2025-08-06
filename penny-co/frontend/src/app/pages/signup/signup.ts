import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {

    private fb = inject(FormBuilder);

  // Creat signup form with validators
   signupForm = this.fb.group({ // initializ a form group
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
});


  Submit() {
    if (this.signupForm.valid) {
      // const { email, password, confirmPassword } = this.signupForm.value; TODO:
     
    }
  }
}
