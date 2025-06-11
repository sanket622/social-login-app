import { Injectable } from '@angular/core';
import { SocialLoginService } from './social-login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private socialLoginService: SocialLoginService) {
    // Check if we have a stored auth token
    const storedAuth = localStorage.getItem('auth_token');
    if (storedAuth) {
      // This will be used to validate the token on app initialization
      console.log('Found stored auth token');
    }
  }

  // Store authentication state in localStorage for persistence
  storeAuthState(user: any): void {
    if (user) {
      localStorage.setItem('auth_token', 'true');
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return localStorage.getItem('auth_token') === 'true' || 
           this.socialLoginService.isLoggedIn;
  }
}