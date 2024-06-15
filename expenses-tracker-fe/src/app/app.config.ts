import { NgxsModule } from '@ngxs/store';
import { provideTransloco } from '@jsverse/transloco';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NbGlobalPhysicalPosition, NbThemeModule, NbToastrModule } from '@nebular/theme';
import { ApplicationConfig, importProvidersFrom, isDevMode, provideExperimentalZonelessChangeDetection } from '@angular/core';

import { appRoutes } from '@app/app.routes';

import { AuthModule } from '@auth/auth.module';
import { authRoutes } from '@auth/auth.routes';

import { AppState } from '@store/app.state';

import { httpApiInterceptor } from '@providers/api.interceptor';
import { TRANSLOCO_OPTIONS } from '@providers/transloco.options';
import { errorHandlerProvider } from '@providers/error-handler.provider';
import { titleStrategyProvider } from '@providers/title-strategy.provider';



export const appConfig: ApplicationConfig = {
  providers: [
    // provideExperimentalZonelessChangeDetection(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([
      httpApiInterceptor
    ])),
    errorHandlerProvider,
    provideTransloco(TRANSLOCO_OPTIONS),
    titleStrategyProvider,
    importProvidersFrom(
      // nebular
      NbThemeModule.forRoot(),
      NbEvaIconsModule,
      NbToastrModule.forRoot({
        position: NbGlobalPhysicalPosition.BOTTOM_RIGHT
      }),
      // ngxs
      NgxsModule.forRoot([
        AppState
      ], {
        developmentMode: isDevMode()
      }),
      NgxsReduxDevtoolsPluginModule.forRoot({
        disabled: !isDevMode()
      }),
      NgxsRouterPluginModule.forRoot(),
      // app modules - old way
      AuthModule
    ),
    provideRouter([
      ...appRoutes,
      ...authRoutes,
      {
        path: '**',
        redirectTo: '/'
      }
    ], withComponentInputBinding())
  ]
};
