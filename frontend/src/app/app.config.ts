import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';



import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideHttpClient } from '@angular/common/http';
import { provideAuth0 } from '@auth0/auth0-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideAnimationsAsync(),
    provideHttpClient(),
    provideAuth0({
      domain: 'dev-2tmx8mtqsm2v7shw.us.auth0.com',
      clientId: 'YLm91SAPQ37lz1rqVizHBVZofd4YtRgT',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }),
    providePrimeNG({
     theme: {
       preset: Aura
     }
    })
  ]
};
