import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';


export function passwordMatchValidator(
  control: AbstractControl
): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

export function usernameValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  const validPattern = new RegExp('^[a-zA-Z0-9\\-]+$');
  if (!validPattern.test(value)) {
    return { invalidUsername: true };
  }
  return null;
}

export function emailValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  // Angular built-in email validator
  const emailError = Validators.email(control);
  if (emailError) return emailError;

  // Custome XSS protection
  const xssPattern = new RegExp('[<>"\'\\`]');  // <, >, ", ', `
  if (xssPattern.test(value)) {
    return { xssEmail: true };
  }

  return null;
}
