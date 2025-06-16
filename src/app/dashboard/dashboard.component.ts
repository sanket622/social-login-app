import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialLoginService } from '../social-login.service';
import { SocialUser } from '@abacritt/angularx-social-login';
import { Observable, Subscription } from 'rxjs';
import { MyButton } from 'my-library';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MyButton],
  templateUrl: './dashboard.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  user$: Observable<SocialUser | null>;
  loggedIn: boolean = false;
  user: SocialUser | null = null;
  private subscription = new Subscription();

  constructor(
    private socialLoginService: SocialLoginService
  ) {
     this.user$ = this.socialLoginService.user$;
  }

  ngOnInit(): void {
    // First try to get user from localStorage
    const storedUserData = localStorage.getItem('user_data');
    if (storedUserData) {
      try {
        this.user = JSON.parse(storedUserData);
        this.loggedIn = true;
        console.log('Dashboard: Loaded user from localStorage:', this.user);
      } catch (e) {
        console.error('Dashboard: Error parsing stored user data:', e);
      }
    }
    
    // Subscribe to user changes
    this.subscription.add(
     this.user$.subscribe({
        next: (user) => {
          if (user) {
            this.user = user;
            this.loggedIn = true;
            console.log('Dashboard: User state changed:', user);
          }
        },
        error: (error) => {
          console.error('Dashboard: User state error:', error);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  logout() {
    this.socialLoginService.signOut()
      .catch(error => console.error('Logout error:', error));
    // No need to manually update user state as the subscription will handle it
  }
}