import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialLoginService } from '../social-login.service';
import { 
  SocialAuthService, 
  SocialUser, 
} from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit{
  loggedIn: boolean = false;
    user: SocialUser | null = null;


  constructor(
  private socialLoginService: SocialLoginService,
     private authService: SocialAuthService,
  ) {
  
  }

  ngOnInit(): void {
    this.authService.authState.subscribe({
      next: (user) => {
        this.user = user;
        this.loggedIn = !!user;
        console.log('Dashboard: Auth state changed:', user);
      },
      error: (error) => {
        console.error('Dashboard: Auth state error:', error);
      }
    });
  }

    logout() {
    this.socialLoginService.signOut()
      .then(() => {
        this.user = null;
        this.loggedIn = false;
        console.log('Logged out successfully');
      })
      .catch(error => console.error('Logout error:', error));
  }


}
