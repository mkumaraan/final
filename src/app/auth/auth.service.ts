import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { LoginResponse } from '../models/loginresponse';
import { BehaviorSubject } from 'rxjs';
import { Candidate } from '../models/candidate.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn = this.isLoggedInSubject.asObservable();
  public loggedInUserSubject = new BehaviorSubject<Candidate | null>(this.getUser()); // Read from localStorage 
  loggedInUser = this.loggedInUserSubject.asObservable();
  constructor(private apiService: ApiService, private router: Router) { }
  register(formData: any) {
    this.apiService.register(formData).subscribe(response => {
      console.log(response);
      this.router.navigate(['/login']);
    });
  }

  login(formData: any) {
    this.apiService.login(formData).subscribe(
      (response: LoginResponse) => {
        console.log("Login Response Data:", response);
        response.candidate.partiesInDistrict = response.partiesInDistrict;
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.candidate));
        this.loggedInUserSubject.next(response.candidate);
        this.isLoggedInSubject.next(true);

        if (response.candidate.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      (error) => {
        console.error("Login Error:", error);
        alert(error.error?.message || "Login failed. Please try again.");
      }
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isLoggedInSubject.next(false);
    this.loggedInUserSubject.next(null);
    this.router.navigate(['/login']);
  }
  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
  getUser(): Candidate | null {
    const userString = localStorage.getItem('user');
    if (userString) {
      return JSON.parse(userString) as Candidate;
    }
    return null;
  }
  getRole(): string | null {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString) as Candidate;
      return user.role;
    }
    return null;
  }
  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }
  canActivate(): boolean {
    if (this.hasToken()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
} 