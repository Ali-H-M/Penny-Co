import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private userSub!: Subscription;
  
  user = signal(this.authService.getCurrentUser());

  ngOnInit() {
     // Get initial value immediately
    const initialUser = this.authService.getCurrentUser();
    if (initialUser) {
      this.user.set(initialUser);
    }

    // Subscribe to future changes
    this.authService.currentUser.subscribe(user => {
      this.user.set(user);
    });
  }
  
  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }
}