import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';
import { DashboardStats, User, Claim, ActivityLog } from '../../models/interfaces';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatTableModule, MatButtonModule, MatTabsModule, MatSnackBarModule],
  template: `
    <div class="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p class="subtitle">Manage the Campus Lost & Found system.</p>

      <div class="stats-grid">
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon" style="color:#ef4444">search_off</mat-icon>
            <div><h3>{{ stats?.total_lost || 0 }}</h3><p>Total Lost Items</p></div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon" style="color:#22c55e">inventory_2</mat-icon>
            <div><h3>{{ stats?.total_found || 0 }}</h3><p>Total Found Items</p></div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon" style="color:#f59e0b">pending_actions</mat-icon>
            <div><h3>{{ stats?.pending_claims || 0 }}</h3><p>Pending Claims</p></div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon" style="color:#4F46E5">people</mat-icon>
            <div><h3>{{ stats?.total_users || 0 }}</h3><p>Total Users</p></div>
          </div>
        </mat-card>
      </div>

      <mat-tab-group>
        <mat-tab label="Pending Claims">
          <div class="tab-content">
            <table mat-table [dataSource]="pendingClaims" class="full-width">
              <ng-container matColumnDef="claimant_name">
                <th mat-header-cell *matHeaderCellDef>Claimant</th>
                <td mat-cell *matCellDef="let c">{{ c.claimant_name }}</td>
              </ng-container>
              <ng-container matColumnDef="item_name">
                <th mat-header-cell *matHeaderCellDef>Item</th>
                <td mat-cell *matCellDef="let c">{{ c.item_name }}</td>
              </ng-container>
              <ng-container matColumnDef="proof_of_ownership">
                <th mat-header-cell *matHeaderCellDef>Proof</th>
                <td mat-cell *matCellDef="let c">{{ c.proof_of_ownership }}</td>
              </ng-container>
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let c">
                  <button mat-raised-button color="primary" (click)="updateClaim(c.id, 'approved')" style="margin-right:8px">Approve</button>
                  <button mat-raised-button color="warn" (click)="updateClaim(c.id, 'rejected')">Reject</button>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="['claimant_name','item_name','proof_of_ownership','actions']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['claimant_name','item_name','proof_of_ownership','actions']"></tr>
            </table>
            @if (pendingClaims.length === 0) {
              <p class="no-data">No pending claims.</p>
            }
          </div>
        </mat-tab>

        <mat-tab label="Users">
          <div class="tab-content">
            <table mat-table [dataSource]="users" class="full-width">
              <ng-container matColumnDef="full_name">
                <th mat-header-cell *matHeaderCellDef>Name</th>
                <td mat-cell *matCellDef="let u">{{ u.full_name }}</td>
              </ng-container>
              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let u">{{ u.email }}</td>
              </ng-container>
              <ng-container matColumnDef="role">
                <th mat-header-cell *matHeaderCellDef>Role</th>
                <td mat-cell *matCellDef="let u">
                  <span class="role-badge" [class]="u.role">{{ u.role }}</span>
                </td>
              </ng-container>
              <ng-container matColumnDef="course">
                <th mat-header-cell *matHeaderCellDef>Course</th>
                <td mat-cell *matCellDef="let u">{{ u.course }}</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="['full_name','email','role','course']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['full_name','email','role','course']"></tr>
            </table>
          </div>
        </mat-tab>

        <mat-tab label="Activity Logs">
          <div class="tab-content">
            <table mat-table [dataSource]="activityLogs" class="full-width">
              <ng-container matColumnDef="full_name">
                <th mat-header-cell *matHeaderCellDef>User</th>
                <td mat-cell *matCellDef="let l">{{ l.full_name }}</td>
              </ng-container>
              <ng-container matColumnDef="activity">
                <th mat-header-cell *matHeaderCellDef>Activity</th>
                <td mat-cell *matCellDef="let l">{{ l.activity }}</td>
              </ng-container>
              <ng-container matColumnDef="created_at">
                <th mat-header-cell *matHeaderCellDef>Date</th>
                <td mat-cell *matCellDef="let l">{{ l.created_at | date:'medium' }}</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="['full_name','activity','created_at']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['full_name','activity','created_at']"></tr>
            </table>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .admin-dashboard h1 { margin: 0; color: #111827; }
    .subtitle { color: #6b7280; margin-top: 4px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 24px 0; }
    .stat-card { border-radius: 12px; }
    .stat-content { display: flex; align-items: center; padding: 8px; gap: 16px; }
    .stat-icon { font-size: 36px; width: 36px; height: 36px; }
    .stat-content h3 { margin: 0; font-size: 1.6rem; }
    .stat-content p { margin: 0; color: #6b7280; font-size: 0.85rem; }
    .tab-content { padding: 16px 0; }
    .full-width { width: 100%; }
    .role-badge { padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 500; text-transform: capitalize; }
    .role-badge.admin { background: #ede9fe; color: #5b21b6; }
    .role-badge.user { background: #e0f2fe; color: #075985; }
    .no-data { text-align: center; color: #9ca3af; padding: 20px; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  pendingClaims: Claim[] = [];
  users: User[] = [];
  activityLogs: ActivityLog[] = [];

  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.apiService.getStats().subscribe({ next: (s) => this.stats = s });
    this.apiService.getClaims().subscribe({
      next: (claims) => this.pendingClaims = claims.filter(c => c.claim_status === 'pending')
    });
    this.apiService.getUsers().subscribe({ next: (u) => this.users = u });
    this.apiService.getActivityLogs().subscribe({ next: (l) => this.activityLogs = l });
  }

  updateClaim(id: number, status: string) {
    this.apiService.updateClaim(id, { claim_status: status }).subscribe({
      next: () => {
        this.snackBar.open(`Claim ${status} successfully!`, 'Close', { duration: 3000 });
        this.loadData();
      },
      error: () => this.snackBar.open('Failed to update claim', 'Close', { duration: 3000 })
    });
  }
}
