import type { Routes } from '@angular/router';
import { NbAuthComponent, NbLoginComponent, NbRegisterComponent, NbLogoutComponent } from '@nebular/auth';



export const AUTH_ROUTES_PREFIX = 'auth' as const;

export const AUTH_PATHS = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  REGISTER: 'register'
} as const;

export const authRoutes: Routes = [
  {
    path: AUTH_ROUTES_PREFIX,
    component: NbAuthComponent,
    children: [
      {
        path: AUTH_PATHS.LOGIN,
        component: NbLoginComponent,
        data: {
          meta: {
            /**
             *
             * t(META.AUTH.LOGIN_PAGE.TITLE)
             * t(META.AUTH.LOGIN_PAGE.DESCRIPTION)
             */
            title: 'META.AUTH.LOGIN_PAGE.TITLE',
            description: 'META.AUTH.LOGIN_PAGE.DESCRIPTION'
          }
        }
      },
      {
        path: AUTH_PATHS.REGISTER,
        component: NbRegisterComponent,
        data: {
          meta: {
            /**
             *
             * t(META.AUTH.REGISTER_PAGE.TITLE)
             * t(META.AUTH.REGISTER_PAGE.DESCRIPTION)
             */
            title: 'META.AUTH.REGISTER_PAGE.TITLE',
            description: 'META.AUTH.REGISTER_PAGE.DESCRIPTION'
          }
        }
      },
      {
        path: AUTH_PATHS.LOGOUT,
        component: NbLogoutComponent,
        data: {
          meta: {
            /**
             *
             * t(META.AUTH.LOGOUT_PAGE.TITLE)
             * t(META.AUTH.LOGOUT_PAGE.DESCRIPTION)
             */
            title: 'META.AUTH.LOGOUT_PAGE.TITLE',
            description: 'META.AUTH.LOGOUT_PAGE.DESCRIPTION'
          }
        }
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: AUTH_PATHS.LOGIN
      },
      {
        path: '**',
        redirectTo: AUTH_PATHS.LOGIN
      }
    ]
  }
];
