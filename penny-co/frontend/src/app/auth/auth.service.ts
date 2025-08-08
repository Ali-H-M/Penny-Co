import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { tap, catchError, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { environment } from '../environment';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthResponse {
  access_token: string;
  user: User;
  expires_in: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private user = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser = this.user.asObservable();

  private getStoredUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  signin(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/signin`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          console.log('Auth response received:', response);
          this.storeAuthData(response);
          this.user.next(response.user);

          // Navigate after state is updated
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 0); // Use setTimeout to ensure state update is processed
        }),
        catchError((error) => {
          console.error('Login failed:', error);
          return throwError(() => error);
        })
      );
  }

  // Waits for authentication state to be fully initialized
  // Needed for components that need to ensure auth state is ready
  async waitForAuthInit(): Promise<boolean> {
    if (this.user.value) {
      return true;
    }

    try {
      const user = await firstValueFrom(this.user.pipe(take(1)));
      return user !== null;
    } catch {
      return false;
    }
  }

  // Verify current token with backend
  verifyToken(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }

    return this.http
      .get(`${environment.apiUrl}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        catchError((error) => {
          // If token is invalid, clean up
          this.logout();
          return throwError(() => error);
        })
      );
  }

  private storeAuthData(response: AuthResponse): void {
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.user.next(null);
    this.router.navigate(['/signin']);
  }

  isLoggedIn(): boolean {
    return !!this.user.value && !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.user.value;
  }
}
