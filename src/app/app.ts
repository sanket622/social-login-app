import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MyButton } from 'my-library';  // Import the component from your library

@Component({
  selector: 'app-root',
  standalone: true,             
  imports: [RouterOutlet, MyButton],  // Add MyButton to imports
  template: `
    <router-outlet></router-outlet>
    <lib-my-button></lib-my-button>   <!-- Use the component in your template -->
  `,
  styleUrls: ['./app.css']      
})
export class App {
  protected title = 'social-login-app';
}
