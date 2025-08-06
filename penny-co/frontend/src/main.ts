import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';

bootstrapApplication(App, {
     providers: [
    provideRouter(appRoutes),
  ]
}).catch((err) => console.error(err));
