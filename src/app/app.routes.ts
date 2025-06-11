import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { SocialLoginService } from './social-login.service';
import { Router } from '@angular/router';
import { map, take } from 'rxjs';

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
      const socialLoginService = inject(SocialLoginService);
      const router = inject(Router);
      
      // Check localStorage directly for user data
      const hasStoredUser = !!localStorage.getItem('user_data');
      
      // If already logged in, redirect to dashboard
      if (hasStoredUser) {
        return router.createUrlTree(['/dashboard']);
      }
      return true;
    }]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [() => {
      const socialLoginService = inject(SocialLoginService);
      const router = inject(Router);
      
      // Check localStorage directly for user data
      const hasStoredUser = !!localStorage.getItem('user_data');
      
      // If not logged in, redirect to login
      if (!hasStoredUser) {
        socialLoginService.setRedirectUrl('/dashboard');
        return router.createUrlTree(['/login']);
      }
      return true;
    }]
  }
];