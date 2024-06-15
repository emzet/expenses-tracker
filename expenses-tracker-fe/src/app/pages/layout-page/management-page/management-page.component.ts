import { Observable, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Translation, TranslocoService } from '@jsverse/transloco';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NbCardModule, NbRouteTab, NbRouteTabsetModule } from '@nebular/theme';

import { APP_PATHS } from '@app/app.routes';
import { translocoLangChanged$ } from '@app/shared/utils/transloco.utils';



@Component({
  selector: 'expenses-tracker-management-page',
  templateUrl: './management-page.component.html',
  styleUrl: './management-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    // modules
    NbCardModule,
    NbRouteTabsetModule,
    // pipes
    AsyncPipe
  ]
})
export class ManagementPageComponent {
  readonly #translocoService = inject(TranslocoService);

  readonly tabs$: Observable<Array<NbRouteTab>> = translocoLangChanged$(this.#translocoService).pipe(
    map((translation: Translation) => ([
      {
        title: translation['MANAGEMENT.TABS.TRANSACTIONS'],
        route: `/${APP_PATHS.MANAGEMENT.PATH}/${APP_PATHS.MANAGEMENT.TRANSACTIONS}`,
        activeLinkOptions: {
          exact: false
        }
      },
      {
        title: translation['MANAGEMENT.TABS.CATEGORIES'],
        route: `/${APP_PATHS.MANAGEMENT.PATH}/${APP_PATHS.MANAGEMENT.CATEGORIES}`,
        activeLinkOptions: {
          exact: false
        }
      }
    ]))
  );
}
