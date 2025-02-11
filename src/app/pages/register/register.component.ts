import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  formData = {
    name: "",
    email: "",
    password: "",
    age: 0,
    gender: "",
    districtId: 0,
    role: ""
  };
  registrationSuccess = false;
  successMessage = "";

  constructor(private authService: AuthService, private router: Router) { }

  register() {
    if (!this.validateForm()) return; // If validation fails, stop registration

    this.authService.register(this.formData);
    this.registrationSuccess = true;
    this.successMessage = "Registration Successful!";
    
    setTimeout(() => {
      this.registrationSuccess = false;
      this.successMessage = "";
      this.router.navigate(['/login']);
    }, 3000);
  }

  validateForm(): boolean {
    if (!this.formData.name || !this.formData.email || !this.formData.password ||
        this.formData.age === null || !this.formData.gender || 
        this.formData.districtId === null || !this.formData.role) {
      alert("All fields are required!");
      return false;
    }
    if (this.formData.age < 18) {
      alert("You must be at least 18 years old to register.");
      return false;
    }
    if (!this.formData.role) {
      alert("Please select a valid role.");
      return false;
    }

    return true;
  }

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