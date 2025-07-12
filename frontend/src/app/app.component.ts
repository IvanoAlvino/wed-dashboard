import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="main-container">
      <mat-toolbar color="primary">
        <span>WeAreDevelopers Conference Rating</span>
        <span class="spacer"></span>
        
        <div *ngIf="currentUser$ | async as user; else loginButtons">
          <span>Welcome, {{user.username}}!</span>
          <button mat-button (click)="logout()">
            <mat-icon>logout</mat-icon>
            Logout
          </button>
        </div>
        
        <ng-template #loginButtons>
          <button mat-button (click)="navigateToLogin()">
            <mat-icon>login</mat-icon>
            Login
          </button>
        </ng-template>
      </mat-toolbar>
      
      <div class="content-container">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    
    .main-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }
    
    .content-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
  `]
})
export class AppComponent {
  currentUser$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
