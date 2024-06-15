import { NgModule } from '@angular/core';
import { NbAuthModule } from '@nebular/auth';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AUTH_OPTIONS } from './auth.options';
import { AUTH_PROVIDERS } from './auth.providers';



@NgModule({
  imports: [
    NbAuthModule.forRoot(AUTH_OPTIONS)
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    AUTH_PROVIDERS
  ]
})
export class AuthModule {}
