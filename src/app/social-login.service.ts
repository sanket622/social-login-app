import { Injectable } from '@angular/core';
import {
  SocialAuthService,
  FacebookLoginProvider,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SocialLoginService {
  private userSubject = new BehaviorSubject<SocialUser | null>(null);

  constructor(
    private authService: SocialAuthService,
    private router: Router
  ) {
    // Subscribe to auth state changes
    this.authService.authState.subscribe((user) => {
      this.userSubject.next(user);
      if (user) {
        console.log('User logged in via service:', user);
      }
    });
  }


  signInWithFB(): Promise<SocialUser> {
    return this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
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

  get currentUser(): SocialUser | null {
    return this.userSubject.value;
  }
}
