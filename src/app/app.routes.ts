import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { SocialLoginService } from './social-login.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
    canActivate: [() => {
      const authService = inject(AuthService);
      const router = inject(Router);
      
      // If already logged in, redirect to dashboard
      if (authService.isLoggedIn) {
        return router.createUrlTree(['/dashboard']);
      }
      return true;
    }]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [() => {
      const authService = inject(AuthService);
      const socialLoginService = inject(SocialLoginService);
      const router = inject(Router);
      
      // If not logged in, redirect to login
      if (!authService.isLoggedIn) {
        socialLoginService.setRedirectUrl('/dashboard');
        return router.createUrlTree(['/login']);
      }
      return true;
    }]
  }
];