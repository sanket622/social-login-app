import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { SocialLoginService } from './social-login.service';
import { Router } from '@angular/router';
import { map, take } from 'rxjs';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [() => {
      const socialLoginService = inject(SocialLoginService);
      const router = inject(Router);
      
      return socialLoginService.user$.pipe(
        take(1),
        map(user => {
          const isLoggedIn = !!user;
          if (isLoggedIn) {
            return true;
          }
          socialLoginService.setRedirectUrl('/dashboard');
          return router.createUrlTree(['/login']);
        })
      );
    }]
  }
];
