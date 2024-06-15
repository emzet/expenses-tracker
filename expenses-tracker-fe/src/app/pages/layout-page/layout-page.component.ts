import { Store } from '@ngxs/store';
import { RouterOutlet } from '@angular/router';
import { AppStateModel } from '@app/store/app.state';
import { Observable, combineLatest, map } from 'rxjs';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NbAuthOAuth2JWTToken, NbAuthService, NbAuthToken } from '@nebular/auth';
import { Translation, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
  NbActionsModule,
  NbContextMenuModule,
  NbDialogModule,
  NbDialogService,
  NbLayoutModule,
  NbMenuItem,
  NbMenuModule,
  NbSidebarModule,
  NbUserModule
} from '@nebular/theme';

import { APP_PATHS } from '@app/app.routes';

import { TextFormatPipe } from '@pipes/text-format.pipe';

import { translocoLangChanged$ } from '@utils/transloco.utils';

import { AUTH_PATHS, AUTH_ROUTES_PREFIX } from '@auth/auth.routes';

import { LanguageSelectorComponent } from '@components/language-selector/language-selector.component';
import { InformationDialogComponent } from '@components/information-dialog/information-dialog.component';

import { APP_AUTHOR, APP_NAME, APP_VERSION } from '../../../main';



@Component({
  selector: 'expenses-tracker-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    // modules
    NbActionsModule,
    NbContextMenuModule,
    NbDialogModule,
    NbLayoutModule,
    NbMenuModule,
    NbSidebarModule,
    NbUserModule,
    // pipes
    AsyncPipe,
    TextFormatPipe,
    TranslocoPipe,
    UpperCasePipe,
    // components
    RouterOutlet,
    LanguageSelectorComponent
  ]
})
export class LayoutPageComponent {
  readonly #store = inject(Store);
  readonly #authService = inject(NbAuthService);
  readonly #dialogService = inject(NbDialogService);
  readonly #translocoService = inject(TranslocoService);

  readonly APP_NAME = APP_NAME;
  readonly APP_AUTHOR = APP_AUTHOR;
  readonly APP_VERSION = APP_VERSION;
  readonly CURRENT_YEAR = new Date().getFullYear();

  readonly activeLanguage$ = this.#translocoService.langChanges$;
  readonly availableLanguages = this.#translocoService.getAvailableLangs() as ReadonlyArray<string>;

  readonly userEmail$: Observable<string> = this.#authService.getToken().pipe(
    map((token: NbAuthToken) => (token as NbAuthOAuth2JWTToken).getAccessTokenPayload()),
    map(({ email }) => email)
  );

  readonly userContextMenuItems$: Observable<Array<NbMenuItem>> = translocoLangChanged$(this.#translocoService)
    .pipe(
      map((translation: Translation) => ([
        {
          title: translation['MENU.USER.LOGOUT.TITLE'],
          link: `${AUTH_ROUTES_PREFIX}/${AUTH_PATHS.LOGOUT}`
        }
      ]))
    );

  readonly sideBarMenuItems$: Observable<Array<NbMenuItem>> = combineLatest([
    translocoLangChanged$(this.#translocoService),
    this.#store.select(({ app }: { app: AppStateModel }) => app.transactions.data?.length ?? 0),
    this.#store.select(({ app }: { app: AppStateModel }) => app.categories.data?.length ?? 0)
  ])
  .pipe(
    map(([translation, transactionsCount, categoriesCount]: readonly [Translation, number, number]) => ([
      {
        icon: 'pie-chart-outline',
        title: translation['MENU.SIDEBAR.OVERVIEW.TITLE'],
        link: `/${APP_PATHS.OVERVIEW}`,
        pathMatch: 'prefix',
        home: true
      },
      {
        icon: 'edit-2-outline',
        title: translation['MENU.SIDEBAR.MANAGEMENT.TITLE'],
        expanded: true,
        children: [
          {
            icon: 'list-outline',
            title: translation['MENU.SIDEBAR.MANAGEMENT.TRANSACTIONS.TITLE'],
            link: `/${APP_PATHS.MANAGEMENT.PATH}/${APP_PATHS.MANAGEMENT.TRANSACTIONS}`,
            pathMatch: 'prefix',
            ...(transactionsCount && {
              badge: {
                text: transactionsCount.toString(),
                status: 'info'
              }
            })
          },
          {
            icon: 'pricetags-outline',
            title: translation['MENU.SIDEBAR.MANAGEMENT.CATEGORIES.TITLE'],
            link: `/${APP_PATHS.MANAGEMENT.PATH}/${APP_PATHS.MANAGEMENT.CATEGORIES}`,
            pathMatch: 'prefix',
            ...(categoriesCount && {
              badge: {
                text: categoriesCount.toString(),
                status: 'info'
              }
            })
          }
        ]
      },
      {
        title: translation['MENU.SIDEBAR.LOGOUT.TITLE'],
        icon: 'unlock-outline',
        link: `/${AUTH_ROUTES_PREFIX}/${AUTH_PATHS.LOGOUT}`
      }
    ]))
  );

  onLanguageSelect(selectedLanguage: string): void {
    this.#translocoService.setActiveLang(selectedLanguage);
  }

  onAppInfoClick(): void {
    this.#dialogService
      .open(InformationDialogComponent, {
        context: {
          mainText: `${this.CURRENT_YEAR} &copy; <a href="mailto:${APP_AUTHOR.email}">${APP_AUTHOR.name}<a>`
        }
      })
  }
}
