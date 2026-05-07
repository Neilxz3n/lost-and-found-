import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LostItem, FoundItem, Claim, Notification, Category, DashboardStats, ActivityLog, User } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Lost Items
  getLostItems(filters?: any): Observable<LostItem[]> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) params = params.set(key, filters[key]);
      });
    }
    return this.http.get<LostItem[]>(`${this.apiUrl}/lost-items`, { params });
  }

  getLostItem(id: number): Observable<LostItem> {
    return this.http.get<LostItem>(`${this.apiUrl}/lost-items/${id}`);
  }

  createLostItem(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/lost-items`, data);
  }

  updateLostItem(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/lost-items/${id}`, data);
  }

  deleteLostItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/lost-items/${id}`);
  }

  // Found Items
  getFoundItems(filters?: any): Observable<FoundItem[]> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) params = params.set(key, filters[key]);
      });
    }
    return this.http.get<FoundItem[]>(`${this.apiUrl}/found-items`, { params });
  }

  getFoundItem(id: number): Observable<FoundItem> {
    return this.http.get<FoundItem>(`${this.apiUrl}/found-items/${id}`);
  }

  createFoundItem(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/found-items`, data);
  }

  updateFoundItem(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/found-items/${id}`, data);
  }

  deleteFoundItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/found-items/${id}`);
  }

  // Claims
  getClaims(): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.apiUrl}/claims`);
  }

  submitClaim(data: { found_item_id: number; proof_of_ownership: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/claims`, data);
  }

  updateClaim(id: number, data: { claim_status: string; admin_remark?: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/claims/${id}`, data);
  }

  // Notifications
  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/notifications`);
  }

  markAsRead(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/notifications/${id}/read`, {});
  }

  markAllRead(): Observable<any> {
    return this.http.put(`${this.apiUrl}/notifications/read-all`, {});
  }

  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/notifications/unread-count`);
  }

  // Reports & Stats
  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/reports/stats`);
  }

  getActivityLogs(): Observable<ActivityLog[]> {
    return this.http.get<ActivityLog[]>(`${this.apiUrl}/reports/activity`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/reports/categories`);
  }

  // Users (admin)
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  updateUserRole(id: number, role: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}/role`, { role });
  }
}
