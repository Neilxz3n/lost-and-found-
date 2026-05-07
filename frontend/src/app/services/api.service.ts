import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { LostItem, FoundItem, Claim, Notification, Category, DashboardStats, ActivityLog, User } from '../models/interfaces';
import { MOCK_LOST_ITEMS, MOCK_FOUND_ITEMS, MOCK_CLAIMS, MOCK_NOTIFICATIONS, MOCK_CATEGORIES, MOCK_USERS, MOCK_ACTIVITY_LOGS } from './mock-data';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private authService: AuthService) {}

  // Lost Items
  getLostItems(filters?: any): Observable<LostItem[]> {
    let items = [...MOCK_LOST_ITEMS];
    if (filters?.keyword) {
      const kw = filters.keyword.toLowerCase();
      items = items.filter(i => i.item_name.toLowerCase().includes(kw) || i.description?.toLowerCase().includes(kw));
    }
    if (filters?.category) {
      items = items.filter(i => i.category_id === +filters.category);
    }
    if (filters?.status) {
      items = items.filter(i => i.status === filters.status);
    }
    return of(items).pipe(delay(200));
  }

  getLostItem(id: number): Observable<LostItem> {
    const item = MOCK_LOST_ITEMS.find(i => i.id === id)!;
    return of(item).pipe(delay(100));
  }

  createLostItem(data: FormData): Observable<any> {
    const newItem: LostItem = {
      id: MOCK_LOST_ITEMS.length + 1,
      user_id: this.authService.getCurrentUser()?.id || 1,
      category_id: +(data.get('category_id') || 0),
      item_name: data.get('item_name') as string,
      description: data.get('description') as string,
      location_lost: data.get('location_lost') as string,
      date_lost: data.get('date_lost') as string,
      status: 'pending',
      created_at: new Date().toISOString(),
      reporter_name: this.authService.getCurrentUser()?.full_name,
      category_name: MOCK_CATEGORIES.find(c => c.id === +(data.get('category_id') || 0))?.category_name
    };
    MOCK_LOST_ITEMS.unshift(newItem);
    return of({ message: 'Lost item reported successfully.', id: newItem.id }).pipe(delay(300));
  }

  updateLostItem(id: number, data: FormData): Observable<any> {
    const idx = MOCK_LOST_ITEMS.findIndex(i => i.id === id);
    if (idx >= 0) {
      MOCK_LOST_ITEMS[idx].item_name = data.get('item_name') as string || MOCK_LOST_ITEMS[idx].item_name;
      MOCK_LOST_ITEMS[idx].description = data.get('description') as string || MOCK_LOST_ITEMS[idx].description;
      MOCK_LOST_ITEMS[idx].location_lost = data.get('location_lost') as string || MOCK_LOST_ITEMS[idx].location_lost;
      MOCK_LOST_ITEMS[idx].date_lost = data.get('date_lost') as string || MOCK_LOST_ITEMS[idx].date_lost;
      const catId = data.get('category_id');
      if (catId) {
        MOCK_LOST_ITEMS[idx].category_id = +catId;
        MOCK_LOST_ITEMS[idx].category_name = MOCK_CATEGORIES.find(c => c.id === +catId)?.category_name;
      }
    }
    return of({ message: 'Lost item updated successfully.' }).pipe(delay(300));
  }

  deleteLostItem(id: number): Observable<any> {
    const idx = MOCK_LOST_ITEMS.findIndex(i => i.id === id);
    if (idx >= 0) MOCK_LOST_ITEMS.splice(idx, 1);
    return of({ message: 'Lost item deleted successfully.' }).pipe(delay(200));
  }

  // Found Items
  getFoundItems(filters?: any): Observable<FoundItem[]> {
    let items = [...MOCK_FOUND_ITEMS];
    if (filters?.keyword) {
      const kw = filters.keyword.toLowerCase();
      items = items.filter(i => i.item_name.toLowerCase().includes(kw) || i.description?.toLowerCase().includes(kw));
    }
    if (filters?.category) {
      items = items.filter(i => i.category_id === +filters.category);
    }
    if (filters?.status) {
      items = items.filter(i => i.status === filters.status);
    }
    return of(items).pipe(delay(200));
  }

  getFoundItem(id: number): Observable<FoundItem> {
    const item = MOCK_FOUND_ITEMS.find(i => i.id === id)!;
    return of(item).pipe(delay(100));
  }

  createFoundItem(data: FormData): Observable<any> {
    const newItem: FoundItem = {
      id: MOCK_FOUND_ITEMS.length + 1,
      user_id: this.authService.getCurrentUser()?.id || 1,
      category_id: +(data.get('category_id') || 0),
      item_name: data.get('item_name') as string,
      description: data.get('description') as string,
      location_found: data.get('location_found') as string,
      date_found: data.get('date_found') as string,
      status: 'pending',
      created_at: new Date().toISOString(),
      finder_name: this.authService.getCurrentUser()?.full_name,
      category_name: MOCK_CATEGORIES.find(c => c.id === +(data.get('category_id') || 0))?.category_name
    };
    MOCK_FOUND_ITEMS.unshift(newItem);
    return of({ message: 'Found item reported successfully.', id: newItem.id }).pipe(delay(300));
  }

  updateFoundItem(id: number, data: FormData): Observable<any> {
    const idx = MOCK_FOUND_ITEMS.findIndex(i => i.id === id);
    if (idx >= 0) {
      MOCK_FOUND_ITEMS[idx].item_name = data.get('item_name') as string || MOCK_FOUND_ITEMS[idx].item_name;
      MOCK_FOUND_ITEMS[idx].description = data.get('description') as string || MOCK_FOUND_ITEMS[idx].description;
      MOCK_FOUND_ITEMS[idx].location_found = data.get('location_found') as string || MOCK_FOUND_ITEMS[idx].location_found;
      MOCK_FOUND_ITEMS[idx].date_found = data.get('date_found') as string || MOCK_FOUND_ITEMS[idx].date_found;
      const catId = data.get('category_id');
      if (catId) {
        MOCK_FOUND_ITEMS[idx].category_id = +catId;
        MOCK_FOUND_ITEMS[idx].category_name = MOCK_CATEGORIES.find(c => c.id === +catId)?.category_name;
      }
    }
    return of({ message: 'Found item updated successfully.' }).pipe(delay(300));
  }

  deleteFoundItem(id: number): Observable<any> {
    const idx = MOCK_FOUND_ITEMS.findIndex(i => i.id === id);
    if (idx >= 0) MOCK_FOUND_ITEMS.splice(idx, 1);
    return of({ message: 'Found item deleted successfully.' }).pipe(delay(200));
  }

  // Claims
  getClaims(): Observable<Claim[]> {
    return of([...MOCK_CLAIMS]).pipe(delay(200));
  }

  submitClaim(data: { found_item_id: number; proof_of_ownership: string }): Observable<any> {
    const newClaim: Claim = {
      id: MOCK_CLAIMS.length + 1,
      found_item_id: data.found_item_id,
      claimant_id: this.authService.getCurrentUser()?.id || 1,
      proof_of_ownership: data.proof_of_ownership,
      claim_status: 'pending',
      created_at: new Date().toISOString(),
      item_name: MOCK_FOUND_ITEMS.find(i => i.id === data.found_item_id)?.item_name,
      claimant_name: this.authService.getCurrentUser()?.full_name
    };
    MOCK_CLAIMS.push(newClaim);
    return of({ message: 'Claim submitted successfully.', id: newClaim.id }).pipe(delay(300));
  }

  updateClaim(id: number, data: { claim_status: string; admin_remark?: string }): Observable<any> {
    const claim = MOCK_CLAIMS.find(c => c.id === id);
    if (claim) {
      claim.claim_status = data.claim_status as any;
      claim.admin_remark = data.admin_remark;
      if (data.claim_status === 'approved') {
        const foundItem = MOCK_FOUND_ITEMS.find(f => f.id === claim.found_item_id);
        if (foundItem) foundItem.status = 'claimed';
      }
    }
    return of({ message: `Claim ${data.claim_status} successfully.` }).pipe(delay(300));
  }

  // Notifications
  getNotifications(): Observable<Notification[]> {
    return of([...MOCK_NOTIFICATIONS]).pipe(delay(200));
  }

  markAsRead(id: number): Observable<any> {
    const notif = MOCK_NOTIFICATIONS.find(n => n.id === id);
    if (notif) notif.is_read = true;
    return of({ message: 'Notification marked as read.' }).pipe(delay(100));
  }

  markAllRead(): Observable<any> {
    MOCK_NOTIFICATIONS.forEach(n => n.is_read = true);
    return of({ message: 'All notifications marked as read.' }).pipe(delay(200));
  }

  getUnreadCount(): Observable<{ count: number }> {
    const count = MOCK_NOTIFICATIONS.filter(n => !n.is_read).length;
    return of({ count }).pipe(delay(100));
  }

  // Reports & Stats
  getStats(): Observable<DashboardStats> {
    const user = this.authService.getCurrentUser();
    const stats: DashboardStats = {
      total_lost: MOCK_LOST_ITEMS.length,
      total_found: MOCK_FOUND_ITEMS.length,
      pending_claims: MOCK_CLAIMS.filter(c => c.claim_status === 'pending').length,
      approved_claims: MOCK_CLAIMS.filter(c => c.claim_status === 'approved').length,
      total_users: MOCK_USERS.length,
      user_lost: MOCK_LOST_ITEMS.filter(i => i.user_id === user?.id).length,
      user_found: MOCK_FOUND_ITEMS.filter(i => i.user_id === user?.id).length,
      user_claims: MOCK_CLAIMS.filter(c => c.claimant_id === user?.id).length
    };
    return of(stats).pipe(delay(200));
  }

  getActivityLogs(): Observable<ActivityLog[]> {
    return of([...MOCK_ACTIVITY_LOGS]).pipe(delay(200));
  }

  getCategories(): Observable<Category[]> {
    return of([...MOCK_CATEGORIES]).pipe(delay(100));
  }

  // Users (admin)
  getUsers(): Observable<User[]> {
    return of([...MOCK_USERS]).pipe(delay(200));
  }

  deleteUser(id: number): Observable<any> {
    const idx = MOCK_USERS.findIndex(u => u.id === id);
    if (idx >= 0) MOCK_USERS.splice(idx, 1);
    return of({ message: 'User deleted successfully.' }).pipe(delay(200));
  }

  updateUserRole(id: number, role: string): Observable<any> {
    const user = MOCK_USERS.find(u => u.id === id);
    if (user) user.role = role as any;
    return of({ message: 'User role updated successfully.' }).pipe(delay(200));
  }
}
