import { Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { NbDatepickerModule, NbDialogModule, NbMenuModule, NbSidebarModule } from '@nebular/theme';

import { DATE_FORMAT } from './constants/date-time';

import { authGuardFactoryFn } from '@auth/auth.guard';



export const APP_PATHS = {
  HOME: '',
  OVERVIEW: 'overview',
  MANAGEMENT: {
    PATH: 'management',
    CATEGORIES: 'categories',
    TRANSACTIONS: 'transactions'
  }
} as const;

export const appRoutes: Routes = [
  {
    path: APP_PATHS.HOME,
    loadComponent: () => import('@pages/layout-page/layout-page.component').then(m => m.LayoutPageComponent),
    canActivate: [authGuardFactoryFn()],
    providers: [
      importProvidersFrom([
        NbMenuModule.forRoot(),
        NbDialogModule.forRoot(),
        NbSidebarModule.forRoot()
      ])
    ],
    children: [
      {
        path: APP_PATHS.OVERVIEW,
        loadComponent: () => import('@pages/layout-page/overview-page/overview-page.component').then(m => m.OverviewPageComponent),
        providers: [
          importProvidersFrom([
            NbDatepickerModule.forRoot(),
            NbDateFnsDateModule.forChild({
              format: DATE_FORMAT
            })
          ]),
          provideCharts(withDefaultRegisterables())
        ],
        data: {
          meta: {
            /**
             *
             * t(META.OVERVIEW_PAGE.TITLE)
             * t(META.OVERVIEW_PAGE.DESCRIPTION)
             */
            title: 'META.OVERVIEW_PAGE.TITLE',
            description: 'META.OVERVIEW_PAGE.DESCRIPTION'
          }
        }
      },
      {
        path: APP_PATHS.MANAGEMENT.PATH,
        loadComponent: () => import('@pages/layout-page/management-page/management-page.component').then(m => m.ManagementPageComponent),
        children: [
          {
            path: APP_PATHS.MANAGEMENT.TRANSACTIONS,
            loadComponent: () => import('@pages/layout-page/management-page/management-transactions-page/management-transactions-page.component').then(m => m.ManagementTransactionsPageComponent),
            providers: [
              importProvidersFrom([
                NbDialogModule.forChild(),
                NbDatepickerModule.forRoot(),
                NbDateFnsDateModule.forChild({
                  format: DATE_FORMAT
                })
              ])
            ],
            data: {
              meta: {
                /**
                 *
                 * t(META.MANAGEMENT.TRANSACTIONS_PAGE.TITLE)
                 * t(META.MANAGEMENT.TRANSACTIONS_PAGE.DESCRIPTION)
                 */
                title: 'META.MANAGEMENT.TRANSACTIONS_PAGE.TITLE',
                description: 'META.MANAGEMENT.TRANSACTIONS_PAGE.DESCRIPTION'
              }
            }
          },
          {
            path: APP_PATHS.MANAGEMENT.CATEGORIES,
            loadComponent: () => import('@pages/layout-page/management-page/management-categories-page/management-categories-page.component').then(m => m.ManagementCategoriesPageComponent),
            data: {
              meta: {
                /**
                 *
                 * t(META.MANAGEMENT.CATEGORIES_PAGE.TITLE)
                 * t(META.MANAGEMENT.CATEGORIES_PAGE.DESCRIPTION)
                 */
                title: 'META.MANAGEMENT.CATEGORIES_PAGE.TITLE',
                description: 'META.MANAGEMENT.CATEGORIES_PAGE.DESCRIPTION'
              }
            }
          },
          {
            path: '',
            pathMatch: 'full',
            redirectTo: APP_PATHS.MANAGEMENT.TRANSACTIONS
          },
          {
            path: '**',
            pathMatch: 'full',
            redirectTo: APP_PATHS.MANAGEMENT.TRANSACTIONS
          }
        ]
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: APP_PATHS.OVERVIEW
      }
    ]
  }
];
