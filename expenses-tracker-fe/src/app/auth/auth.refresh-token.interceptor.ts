import { Injectable, inject } from '@angular/core';
import { type Observable, map, switchMap } from 'rxjs';
import { NbAuthService, NbAuthToken, NbAuthOAuth2JWTToken } from '@nebular/auth';
import type { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

import { AUTH_ENDPOINTS } from './auth.endpoints';



@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  readonly #authService = inject(NbAuthService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return request.url.endsWith(AUTH_ENDPOINTS.REFRESH)
      ? this.#authService.getToken().pipe(
          map((token: NbAuthToken) => (token as NbAuthOAuth2JWTToken).getRefreshToken()),
          switchMap((refreshToken: string) => next.handle(request.clone({
            setHeaders: {
              Authorization: `Bearer ${refreshToken}`
            }
          })))
        )
      : next.handle(request);
  }
}
