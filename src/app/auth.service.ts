import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SocialUser } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<SocialUser | null>(null);
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  private redirectUrl: string = '/dashboard';

  constructor(private router: Router) {
    this.initializeFromStorage();
  }

  private initializeFromStorage(): void {
    const storedUser = localStorage.getItem('user_data');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.userSubject.next(user);
        this.loggedInSubject.next(true);
        console.log('Loaded user from localStorage:', user);
      } catch (e) {
        console.error('Error parsing stored user data');
        this.clearStoredUser();
      }
    }
  }

  // User data storage methods
  storeUser(user: SocialUser): void {
    localStorage.setItem('user_data', JSON.stringify(user));
    this.userSubject.next(user);
    this.loggedInSubject.next(true);
  }

  clearStoredUser(): void {
    localStorage.removeItem('user_data');
    sessionStorage.removeItem('userAlreadyLoggedIn');
    this.userSubject.next(null);
    this.loggedInSubject.next(false);
  }

  // Session tracking methods
  markUserLoggedIn(): void {
    sessionStorage.setItem('userAlreadyLoggedIn', 'true');
  }

  isRefreshLogin(): boolean {
    return sessionStorage.getItem('userAlreadyLoggedIn') === 'true';
  }

  // Redirect URL methods
  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }
  
  getRedirectUrl(): string {
    return this.redirectUrl;
  }

  // Observable getters
  get user$(): Observable<SocialUser | null> {
    return this.userSubject.asObservable();
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  // Value getters
  get currentUser(): SocialUser | null {
    return this.userSubject.value;
  }
  
  get isLoggedIn(): boolean {
    return this.loggedInSubject.value || !!localStorage.getItem('user_data');
  }
}