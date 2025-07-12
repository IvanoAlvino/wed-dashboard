import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <div class="login-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Login to Rate Talks</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <mat-form-field appearance="outline">
              <mat-label>Username</mat-label>
              <input matInput formControlName="username" required>
              <mat-error *ngIf="loginForm.get('username')?.hasError('required')">
                Username is required
              </mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" required>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
            </mat-form-field>
            
            <button mat-raised-button color="primary" type="submit" 
                    [disabled]="loginForm.invalid || isLoading">
              {{isLoading ? 'Logging in...' : 'Login'}}
            </button>
          </form>
          
          <div class="demo-info">
            <p><strong>Demo Credentials:</strong></p>
            <p>Username: <code>demo</code> | Password: <code>password</code></p>
            <p>Username: <code>admin</code> | Password: <code>password</code></p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 50px auto;
      padding: 20px;
    }
    
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 20px;
    }
    
    .demo-info {
      margin-top: 20px;
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .demo-info code {
      background-color: #e0e0e0;
      padding: 2px 4px;
      border-radius: 2px;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open('Login failed. Please check your credentials.', 'Close', { duration: 5000 });
        }
      });
    }
  }
}
