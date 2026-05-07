import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule, MatButtonModule, MatBadgeModule, MatMenuModule],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav mode="side" opened class="sidenav">
        <div class="sidenav-header">
          <mat-icon class="logo-icon">search</mat-icon>
          <h2>Campus L&F</h2>
        </div>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
          @if (isAdmin) {
            <a mat-list-item routerLink="/admin" routerLinkActive="active">
              <mat-icon matListItemIcon>admin_panel_settings</mat-icon>
              <span>Admin Panel</span>
            </a>
          }
          <a mat-list-item routerLink="/lost-items" routerLinkActive="active">
            <mat-icon matListItemIcon>search_off</mat-icon>
            <span>Lost Items</span>
          </a>
          <a mat-list-item routerLink="/found-items" routerLinkActive="active">
            <mat-icon matListItemIcon>inventory_2</mat-icon>
            <span>Found Items</span>
          </a>
          <a mat-list-item routerLink="/claims" routerLinkActive="active">
            <mat-icon matListItemIcon>assignment</mat-icon>
            <span>Claims</span>
          </a>
          <a mat-list-item routerLink="/notifications" routerLinkActive="active">
            <mat-icon matListItemIcon [matBadge]="unreadCount > 0 ? unreadCount : null" matBadgeColor="warn" matBadgeSize="small">notifications</mat-icon>
            <span>Notifications</span>
          </a>
          <a mat-list-item routerLink="/profile" routerLinkActive="active">
            <mat-icon matListItemIcon>person</mat-icon>
            <span>Profile</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary" class="toolbar">
          <button mat-icon-button (click)="sidenav.toggle()">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="toolbar-title">Campus Lost & Found</span>
          <span class="spacer"></span>
          <span class="user-name">{{ currentUser?.full_name }}</span>
          <button mat-icon-button [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item routerLink="/profile">
              <mat-icon>person</mat-icon> Profile
            </button>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon> Logout
            </button>
          </mat-menu>
        </mat-toolbar>
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container { height: 100vh; }
    .sidenav {
      width: 260px;
      background: #111827;
      color: white;
    }
    .sidenav-header {
      display: flex;
      align-items: center;
      padding: 20px 16px;
      gap: 10px;
      border-bottom: 1px solid #374151;
    }
    .sidenav-header h2 { margin: 0; font-size: 1.2rem; }
    .logo-icon { color: #06B6D4; font-size: 28px; width: 28px; height: 28px; }
    .sidenav mat-nav-list a { color: #d1d5db; }
    .sidenav mat-nav-list a.active { background: #1f2937; color: #06B6D4; }
    .sidenav mat-nav-list a:hover { background: #1f2937; }
    .toolbar { position: sticky; top: 0; z-index: 100; }
    .toolbar-title { margin-left: 8px; font-size: 1.1rem; }
    .spacer { flex: 1; }
    .user-name { margin-right: 8px; font-size: 0.9rem; }
    .content { padding: 24px; background: #F3F4F6; min-height: calc(100vh - 64px); }
  `]
})
export class MainLayoutComponent implements OnInit {
  currentUser: any;
  isAdmin = false;
  unreadCount = 0;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.authService.isAdmin();
    this.loadUnreadCount();
  }

  loadUnreadCount() {
    this.apiService.getUnreadCount().subscribe({
      next: (res) => this.unreadCount = res.count,
      error: () => {}
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
