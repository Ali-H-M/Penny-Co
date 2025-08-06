import { Route } from '@angular/router';
import { Signup } from './pages/signup/signup';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';

export const appRoutes: Route[] = [
    { path: '', component: Home }, // make home page is the defult page
    { path: 'login', component: Login },
    { path: 'signup', component: Signup },
];
