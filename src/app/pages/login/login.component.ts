import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { ButtonComponent } from '../../components/button/button.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formData = {
    email: '',
    password: ''
  };
  constructor(private authService: AuthService, private router: Router) {

  }
  login() {
    this.authService.login(this.formData);
  }
  goToRegister() {
    this.router.navigate(['/register'])
  }
  goToLanding() {
    this.router.navigate(['/'])
  }
  goToLogin(){
    this.router.navigate(['/login'])
}
}