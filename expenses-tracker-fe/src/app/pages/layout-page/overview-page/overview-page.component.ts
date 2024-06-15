import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { AsyncPipe } from '@angular/common';
import { NbCardModule } from '@nebular/theme';
import { AppStateModel } from '@store/app.state';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TRANSACTION_TYPES } from '@store/app.models';
import { GetCategories, GetTransactions } from '@store/app.actions';

import { CategoriesChartComponent } from './categories-chart/categories-chart.component';
import { TransactionsChartComponent } from './transactions-chart/transactions-chart.component';



@Component({
  selector: 'expenses-tracker-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrl: './overview-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    // components
    CategoriesChartComponent,
    TransactionsChartComponent,
    // modules
    NbCardModule,
    // pipes
    AsyncPipe
  ]
})
export class OverviewPageComponent {
  readonly #store = inject(Store);

  readonly TRANSACTION_TYPES = TRANSACTION_TYPES;

  @Select((state: { app: AppStateModel }) => state.app.categories) categories$!: Observable<AppStateModel['categories']>;
  @Select((state: { app: AppStateModel }) => state.app.transactions) transactions$!: Observable<AppStateModel['transactions']>;

  constructor() {
    this.#store.dispatch([
      new GetCategories(),
      new GetTransactions()
    ]);
  }
}
