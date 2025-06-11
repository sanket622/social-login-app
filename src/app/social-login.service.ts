import { Injectable } from '@angular/core';
import {
  SocialAuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SocialLoginService {
  private userSubject = new BehaviorSubject<SocialUser | null>(null);
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  private redirectUrl: string = '/dashboard';

  constructor(
    private authService: SocialAuthService,
    private router: Router
  ) {
    // Check for stored user data on initialization
    const storedUser = localStorage.getItem('user_data');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.userSubject.next(user);
        this.loggedInSubject.next(true);
        console.log('Loaded user from localStorage:', user);
      } catch (e) {
        console.error('Error parsing stored user data');
        localStorage.removeItem('user_data');
      }
    }

    // Subscribe to auth state changes
    this.authService.authState.subscribe((user) => {
      if (user) {
        console.log('User logged in via service:', user);
        // Store user data in localStorage
        localStorage.setItem('user_data', JSON.stringify(user));
        this.userSubject.next(user);
        this.loggedInSubject.next(true);
        
        // Check if this is a page refresh or new login
        const isRefresh = sessionStorage.getItem('userAlreadyLoggedIn') === 'true';
        if (!isRefresh) {
          sessionStorage.setItem('userAlreadyLoggedIn', 'true');
          this.router.navigate([this.redirectUrl]);
        }
      } else {
        // Only clear user data if explicitly signed out
        // Don't clear on page refresh when authState temporarily returns null
        if (!localStorage.getItem('user_data')) {
          this.userSubject.next(null);
          this.loggedInSubject.next(false);
          sessionStorage.removeItem('userAlreadyLoggedIn');
        }
      }
    });
  }


  signInWithFB(): Promise<SocialUser> {
    return this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
  
  signInWithGoogle(): Promise<SocialUser> {
    return this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut(): Promise<void> {
    // First clear local storage and update subjects
    localStorage.removeItem('user_data');
    sessionStorage.removeItem('userAlreadyLoggedIn');
    this.userSubject.next(null);
    this.loggedInSubject.next(false);
    
    // Then navigate to login page
    console.log('User signed out, navigating to login');
    this.router.navigate(['/login']);
    
    // Finally, call the auth service signOut
    return this.authService.signOut()
      .catch(error => {
        console.error('Error during sign out:', error);
        return Promise.resolve(); // Don't reject, we've already cleared local state
      });
  }

  get user$(): Observable<SocialUser | null> {
    return this.userSubject.asObservable();
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  get currentUser(): SocialUser | null {
    return this.userSubject.value;
  }
  
  get isLoggedIn(): boolean {
    return this.loggedInSubject.value || !!localStorage.getItem('user_data');
  }
  
  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }
  
  getRedirectUrl(): string {
    return this.redirectUrl;
  }
}
