import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { environment } from '../../environment';

interface User {
  _id: string;
  username: string;
  email: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private userSub!: Subscription;
  
  user = signal(this.authService.getCurrentUser());
  allUsers = signal<User[]>([]);
  isLoading = signal(false);

  ngOnInit() {
    // Get current user
    const initialUser = this.authService.getCurrentUser();
    if (initialUser) {
      this.user.set(initialUser);
    }
    // Get all users username/email
    this.fetchUsers();
  }
  
    fetchUsers() {
    this.isLoading.set(true);
    this.http.get<User[]>(`${environment.apiUrl}/users`).subscribe({
      next: (users) => {
        this.allUsers.set(users);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }
}