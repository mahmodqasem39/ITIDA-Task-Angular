import { NgIf } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet,NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ITIDATask';

  constructor(private router: Router) {}
  isLoginRoute(): boolean {
    return this.router.url === '/login';
  }

  isRegisterRoute(): boolean {
    return this.router.url === '/register';
  }

  goToLogin() :void{
    this.router.navigate(['/login']);
  }

  goToRegister():void {
    this.router.navigate(['/register']);
  }
  
  
}
