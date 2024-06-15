import { RouterLink } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { MaskitoDirective } from '@maskito/angular';
import { isAfter, isBefore, isValid } from 'date-fns';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ChartConfiguration, ChartData, TooltipItem } from 'chart.js';
import { BehaviorSubject, Observable, combineLatest, map, startWith } from 'rxjs';
import { Translation, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { AsyncPipe, NgClass, NgTemplateOutlet, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { NbAlertModule, NbButtonGroupModule, NbButtonModule, NbCardModule, NbComponentSize, NbDatepickerModule, NbInputModule, NbSpinnerModule } from '@nebular/theme';

import { DATE_MASK } from '@utils/maskito.utils';
import { percentageTooltipLabel } from '@utils/chartjs.utils';
import { translocoLangChanged$ } from '@utils/transloco.utils';

import { Category, Transaction, TransactionType } from '@store/app.models';

import { APP_PATHS } from '@app/app.routes';
import { QUERY_PARAMS_KEYS, QUERY_PARAMS_VALUES } from '@app/constants/query-parameters';



@Component({
  selector: 'expenses-tracker-categories-chart',
  templateUrl: './categories-chart.component.html',
  styleUrl: './categories-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    // directives
    BaseChartDirective,
    MaskitoDirective,
    NgClass,
    NgTemplateOutlet,
    RouterLink,
    // modules
    NbAlertModule,
    NbButtonGroupModule,
    NbButtonModule,
    NbButtonModule,
    NbCardModule,
    NbDatepickerModule,
    NbInputModule,
    NbSpinnerModule,
    ReactiveFormsModule,
    // pipes
    AsyncPipe,
    TranslocoPipe,
    UpperCasePipe
  ]
})
export class CategoriesChartComponent implements OnInit {
  readonly #translocoService = inject(TranslocoService);

  @Input({ required: true }) isLoading = false;
  @Input({ required: true }) cardSize: NbComponentSize = 'medium';
  @Input({ required: true }) categories: ReadonlyArray<Category> = [];
  @Input({ required: true }) transactions: ReadonlyArray<Transaction> = [];
  @Input({ required: true }) transactionTypes: ReadonlyArray<TransactionType> = [];

  readonly DATE_MASK = DATE_MASK;
  readonly CHART_TYPE = 'pie' as const;

  readonly fromDateFormControl = new FormControl();
  readonly toDateFormControl = new FormControl();

  readonly #transactionTypeFilterChange$ = new BehaviorSubject<ReadonlyArray<TransactionType>>([]);
  readonly transactionTypeFilterChange$ = this.#transactionTypeFilterChange$.asObservable();

  readonly QUERY_PARAMS = { [QUERY_PARAMS_KEYS.ID]: QUERY_PARAMS_VALUES.NEW } as const;
  readonly TRANSACTIONS_LINK = `/${APP_PATHS.MANAGEMENT.PATH}/${APP_PATHS.MANAGEMENT.TRANSACTIONS}` as const;

  readonly chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true
        }
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          label: percentageTooltipLabel,
          afterLabel: ({ dataIndex, dataset: { data } }: TooltipItem<typeof this.CHART_TYPE>) => data[dataIndex].toLocaleString(this.#translocoService.getActiveLang())
        }
      }
    }
  } as const;

  readonly #chartData$ = combineLatest([
    translocoLangChanged$(this.#translocoService),
    combineLatest([
      this.fromDateFormControl.valueChanges.pipe(startWith(this.fromDateFormControl.value)),
      this.toDateFormControl.valueChanges.pipe(startWith(this.toDateFormControl.value)),
      this.transactionTypeFilterChange$
    ])
    .pipe(
      map(([fromDate, toDate, transactionTypes]) => this.transactions.filter(({ date, type }: Transaction) => {
        const typeFilter = !transactionTypes.length || transactionTypes.includes(type);
        const fromDateFilter = isValid(fromDate) ? isAfter(new Date(date), fromDate) : true;
        const toDateFilter = isValid(toDate) ? isBefore(new Date(date), toDate) : true;

        return fromDateFilter && toDateFilter && typeFilter;
      }))
    )
  ]);

  chartDataSum$!: Observable<ChartData<typeof this.CHART_TYPE, number[], string | string[]>>;
  chartDataCount$!: Observable<ChartData<typeof this.CHART_TYPE, number[], string | string[]>>;

  transactionFromDatePickerFilterFn = (selectedDate: Date) => isBefore(selectedDate, new Date())
    && (isValid(this.toDateFormControl.value) ? isBefore(selectedDate, this.toDateFormControl.value) : true);

  transactionToDatePickerFilterFn = (selectedDate: Date) => isBefore(selectedDate, new Date())
    && (isValid(this.fromDateFormControl.value) ? isAfter(selectedDate, this.fromDateFormControl.value) : true);

  onTransactionTypeFilterChange(transactionTypes: ReadonlyArray<TransactionType>): void {
    this.#transactionTypeFilterChange$.next(transactionTypes);
  }

  ngOnInit(): void {
    this.#transactionTypeFilterChange$.next(this.transactionTypes);

    this.chartDataSum$ = this.#chartData$
      .pipe(
        map(([translation, transactions]) =>
          this.#getChartData(translation, this.#calculateMetric(transactions, 'sum'))
        )
      );

    this.chartDataCount$ = this.#chartData$
    .pipe(
      map(([translation, transactions]) =>
        this.#getChartData(translation, this.#calculateMetric(transactions, 'count'))
      )
    );
  }

  #calculateMetric(transactions: ReadonlyArray<Transaction>, metric: 'count' | 'sum'): any {
    return transactions.reduce((result: { [categoryId: Transaction['categoryId']]: number }, { amount, categoryId }) => ({
      ...result,
      [categoryId]: metric === 'count'
        ? (result[categoryId] || 0) + 1
        : (result[categoryId] || 0) + amount
    }), {})
  }

  #getChartData(translation: Translation, transactions: ReadonlyArray<Transaction>): any {
    return {
      labels: Object
        .keys(transactions)
        .map((categoryId: Transaction['categoryId']) => {
          const { title, isDefault } = this.categories.find(({ id }) => categoryId === id) || {}

          return isDefault
            ? translation[`ENUMS.CATEGORIES.${title!.replace(/ /g, '_').toUpperCase()}`]
            : title || 'N/A'
        }),
      datasets: [
        {
          data: Object.values(transactions)
        }
      ]
    }
  }
}
