import { Injectable } from '@angular/core';
import {
  SocialAuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SocialLoginService {
  constructor(
    private authService: SocialAuthService,
    private router: Router,
    private storageService: AuthService
  ) {
    this.authService.authState.subscribe(user => this.handleAuthStateChange(user));
  }

  private handleAuthStateChange(user: SocialUser | null): void {
  if (user) {
    console.log('User logged in via service:', user);
    this.storageService.storeUser(user);
    
    if (!this.storageService.isRefreshLogin()) {
      this.storageService.markUserLoggedIn();
      this.router.navigate([this.storageService.getRedirectUrl()]);
    }
  } else {
    if (!this.storageService.currentUser) {
      this.storageService.clearStoredUser();
    }
  }
}

  signInWithFB(): Promise<SocialUser> {
    return this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
  
  signInWithGoogle(): Promise<SocialUser> {
    return this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut(): Promise<void> {
    // First clear storage using the auth service
    this.storageService.clearStoredUser();
    
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

  // Delegate to auth service
  get user$(): Observable<SocialUser | null> {
    return this.storageService.user$;
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.storageService.isLoggedIn$;
  }

  get currentUser(): SocialUser | null {
    return this.storageService.currentUser;
  }
  
  get isLoggedIn(): boolean {
    return this.storageService.isLoggedIn;
  }
  
  setRedirectUrl(url: string): void {
    this.storageService.setRedirectUrl(url);
  }
  
  getRedirectUrl(): string {
    return this.storageService.getRedirectUrl();
  }
}