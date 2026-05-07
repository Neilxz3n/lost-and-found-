import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSelectModule, MatSnackBarModule],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <div class="register-header">
          <mat-icon class="register-logo">search</mat-icon>
          <h1>Create Account</h1>
          <p>Join the Campus Lost & Found system</p>
        </div>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Full Name</mat-label>
            <input matInput formControlName="full_name">
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email">
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput formControlName="password" type="password">
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Course/Program</mat-label>
            <input matInput formControlName="course">
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Year Level</mat-label>
            <mat-select formControlName="year_level">
              <mat-option value="1st Year">1st Year</mat-option>
              <mat-option value="2nd Year">2nd Year</mat-option>
              <mat-option value="3rd Year">3rd Year</mat-option>
              <mat-option value="4th Year">4th Year</mat-option>
              <mat-option value="5th Year">5th Year</mat-option>
              <mat-option value="Graduate">Graduate</mat-option>
              <mat-option value="Faculty">Faculty</mat-option>
              <mat-option value="Staff">Staff</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Contact Number</mat-label>
            <input matInput formControlName="contact_number">
          </mat-form-field>
          <button mat-raised-button color="primary" class="full-width register-btn" type="submit" [disabled]="registerForm.invalid || loading">
            {{ loading ? 'Creating Account...' : 'Register' }}
          </button>
        </form>
        <div class="login-link">
          <p>Already have an account? <a routerLink="/login">Sign in</a></p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex; justify-content: center; align-items: center;
      min-height: 100vh; background: linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%);
      padding: 20px;
    }
    .register-card { max-width: 480px; width: 90%; padding: 32px; border-radius: 12px; }
    .register-header { text-align: center; margin-bottom: 20px; }
    .register-logo { font-size: 40px; width: 40px; height: 40px; color: #4F46E5; }
    .register-header h1 { margin: 8px 0 4px; font-size: 1.4rem; color: #111827; }
    .register-header p { color: #6b7280; margin: 0; }
    .full-width { width: 100%; }
    .register-btn { height: 48px; font-size: 1rem; margin-top: 8px; }
    .login-link { text-align: center; margin-top: 16px; }
    .login-link a { color: #4F46E5; text-decoration: none; font-weight: 500; }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      full_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      course: [''],
      year_level: [''],
      contact_number: ['']
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;
    this.loading = true;
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Registration successful! Please sign in.', 'Close', { duration: 3000 });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.error?.message || 'Registration failed', 'Close', { duration: 3000 });
      }
    });
  }
}
