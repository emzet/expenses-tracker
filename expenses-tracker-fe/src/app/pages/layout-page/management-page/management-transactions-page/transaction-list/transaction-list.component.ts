import { format } from 'date-fns';
import { Params } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';
import { NbButtonModule, NbIconModule, NbInputModule, NbSpinnerModule } from '@nebular/theme';
import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';

import { DATE_FORMAT } from '@app/constants/date-time';
import { QUERY_PARAMS_KEYS } from '@app/constants/query-parameters';

import { Category, Transaction } from '@store/app.models';

import { DataTableComponent } from '@app/shared/components/data-table/data-table.component';
import { DataTableRowActions, DataTableRowData, DataTableSortQueryParams } from '@components/data-table/data-table.models';



@Component({
  selector: 'expenses-tracker-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    // components
    DataTableComponent,
    // modules
    NbButtonModule,
    NbIconModule,
    NbInputModule,
    NbSpinnerModule,
    ReactiveFormsModule,
    // pipes
    AsyncPipe,
    TranslocoPipe
  ]
})
export class TransactionListComponent implements OnChanges {
  readonly #destroyRef = inject(DestroyRef);
  readonly #translocoService = inject(TranslocoService);

  @Input() queryParams: Params = {};
  @Input({ required: true }) isLoading = false;
  @Input({ required: true }) isDialogOpened = false;
  @Input({ required: true }) categories: ReadonlyArray<Category> = [];
  @Input({ required: true }) transactions: ReadonlyArray<Transaction> = [];

  @Output() readonly reload = new EventEmitter<void>();
  @Output() readonly transactionAdd = new EventEmitter<void>();
  @Output() readonly transactionEdit = new EventEmitter<Transaction>();
  @Output() readonly transactionRemove = new EventEmitter<Transaction>();
  @Output() readonly pageChange = new EventEmitter<number>();
  @Output() readonly sortChange = new EventEmitter<DataTableSortQueryParams>();
  @Output() readonly searchChange = new EventEmitter<string>();

  readonly QUERY_PARAMS_KEYS = QUERY_PARAMS_KEYS;
  readonly #data$ = new BehaviorSubject<ReadonlyArray<DataTableRowData<Transaction, any>>>([]);
  readonly data$ = this.#data$.asObservable();

  searchFormControl = new FormControl<string>('', { nonNullable: true });

  ngOnInit(): void {
    this.searchFormControl.setValue(this.queryParams[QUERY_PARAMS_KEYS.SEARCH] || '');

    this.searchFormControl.valueChanges
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe({
        next: (value: string) => {
          this.#data$.next(this.#prepareDataForDataTable(this.categories, this.transactions, value));
          this.searchChange.emit(value)
        }
      });
  }

  ngOnChanges({ isLoading }: SimpleChanges): void {
    if (isLoading?.currentValue) {
      this.searchFormControl.disable();

      return;
    }

    this.searchFormControl.enable();

    this.#data$.next(this.#prepareDataForDataTable(this.categories, this.transactions, this.searchFormControl.value));
  }

  readonly tableColumns: ReadonlyArray<string> = [
    'title',
    'amount',
    'date',
    'type',
    'category',
    'description'
  ] as const;

  readonly tableSortColumns: ReadonlyArray<string> = [
    'title',
    'amount',
    'date',
    'type',
    'category',
    'description'
  ] as const;

  readonly tableRowActions: ReadonlyArray<DataTableRowActions> = [
    'edit',
    'remove'
  ] as const;

  readonly tableRowColumns: ReadonlyArray<string> = [
    'type'
  ];

  #prepareDataForDataTable(categories: ReadonlyArray<Category>, transactions: ReadonlyArray<Transaction>, searchValue: string): ReadonlyArray<DataTableRowData<Transaction, any>> {
    return transactions
      .filter(({ title }: Transaction) => title.toLowerCase().includes(searchValue.toLowerCase()))
      .map((transaction: Transaction) => ({
        rawData: transaction,
        viewData: {
          amount: transaction.amount.toLocaleString(this.#translocoService.getActiveLang()),
          date: format(new Date(transaction.date), DATE_FORMAT),
          type: transaction.type,
          category: categories.find(({ id }) => id === transaction.categoryId)?.title,
        }
      }))
  }
}
