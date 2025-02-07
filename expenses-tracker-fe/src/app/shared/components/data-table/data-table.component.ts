import { TranslocoPipe } from '@jsverse/transloco';
import { CdkTableModule } from '@angular/cdk/table';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { NbButtonModule, NbIconModule } from '@nebular/theme';
import { AsyncPipe, NgClass, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, SimpleChanges, booleanAttribute, numberAttribute } from '@angular/core';

import { RowClassesPipe } from './row-class.pipe';
import { DataTablePaginationComponent } from './data-table-pagination/data-table-pagination.component';
import { DataTableRowActions, DataTableRowData, DataTableSortDirections, DataTableSortQueryParams } from './data-table.models';



@Component({
  selector: 'expenses-tracker-data-table',
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    // components
    DataTablePaginationComponent,
    // modules
    CdkTableModule,
    NbButtonModule,
    NbIconModule,
    // pipes
    AsyncPipe,
    RowClassesPipe,
    TranslocoPipe,
    UpperCasePipe,
    // directives
    NgClass
  ]
})
export class DataTableComponent {
  @Input() rowActions: ReadonlyArray<DataTableRowActions> = [];
  @Input() rowColumns: ReadonlyArray<string> = [];
  @Input() sortColumn: string = '';
  @Input() sortColumns: ReadonlyArray<string> = [];
  @Input() sortDirection: DataTableSortDirections = 'ASC';
  @Input({ required: true }) columns: ReadonlyArray<string> = [];
  @Input({ required: true }) data: ReadonlyArray<DataTableRowData> = [];
  @Input({ transform: booleanAttribute }) isDialogOpened = false;
  @Input({ transform: numberAttribute }) pagerRowsPerPage = 10;
  @Input({ transform: numberAttribute }) pagerStartingPage = 0;
  @Input({ transform: numberAttribute }) pagerVisibleCount = 5;

  @Output() readonly elementEdit = new EventEmitter<any>();
  @Output() readonly elementRemove = new EventEmitter<any>();
  @Output() readonly filterChange = new EventEmitter<any>();
  @Output() readonly pageChange = new EventEmitter<number>();
  @Output() readonly sortChange = new EventEmitter<DataTableSortQueryParams>();

  readonly #data$ = new BehaviorSubject<ReadonlyArray<DataTableRowData>>([]);
  readonly data$ = this.#data$.asObservable();

  readonly #currentSortColumn$ = new BehaviorSubject<string>('');
  readonly currentSortColumn$ = this.#currentSortColumn$.asObservable();

  readonly #currentSortDirection$ = new BehaviorSubject<DataTableSortDirections>('ASC');
  readonly currentSortDirection$ = this.#currentSortDirection$.asObservable();

  readonly #currentPageNumber$ = new BehaviorSubject<number>(0);
  readonly currentPageNumber$ = this.#currentPageNumber$.asObservable();

  readonly sortedData$ = combineLatest([
    this.data$,
    this.currentSortColumn$,
    this.currentSortDirection$
  ])
  .pipe(
    map(([data, currentSortColumn, currentSortDirection]) => this.#sortData(data, currentSortColumn, currentSortDirection))
  );

  readonly currentPageData$ = combineLatest([
    this.sortedData$,
    this.currentPageNumber$
  ])
  .pipe(
    map(([sortedData, currentPageNumber]) => this.#paginateData(sortedData, currentPageNumber))
  );

  ngOnInit(): void {
    this.#data$.next(this.data);
    this.#currentSortColumn$.next(this.sortColumn);
    this.#currentSortDirection$.next(this.sortDirection);
    this.#currentPageNumber$.next(this.pagerStartingPage);
  }

  ngOnChanges({ data }: SimpleChanges): void {
    if (data?.currentValue) {
      this.#data$.next(data.currentValue);
    }
  }

  onHeaderCellClick(currentSortColumn: string, currentSortDirection: DataTableSortDirections, selectedColumn: string): void {
    if (currentSortColumn === selectedColumn) {
      const nextDirection = currentSortDirection === 'ASC'
        ? 'DESC'
        : 'ASC';

      this.#currentSortDirection$.next(nextDirection);

      this.sortChange.emit({
        column: selectedColumn,
        direction: nextDirection
      });
    }
    else {
      const nextDirection = 'ASC';

      this.#currentSortColumn$.next(selectedColumn);
      this.#currentSortDirection$.next(nextDirection);

      this.sortChange.emit({
        column: selectedColumn,
        direction: nextDirection
      });
    }
  }

  onPageClick(selectedPageNumber: number): void {
    this.#currentPageNumber$.next(selectedPageNumber);

    this.pageChange.emit(selectedPageNumber);
  }

  #sortData(data: ReadonlyArray<DataTableRowData>, sortColumn: string, sortDirection: DataTableSortDirections): ReadonlyArray<DataTableRowData> {
    return [...data].sort((a, b) => {
      if (a.rawData[sortColumn] > b.rawData[sortColumn]) {
        return sortDirection === 'ASC' ? 1 : -1
      };

      if (a.rawData[sortColumn] < b.rawData[sortColumn]) {
        return sortDirection === 'ASC' ? -1 : 1
      };

      return 0;
    })
  }

  #paginateData(data: ReadonlyArray<DataTableRowData>, pageNumber: number): ReadonlyArray<DataTableRowData> {
    const startIndex = pageNumber * this.pagerRowsPerPage;
    const endIndex = startIndex + this.pagerRowsPerPage;

    return data.slice(startIndex, endIndex);
  }
}
