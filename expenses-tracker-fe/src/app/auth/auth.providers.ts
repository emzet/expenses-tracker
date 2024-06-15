import type { Provider, EnvironmentProviders } from '@angular/core';
import { type HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NB_AUTH_TOKEN_INTERCEPTOR_FILTER, NbAuthJWTInterceptor } from '@nebular/auth';

import { API_PREFIX } from '@app/providers/api.interceptor';

import { AUTH_ENDPOINTS } from './auth.endpoints';
import { RefreshTokenInterceptor } from './auth.refresh-token.interceptor';



export const AUTH_PROVIDERS: Array<Provider | EnvironmentProviders> = [
  {
    provide: NB_AUTH_TOKEN_INTERCEPTOR_FILTER,
    useValue: (request: HttpRequest<any>) => !request.url.startsWith(API_PREFIX) || request.url.endsWith(AUTH_ENDPOINTS.REFRESH)
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: RefreshTokenInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: NbAuthJWTInterceptor,
    multi: true
  }
];
