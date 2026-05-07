import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { ApiService } from '../../services/api.service';
import { Notification } from '../../models/interfaces';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatIconModule, MatButtonModule, MatBadgeModule],
  template: `
    <div class="notifications-page">
      <div class="page-header">
        <h1>Notifications</h1>
        <button mat-raised-button color="primary" (click)="markAllRead()" [disabled]="notifications.length === 0">
          <mat-icon>done_all</mat-icon> Mark All Read
        </button>
      </div>

      <mat-card class="notifications-card">
        @if (notifications.length === 0) {
          <p class="no-data">No notifications yet.</p>
        }
        <mat-list>
          @for (notif of notifications; track notif.id) {
            <mat-list-item [class.unread]="!notif.is_read" (click)="markRead(notif)">
              <mat-icon matListItemIcon [style.color]="notif.is_read ? '#9ca3af' : '#4F46E5'">
                {{ notif.is_read ? 'notifications_none' : 'notifications_active' }}
              </mat-icon>
              <div matListItemTitle>{{ notif.message }}</div>
              <div matListItemLine class="notif-date">{{ notif.created_at | date:'medium' }}</div>
            </mat-list-item>
          }
        </mat-list>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .page-header h1 { margin: 0; color: #111827; }
    .notifications-card { border-radius: 12px; }
    .unread { background: #eff6ff; }
    .notif-date { color: #9ca3af; font-size: 0.8rem; }
    .no-data { text-align: center; color: #9ca3af; padding: 20px; }
  `]
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.apiService.getNotifications().subscribe({ next: (n) => this.notifications = n });
  }

  markRead(notif: Notification) {
    if (!notif.is_read) {
      this.apiService.markAsRead(notif.id).subscribe({ next: () => { notif.is_read = true; } });
    }
  }

  markAllRead() {
    this.apiService.markAllRead().subscribe({ next: () => this.loadNotifications() });
  }
}
