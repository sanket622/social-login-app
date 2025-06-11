import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { SocialLoginService } from './social-login.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const socialLoginService = inject(SocialLoginService);
  const router = inject(Router);
  
  // If not logged in, redirect to login
  if (!authService.isLoggedIn) {
    socialLoginService.setRedirectUrl('/dashboard');
    return router.createUrlTree(['/login']);
  }
  return true;
};

export const loginGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // If already logged in, redirect to dashboard
  if (authService.isLoggedIn) {
    return router.createUrlTree(['/dashboard']);
  }
  return true;
};