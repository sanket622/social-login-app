import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SocialLoginService } from '../social-login.service';
import { 
  SocialUser, 
  GoogleSigninButtonModule,
} from '@abacritt/angularx-social-login';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, GoogleSigninButtonModule],
  templateUrl: './login.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  user$: Observable<SocialUser | null>;
  loggedIn: boolean = false;
  user: SocialUser | null = null;
  private subscription = new Subscription();

  constructor(
    private socialLoginService: SocialLoginService,
    private router: Router
  ) {
    this.user$ = this.socialLoginService.user$;
  }

  ngOnInit(): void {
    console.log('Login component initialized');
    
    this.subscription.add(
      this.user$.subscribe({
        next: (user) => {
          console.log('User state changed:', user);
          this.user = user;
          this.loggedIn = !!user;
          
          // Navigate to dashboard if user is logged in
          if (user) {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          console.error('User state error:', error);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  signInWithFB(): void {
    this.socialLoginService.signInWithFB()
      .then((user) => {
        console.log('Facebook login successful:', user);
        // No need to navigate here as the subscription will handle it
      })
      .catch((error) => {
        console.error('Facebook login failed:', error);
      });
  }
}
