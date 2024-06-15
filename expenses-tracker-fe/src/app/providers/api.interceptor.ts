import { isDevMode } from '@angular/core';
import type { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';



export const API_PREFIX = 'api' as const;

export const httpApiInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
  if (request.url.endsWith('.json')) {
    return next(request);
  }

  const nextRequest = isDevMode()
    ? request.clone({
        url: `${API_PREFIX}/${request.url}`
      })
    : request;

  return next(nextRequest);
};
