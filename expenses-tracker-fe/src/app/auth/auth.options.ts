import type { HttpResponse } from '@angular/common/http';
import { NbPasswordAuthStrategy, NbAuthOAuth2JWTToken, type NbAuthOptions } from '@nebular/auth';

import { AUTH_ROUTES_PREFIX, AUTH_PATHS } from './auth.routes';
import { AUTH_ENDPOINTS_PREFIX, AUTH_ENDPOINTS } from './auth.endpoints';



export const AUTH_OPTIONS: NbAuthOptions = {
  strategies: [
    NbPasswordAuthStrategy.setup({
      name: 'email',
      token: {
        class: NbAuthOAuth2JWTToken,
        getter:  (_method: unknown, { body }: HttpResponse<any>) => ({
          access_token: body.access_token,
          refresh_token: body.refresh_token
        })
      },
      baseEndpoint: `${AUTH_ENDPOINTS_PREFIX}/`,
      register: {
        endpoint: AUTH_ENDPOINTS.REGISTER,
        redirect: {
          success: '/'
        }
      },
      login: {
        endpoint: AUTH_ENDPOINTS.LOGIN,
        redirect: {
          success: '/'
        }
      },
      logout: {
        endpoint: AUTH_ENDPOINTS.LOGOUT,
        method: 'post',
        redirect: {
          failure: `${AUTH_ROUTES_PREFIX}/${AUTH_PATHS.LOGIN}`,
          success: `${AUTH_ROUTES_PREFIX}/${AUTH_PATHS.LOGIN}`
        }
      },
      refreshToken: {
        endpoint: AUTH_ENDPOINTS.REFRESH,
        method: 'post'
      }
    })
  ],
  forms: {
    register: {
      redirectDelay: 0,
      terms: false
    },
    login: {
      redirectDelay: 0,
      rememberMe: false
    },
    logout: {
      redirectDelay: 0
    }
  }
};
