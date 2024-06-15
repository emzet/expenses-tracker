import { RouterLink } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartConfiguration } from 'chart.js';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, NgClass, UpperCasePipe } from '@angular/common';
import { Translation, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { BehaviorSubject, Observable, combineLatest, map, startWith } from 'rxjs';
import { NbButtonModule, NbCardModule, NbComponentSize, NbSelectModule, NbSpinnerModule } from '@nebular/theme';
import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';

import { MONTH_LIST } from '@utils/date.utils';
import { translocoLangChanged$ } from '@utils/transloco.utils';

import { Category, Transaction, TransactionType } from '@store/app.models';

import { APP_PATHS } from '@app/app.routes';
import { QUERY_PARAMS_KEYS, QUERY_PARAMS_VALUES } from '@app/constants/query-parameters';



type ChartMetric
  = 'count'
  | 'sum'
  | 'avg'

interface TransactionTree {
  [type: string]: {
    count: number;
    sum: number;
    avg: number;
    years: {
      [year: string]: {
        count: number;
        sum: number;
        avg: number;
        months: {
          [month: string]: {
            count: number;
            sum: number;
            avg: number;
            days: {
              [day: string]: {
                count: number;
                sum: number;
                avg: number;
              }
            }
          }
        }
      }
    }
  };
}

@Component({
  selector: 'expenses-tracker-transactions-chart',
  templateUrl: './transactions-chart.component.html',
  styleUrl: './transactions-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    // directives
    BaseChartDirective,
    NgClass,
    RouterLink,
    // modules
    NbButtonModule,
    NbCardModule,
    NbSelectModule,
    NbSpinnerModule,
    ReactiveFormsModule,
    // pipes
    AsyncPipe,
    TranslocoPipe,
    UpperCasePipe
  ]
})
export class TransactionsChartComponent implements OnChanges, OnInit {
  readonly #destroyRef = inject(DestroyRef);
  readonly #translocoService = inject(TranslocoService);

  @Input({ required: true }) isLoading = false;
  @Input({ required: true }) metric: ChartMetric = 'avg';
  @Input({ required: true }) cardSize: NbComponentSize = 'medium';
  @Input({ required: true }) categories: ReadonlyArray<Category> = [];
  @Input({ required: true }) transactions: ReadonlyArray<Transaction> = [];
  @Input({ required: true }) transactionTypes: ReadonlyArray<TransactionType> = [];

  readonly CHART_TYPE = 'bar' as const;

  chartData$!: Observable<ChartData<typeof this.CHART_TYPE, Array<number>, string | Array<string>>>;
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      },
      tooltip: {
        displayColors: false
      }
    }
  } as const;

  readonly NO_FILTER_VALUE = 'NO_FILTER' as const;
  readonly QUERY_PARAMS = { [QUERY_PARAMS_KEYS.ID]: QUERY_PARAMS_VALUES.NEW } as const;
  readonly TRANSACTIONS_LINK = `/${APP_PATHS.MANAGEMENT.PATH}/${APP_PATHS.MANAGEMENT.TRANSACTIONS}` as const;

  transactionTree: TransactionTree = {};

  years: ReadonlyArray<string> = [] as const;
  yearFormControl = new FormControl<string>(this.NO_FILTER_VALUE, { nonNullable: true });

  readonly #months$ = new BehaviorSubject<ReadonlyArray<string>>(MONTH_LIST(this.#translocoService.getActiveLang()));
  readonly months$ = this.#months$.asObservable();
  monthFormControl = new FormControl<string>({ value: this.NO_FILTER_VALUE, disabled: true }, { nonNullable: true });

  readonly #days: ReadonlyArray<string> = [...Array(30).keys()].map(dayIndex => (dayIndex + 1).toString());

  filter$ = combineLatest([
    this.yearFormControl.valueChanges.pipe(startWith(this.yearFormControl.value)),
    this.monthFormControl.valueChanges.pipe(startWith(this.monthFormControl.value))
  ]);

  ngOnInit(): void {
    this.chartData$ = combineLatest([
      translocoLangChanged$(this.#translocoService),
      this.filter$
    ])
    .pipe(
      map(([translation, [selectedYear, selectedMonth]]) => this.#getChartData(translation, selectedYear, selectedMonth))
    )

    this.#resetMonth();
  }

  ngOnChanges({ transactions }: SimpleChanges): void {
    if (transactions && (transactions.currentValue as ReadonlyArray<Transaction>).length) {
      this.transactionTree = this.#getTransactinonsTree(transactions.currentValue);

      this.years = Object
        .values(this.transactionTree)
        .reduce((allYears: ReadonlyArray<string>, { years }: any) => [...new Set(allYears.concat(Object.keys(years)))], []);
    }
  }

  #resetMonth(): void {
    this.yearFormControl.valueChanges
      .pipe(
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe({
        next: (value: string) => {
          if (value === this.NO_FILTER_VALUE) {
            this.monthFormControl.setValue(this.NO_FILTER_VALUE);
            this.monthFormControl.disable();
          }
          else {
            this.monthFormControl.enable();
          }
        }
      });
  }

  #getTransactinonsTree(transactions: ReadonlyArray<Transaction>): TransactionTree {
    return transactions.reduce((result: TransactionTree, { amount, date, type }: Transaction) => {
      const dateObj = new Date(date);

      const year = dateObj.getFullYear().toString();
      const month = dateObj.getMonth().toString();
      const day = dateObj.getDate().toString();

      const currentTypeObj = result[type];
      const currentYearObj = currentTypeObj?.years?.[year];
      const currentMonthObj = currentYearObj?.months?.[month];
      const currentDayObj = currentMonthObj?.days?.[day];

      return {
        ...result,
        [type]: {
          ...currentTypeObj,
          count: (currentTypeObj?.count || 0) + 1,
          sum: (currentTypeObj?.sum || 0) + amount,
          avg: ((currentTypeObj?.sum || 0) + amount) / ((currentTypeObj?.count || 0) + 1),
          years: {
            ...currentTypeObj?.years,
            [year]: {
              ...(currentYearObj || {}),
              count: (currentYearObj?.count || 0) + 1,
              sum: (currentYearObj?.sum || 0) + amount,
              avg: ((currentYearObj?.sum || 0) + amount) / ((currentYearObj?.count || 0) + 1),
              months: {
                ...currentYearObj?.months,
                [month]: {
                  ...(currentMonthObj || {}),
                  count: (currentMonthObj?.count || 0) + 1,
                  sum: (currentMonthObj?.sum || 0) + amount,
                  avg: ((currentMonthObj?.sum || 0) + amount) / ((currentMonthObj?.count || 0) + 1),
                  days: {
                    ...currentYearObj?.months[month]?.days,
                    [day]: {
                      ...(currentDayObj || {}),
                      count: (currentDayObj?.count || 0) + 1,
                      sum: (currentDayObj?.sum || 0) + amount,
                      avg: ((currentDayObj?.sum || 0) + amount) / ((currentDayObj?.count || 0) + 1)
                    }
                  }
                }
              }
            }
          }
        }
      }
    }, {});
  }

  #getChartData(translation: Translation, selectedYear: string, selectedMonth: string): any {
    const monthList = MONTH_LIST(this.#translocoService.getActiveLang());

    this.#months$.next(monthList);

    const labels = selectedYear === this.NO_FILTER_VALUE
      ? this.years  // NOTE: x-axis years [MIN_YEAR-MAX_YEAR]
      : selectedMonth === this.NO_FILTER_VALUE
        ? monthList // NOTE: x-axis months [0-11]
        : this.#days; // NOTE: x-axis days   [1-31]

    const datasets = Object.entries(this.transactionTree).map(([type, { years }]: any) => ({
      label: translation[`ENUMS.TRANSACTION_TYPES.${type}`],
      data: selectedYear === this.NO_FILTER_VALUE
        ? Object.values(years).map((groupValueObj: any) => groupValueObj[this.metric] || 0) // NOTE: by years
        : selectedMonth === this.NO_FILTER_VALUE
          ? monthList.map((_, monthIndex) => years[selectedYear]?.months[monthIndex]?.[this.metric] || 0) // NOTE: by months
          : this.#days.map(dayIndex => years[selectedYear]?.months[selectedMonth]?.days[dayIndex]?.[this.metric] || 0) // NOTE: by days
    }));

    return {
      labels,
      datasets
    }
  }
}
