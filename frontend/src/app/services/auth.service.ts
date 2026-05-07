import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError, delay } from 'rxjs';
import { User, LoginResponse } from '../models/interfaces';
import { MOCK_USERS } from './mock-data';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const stored = localStorage.getItem('user');
    if (stored) {
      this.currentUserSubject.next(JSON.parse(stored));
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const user = MOCK_USERS.find(u => u.email === email);
    if (user && password === 'password123') {
      const response: LoginResponse = {
        message: 'Login successful.',
        token: 'mock-jwt-token-' + user.id,
        user
      };
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      this.currentUserSubject.next(response.user);
      return of(response).pipe(delay(300));
    }
    return throwError(() => ({ error: { message: 'Invalid email or password.' } }));
  }

  register(data: any): Observable<any> {
    const newUser: User = {
      id: MOCK_USERS.length + 1,
      full_name: data.full_name,
      email: data.email,
      role: 'user',
      course: data.course,
      year_level: data.year_level,
      contact_number: data.contact_number
    };
    MOCK_USERS.push(newUser);
    return of({ message: 'Registration successful.', userId: newUser.id }).pipe(delay(300));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'admin';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getProfile(): Observable<User> {
    const user = this.currentUserSubject.value;
    if (user) {
      return of(user).pipe(delay(100));
    }
    return throwError(() => ({ error: { message: 'Not logged in.' } }));
  }

  updateProfile(data: any): Observable<any> {
    const user = this.currentUserSubject.value;
    if (user) {
      Object.assign(user, data);
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUserSubject.next(user);
    }
    return of({ message: 'Profile updated successfully.' }).pipe(delay(300));
  }
}
