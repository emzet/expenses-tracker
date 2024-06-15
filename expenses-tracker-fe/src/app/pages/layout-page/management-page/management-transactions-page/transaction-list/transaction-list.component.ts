import { format } from 'date-fns';
import { Observable, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { NbButtonModule, NbIconModule } from '@nebular/theme';
import { Translation, TranslocoService } from '@jsverse/transloco';
import { Angular2SmartTableModule, LocalDataSource, Row, Settings } from 'angular2-smart-table';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';

import { translocoLangChanged$ } from '@utils/transloco.utils';
import { DATE_FORMAT } from '@app/constants/date-time';

import { Category, TRANSACTION_TYPES, Transaction } from '@store/app.models';



@Component({
  selector: 'expenses-tracker-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    // modules
    Angular2SmartTableModule,
    NbButtonModule,
    NbIconModule,
    // pipes
    AsyncPipe
  ]
})
export class TransactionListComponent implements OnChanges {
  readonly #translocoService = inject(TranslocoService);
  readonly #changeDetectorRef = inject(ChangeDetectorRef);

  @Input({ required: true }) isLoading = false;
  @Input({ required: true }) categories: ReadonlyArray<Category> = [];
  @Input({ required: true }) transactions: ReadonlyArray<Transaction> = [];

  @Output() readonly transactionEdit = new EventEmitter<Transaction>();
  @Output() readonly transactionRemove = new EventEmitter<Transaction>();

  source: LocalDataSource = new LocalDataSource();

  settings$: Observable<Settings> = translocoLangChanged$(this.#translocoService).pipe(
    map((translation: Translation) => ({
      mode: 'external',
      noDataMessage: translation['MANAGEMENT.TRANSACTIONS_PAGE.TABLE.NO_DATA'],
      rowClassFunction: (row: Row) => (row.getData() as Transaction).type.toLowerCase().concat('-row'),
      actions: {
        add: false,
        position: 'right',
        columnTitle: translation['MANAGEMENT.TRANSACTIONS_PAGE.TABLE.COLUMNS.ACTIONS']
      },
      edit: {
        editButtonContent: translation['MANAGEMENT.TRANSACTIONS_PAGE.TABLE.ACTION_BUTTONS.EDIT']
      },
      delete: {
        deleteButtonContent: translation['MANAGEMENT.TRANSACTIONS_PAGE.TABLE.ACTION_BUTTONS.DELETE']
      },
      columns: {
        title: {
          title: translation['MANAGEMENT.TRANSACTIONS_PAGE.TABLE.COLUMNS.TITLE']
        },
        amount: {
          classContent: 'text-right',
          title: translation['MANAGEMENT.TRANSACTIONS_PAGE.TABLE.COLUMNS.AMOUNT'],
          valuePrepareFunction: (rawValue: number) => rawValue.toLocaleString(this.#translocoService.getActiveLang())
        },
        date: {
          classContent: 'text-right',
          title: translation['MANAGEMENT.TRANSACTIONS_PAGE.TABLE.COLUMNS.DATE'],
          valuePrepareFunction: (rawValue: Date) => format(new Date(rawValue), DATE_FORMAT)
        },
        type: {
          title: translation['MANAGEMENT.TRANSACTIONS_PAGE.TABLE.COLUMNS.TYPE'],
          valuePrepareFunction: (rawValue: string) => translation[`ENUMS.TRANSACTION_TYPES.${rawValue}`],
          filter: {
            type: 'list',
            config: {
              selectText: translation['MANAGEMENT.TRANSACTIONS_PAGE.TABLE.SELECT_PLACEHOLDER'],
              list: TRANSACTION_TYPES.map(value => ({
                value,
                title: translation[`ENUMS.TRANSACTION_TYPES.${value}`]
              }))
            }
          }
        },
        categoryId: {
          title: translation['MANAGEMENT.TRANSACTIONS_PAGE.TABLE.COLUMNS.CATEGORY'],
          valuePrepareFunction: (rawValue: string) => {
            const { title, isDefault } = this.categories.find(({ id }) => rawValue === id) || {}

            return isDefault
              ? translation[`ENUMS.CATEGORIES.${title!.replace(/ /g, '_').toUpperCase()}`]
              : title || 'N/A'
          }
        },
        description: {
          title: translation['MANAGEMENT.TRANSACTIONS_PAGE.TABLE.COLUMNS.DESCRIPTION']
        }
      }
    }))
  );

  ngOnChanges({ transactions }: SimpleChanges): void {
    if (!transactions) {
      return;
    }

    this.#updateSource(transactions.currentValue);
  }

  onEditButtonClick({ data }: any): void {
    this.transactionEdit.emit(data);
  }

  onDeleteButtonClick({ data }: any): void {
    this.transactionRemove.emit(data);
  }

  #updateSource(transactions: ReadonlyArray<Transaction>): void {
    const currentSort = this.source.getSort();
    const currentFilter = this.source.getFilter();

    this.source.load(transactions as Array<Transaction>).then(() => {
      this.source.setSort(currentSort);
      this.source.setFilter(currentFilter);

      this.#changeDetectorRef.detectChanges(); // NOTE: need to manually refresh view
    });
  }
}
