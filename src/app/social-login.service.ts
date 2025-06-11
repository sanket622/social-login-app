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
    // Subscribe to auth state changes
    this.authService.authState.subscribe((user) => {
      this.userSubject.next(user);
      this.loggedInSubject.next(!!user);
      
      if (user) {
        console.log('User logged in via service:', user);
        this.router.navigate([this.redirectUrl]);
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
    return this.authService.signOut()
      .then(() => {
        this.userSubject.next(null);
        console.log('User signed out, navigating to login');
        this.router.navigate(['/login']);
      })
      .catch(error => {
        console.error('Error during sign out:', error);
        // Still try to navigate even if there's an error
        this.router.navigate(['/login']);
        return Promise.reject(error);
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
    return this.loggedInSubject.value;
  }
  
  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }
  
  getRedirectUrl(): string {
    return this.redirectUrl;
  }
}
