import { tap } from 'rxjs';
import { Store } from '@ngxs/store';
import { inject } from '@angular/core'
import { NbAuthService } from '@nebular/auth';
import { Navigate } from '@ngxs/router-plugin';
import type { CanActivateFn } from '@angular/router';

import { AUTH_PATHS, AUTH_ROUTES_PREFIX } from './auth.routes';



export const authGuardFactoryFn = (): CanActivateFn => () => {
  const store = inject(Store);
  const authService = inject(NbAuthService);

  return authService.isAuthenticated().pipe(
    tap(authenticated => {
      if (!authenticated) {
        store.dispatch(new Navigate([`${AUTH_ROUTES_PREFIX}/${AUTH_PATHS.LOGIN}`]))
      }
    })
  );
};
