import { Routes } from '@angular/router';
import { Signup } from './pages/signup/signup';
import { Signin } from './pages/signin/signin';
import { Home } from './pages/home/home';
import { Dashboard } from './pages/dashboard/dashboard';
import { AuthGuard } from './auth/auth.guard';

export const appRoutes: Routes = [
    { path: '', component: Home },
    { path: 'signin', component: Signin },
    { path: 'signup', component: Signup },
    { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '' } // Any other route will redirect to home page
];