import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class LoginComponent implements OnInit{
  user: SocialUser | null = null;

  constructor(
    private socialLoginService: SocialLoginService
  ) {

  }

  ngOnInit(): void {
    console.log('Login component initialized');
  
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
