import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  template: `
    <div class="profile-page">
      <h1>My Profile</h1>
      <p class="subtitle">Manage your account information.</p>

      <mat-card class="profile-card">
        <div class="profile-header">
          <mat-icon class="avatar-icon">account_circle</mat-icon>
          <div>
            <h2>{{ profileForm.get('full_name')?.value }}</h2>
            <p>{{ user?.email }}</p>
            <span class="role-badge" [class]="user?.role || ''">{{ user?.role }}</span>
          </div>
        </div>

        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Full Name</mat-label>
              <input matInput formControlName="full_name">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Course/Program</mat-label>
              <input matInput formControlName="course">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Year Level</mat-label>
              <input matInput formControlName="year_level">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Contact Number</mat-label>
              <input matInput formControlName="contact_number">
            </mat-form-field>
          </div>
          <button mat-raised-button color="primary" type="submit" [disabled]="profileForm.invalid || loading">
            {{ loading ? 'Saving...' : 'Update Profile' }}
          </button>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-page h1 { margin: 0; color: #111827; }
    .subtitle { color: #6b7280; margin-top: 4px; margin-bottom: 16px; }
    .profile-card { padding: 32px; border-radius: 12px; max-width: 600px; }
    .profile-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #e5e7eb; }
    .avatar-icon { font-size: 64px; width: 64px; height: 64px; color: #4F46E5; }
    .profile-header h2 { margin: 0; }
    .profile-header p { margin: 4px 0; color: #6b7280; }
    .role-badge { padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 500; text-transform: capitalize; }
    .role-badge.admin { background: #ede9fe; color: #5b21b6; }
    .role-badge.user { background: #e0f2fe; color: #075985; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }
  `]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: any;
  loading = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private snackBar: MatSnackBar) {
    this.profileForm = this.fb.group({
      full_name: ['', Validators.required],
      course: [''],
      year_level: [''],
      contact_number: ['']
    });
  }

  ngOnInit() {
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm.patchValue(user);
      }
    });
  }

  onSubmit() {
    this.loading = true;
    this.authService.updateProfile(this.profileForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to update profile', 'Close', { duration: 3000 });
      }
    });
  }
}
