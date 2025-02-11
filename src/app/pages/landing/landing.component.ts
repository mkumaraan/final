import { Component } from '@angular/core';
import { ButtonComponent } from '../../components/button/button.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-landing',
  standalone: true,
    imports:[CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
 constructor(private router: Router) {}
 goToRegister(){
      this.router.navigate(['/register'])
  }
   goToLogin(){
      this.router.navigate(['/login'])
  }
  goToLanding(){
    this.router.navigate(['/'])
}
}