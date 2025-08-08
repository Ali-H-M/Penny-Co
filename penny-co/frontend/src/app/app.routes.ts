import { Route } from '@angular/router';
import { Signup } from './pages/signup/signup';
import { Signin } from './pages/signin/signin';
import { Home } from './pages/home/home';
import { Dashboard } from './pages/dashboard/dashboard';

export const appRoutes: Route[] = [
    { path: '', component: Home }, // make home page is the defult page
    { path: 'signin', component: Signin },
    { path: 'signup', component: Signup },
    { path: 'dashboard', component: Dashboard}
];
