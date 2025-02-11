import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { AdminComponent } from './pages/admin/admin.component';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { inject } from '@angular/core'; // Import inject
import { LandingComponent } from './pages/landing/landing.component';

const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService); // Inject the AuthService
    const router = inject(Router);

    if (authService.canActivate()) {
        return true;
    } else {
        // Optionally redirect to login if not authenticated
        router.navigate(['/login']);
        return false;
    }
};

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent, canActivate: [authGuard] },
    { path: 'admin', component: AdminComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];