import { AsyncPipe } from '@angular/common';
import { Store, Select } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { ActivatedRoute } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, first, map } from 'rxjs';
import { NbActionsModule, NbButtonModule, NbDialogService, NbIconModule } from '@nebular/theme';

import { APP_PATHS } from '@app/app.routes';
import { QUERY_PARAMS_KEYS, QUERY_PARAMS_VALUES } from '@app/constants/query-parameters';

import { AppStateModel } from '@store/app.state';
import { Category, TRANSACTION_TYPES, Transaction, TransactionDto } from '@store/app.models';
import { CreateTransaction, DeleteTransaction, GetCategories, GetTransactions, UpdateTransaction } from '@store/app.actions';

import { ConfirmationDialogComponent } from '@components/confirmation-dialog/confirmation-dialog.component';

import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionFormDialogComponent } from './transaction-form-dialog/transaction-form-dialog.component';



@Component({
  selector: 'expenses-tracker-management-transactions-page',
  templateUrl: './management-transactions-page.component.html',
  styleUrl: './management-transactions-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    // components
    TransactionListComponent,
    // modules
    NbActionsModule,
    NbButtonModule,
    NbIconModule,
    // pipes
    AsyncPipe,
    TranslocoPipe
  ]
})
export class ManagementTransactionsPageComponent {
  readonly #store = inject(Store);
  readonly #dialogService = inject(NbDialogService);
  readonly #activatedRoute = inject(ActivatedRoute);

  @Select((state: { app: AppStateModel }) => state.app.categories) categories$!: Observable<AppStateModel['categories']>;
  @Select((state: { app: AppStateModel }) => state.app.transactions) transactions$!: Observable<AppStateModel['transactions']>;

  readonly #anyDialogOpened$ = new BehaviorSubject(false);
  readonly anyDialogOpened$ = this.#anyDialogOpened$.asObservable();

  readonly TRANSACTION_TYPES = TRANSACTION_TYPES;

  constructor() {
    this.#store.dispatch([
      new GetCategories(),
      new GetTransactions()
    ]);

    const idFromQueryParam = this.#activatedRoute.snapshot.queryParamMap.get(QUERY_PARAMS_KEYS.ID);

    if (!idFromQueryParam) {
      return;
    }

    combineLatest([
      this.categories$.pipe(
        map(({ data }: AppStateModel['categories']) => data),
        first(Boolean)
      ),
      this.transactions$.pipe(
        map(({ data }: AppStateModel['transactions']) => data),
        first(Boolean),
        map((transactions: ReadonlyArray<Transaction>) => transactions.find(({ id }: Transaction) => id === idFromQueryParam))
      )
    ])
    .subscribe({
      next: ([categories, transaction]: readonly [ReadonlyArray<Category>, Transaction | undefined]) => transaction
        ? this.onTransactionEdit(categories, transaction)
        : this.onAddButtonClick(categories)
    });
  }

  onAddButtonClick(categories: ReadonlyArray<Category>): void {
    this.#anyDialogOpened$.next(true);

    if (categories.length) {
      this.#addIdToUrl();

      this.#dialogService
        .open(TransactionFormDialogComponent, {
          context: {
            categories,
            types: TRANSACTION_TYPES
          }
        })
        .onClose
        .subscribe({
          next: (transactionDto: TransactionDto) => {
            this.#anyDialogOpened$.next(false);

            this.#removeIdFromUrl();

            if (transactionDto) {
              this.#store.dispatch(new CreateTransaction(transactionDto))
            }
          }
        });
    }
    else {
      this.#dialogService
        .open(ConfirmationDialogComponent, {
          context: {
            mainText: 'MANAGEMENT.TRANSACTIONS_PAGE.FORM.NO_CATEGORIES',
            confirmButtonText: 'MANAGEMENT.TRANSACTIONS_PAGE.FORM.BUTTONS.OK'
          }
        })
        .onClose
        .subscribe({
          next: (isConfirmed: boolean) => {
            this.#anyDialogOpened$.next(false);

            if (isConfirmed) {
              this.#store.dispatch(new Navigate([`${APP_PATHS.MANAGEMENT.PATH}/${APP_PATHS.MANAGEMENT.CATEGORIES}`], {
                id: QUERY_PARAMS_VALUES.NEW
              }));
            }
          }
        });
    }
  }

  onReloadButtonClick(): void {
    this.#store.dispatch(new GetTransactions(true));
  }

  onTransactionEdit(categories: ReadonlyArray<Category>, { id, ...existingTransaction }: Transaction): void {
    // if (isDefault) {
    //   return;
    // }

    this.#anyDialogOpened$.next(true);

    this.#addIdToUrl(id);

    this.#dialogService
      .open(TransactionFormDialogComponent, {
        context: {
          categories,
          types: TRANSACTION_TYPES,
          transactionFormValue: existingTransaction
        }
      })
      .onClose
      .subscribe({
        next: (transactionDto: TransactionDto) => {
          this.#anyDialogOpened$.next(false);

          this.#removeIdFromUrl();

          if (transactionDto) {
            this.#store.dispatch(new UpdateTransaction(id, transactionDto))
          }
        }
      });
  }

  onTransactionRemove(transaction: Transaction): void {
    // if (transaction.isDefault) {
    //   return;
    // }

    this.#anyDialogOpened$.next(true);

    this.#dialogService
      .open(ConfirmationDialogComponent, {
        context: {
          mainText: 'MANAGEMENT.TRANSACTIONS_PAGE.DIALOG_REMOVE_TEXT',
          mainTextParams: {
            transactionTitle: transaction.title
          },
          confirmButtonStatus: 'danger'
        }
      })
      .onClose
      .subscribe({
        next: (isConfirmed: boolean) => {
          this.#anyDialogOpened$.next(false);

          if (isConfirmed) {
            this.#store.dispatch(new DeleteTransaction(transaction))
          }
        }
      });
  }

  #addIdToUrl(value: string = QUERY_PARAMS_VALUES.NEW): void {
    this.#store.dispatch(new Navigate([], { [QUERY_PARAMS_KEYS.ID]: value }, {
      relativeTo: this.#activatedRoute,
      replaceUrl: true
    }));
  }

  #removeIdFromUrl(): void {
    this.#store.dispatch(new Navigate([], {}, {
      relativeTo: this.#activatedRoute,
      replaceUrl: true
    }));
  }
}
