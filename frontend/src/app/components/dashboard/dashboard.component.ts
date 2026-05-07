import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { DashboardStats, LostItem, FoundItem } from '../../models/interfaces';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatTableModule, MatButtonModule, MatChipsModule, RouterModule],
  template: `
    <div class="dashboard">
      <h1>Welcome, {{ userName }}!</h1>
      <p class="subtitle">Here's an overview of your lost and found activity.</p>

      <div class="stats-grid">
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon lost">search_off</mat-icon>
            <div>
              <h3>{{ stats?.user_lost || 0 }}</h3>
              <p>My Lost Reports</p>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon found">inventory_2</mat-icon>
            <div>
              <h3>{{ stats?.user_found || 0 }}</h3>
              <p>My Found Reports</p>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon claims">assignment</mat-icon>
            <div>
              <h3>{{ stats?.user_claims || 0 }}</h3>
              <p>My Claims</p>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon total">public</mat-icon>
            <div>
              <h3>{{ (stats?.total_lost || 0) + (stats?.total_found || 0) }}</h3>
              <p>Total Items Reported</p>
            </div>
          </div>
        </mat-card>
      </div>

      <div class="tables-grid">
        <mat-card class="table-card">
          <mat-card-header>
            <mat-card-title>Recent Lost Items</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="recentLostItems" class="full-width">
              <ng-container matColumnDef="item_name">
                <th mat-header-cell *matHeaderCellDef>Item</th>
                <td mat-cell *matCellDef="let item">{{ item.item_name }}</td>
              </ng-container>
              <ng-container matColumnDef="location_lost">
                <th mat-header-cell *matHeaderCellDef>Location</th>
                <td mat-cell *matCellDef="let item">{{ item.location_lost }}</td>
              </ng-container>
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let item">
                  <span class="status-badge" [class]="item.status">{{ item.status }}</span>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="['item_name', 'location_lost', 'status']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['item_name', 'location_lost', 'status']"></tr>
            </table>
            @if (recentLostItems.length === 0) {
              <p class="no-data">No lost items reported yet.</p>
            }
          </mat-card-content>
        </mat-card>

        <mat-card class="table-card">
          <mat-card-header>
            <mat-card-title>Recent Found Items</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="recentFoundItems" class="full-width">
              <ng-container matColumnDef="item_name">
                <th mat-header-cell *matHeaderCellDef>Item</th>
                <td mat-cell *matCellDef="let item">{{ item.item_name }}</td>
              </ng-container>
              <ng-container matColumnDef="location_found">
                <th mat-header-cell *matHeaderCellDef>Location</th>
                <td mat-cell *matCellDef="let item">{{ item.location_found }}</td>
              </ng-container>
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let item">
                  <span class="status-badge" [class]="item.status">{{ item.status }}</span>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="['item_name', 'location_found', 'status']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['item_name', 'location_found', 'status']"></tr>
            </table>
            @if (recentFoundItems.length === 0) {
              <p class="no-data">No found items reported yet.</p>
            }
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard h1 { margin: 0; color: #111827; }
    .subtitle { color: #6b7280; margin-top: 4px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin: 24px 0; }
    .stat-card { border-radius: 12px; }
    .stat-content { display: flex; align-items: center; padding: 8px; gap: 16px; }
    .stat-icon { font-size: 40px; width: 40px; height: 40px; }
    .stat-icon.lost { color: #ef4444; }
    .stat-icon.found { color: #22c55e; }
    .stat-icon.claims { color: #f59e0b; }
    .stat-icon.total { color: #4F46E5; }
    .stat-content h3 { margin: 0; font-size: 1.8rem; color: #111827; }
    .stat-content p { margin: 0; color: #6b7280; font-size: 0.85rem; }
    .tables-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 16px; }
    .table-card { border-radius: 12px; }
    .full-width { width: 100%; }
    .status-badge {
      padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 500; text-transform: capitalize;
    }
    .status-badge.pending { background: #fef3c7; color: #92400e; }
    .status-badge.matched { background: #dbeafe; color: #1e40af; }
    .status-badge.claimed { background: #dcfce7; color: #166534; }
    .no-data { text-align: center; color: #9ca3af; padding: 20px; }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  recentLostItems: LostItem[] = [];
  recentFoundItems: FoundItem[] = [];
  userName = '';

  constructor(private apiService: ApiService, private authService: AuthService) {}

  ngOnInit() {
    this.userName = this.authService.getCurrentUser()?.full_name || 'User';
    this.loadData();
  }

  loadData() {
    this.apiService.getStats().subscribe({ next: (s) => this.stats = s });
    this.apiService.getLostItems().subscribe({ next: (items) => this.recentLostItems = items.slice(0, 5) });
    this.apiService.getFoundItems().subscribe({ next: (items) => this.recentFoundItems = items.slice(0, 5) });
  }
}
