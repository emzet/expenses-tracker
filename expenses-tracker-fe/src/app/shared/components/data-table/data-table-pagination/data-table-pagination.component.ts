import { NgClass } from '@angular/common';
import { NbButtonModule } from '@nebular/theme';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';



@Component({
  selector: 'expenses-tracker-data-table-pagination',
  templateUrl: './data-table-pagination.component.html',
  styleUrl: './data-table-pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    // modules
    NbButtonModule,
    // directives
    NgClass
  ]
})
export class DataTablePaginationComponent implements OnChanges {
  @Input() dataSize = 0;
  @Input() rowsPerPage = 10;
  @Input() startingPage = 0;
  @Input() visibleCount = 5;

  @Output() readonly pageClick = new EventEmitter<number>();

  pageCount = 0;
  currentPage = 0;
  pagesNumbers: Array<number> = [];

  ngOnChanges({ dataSize }: SimpleChanges): void {
    if (!dataSize?.currentValue) {
      return;
    }

    this.pageCount = Math.ceil(this.dataSize! / this.rowsPerPage);

    if (this.pageCount < 2) {
      return;
    }

    const safePageNumber = this.startingPage < this.pageCount
      ? this.startingPage
      : this.pageCount - 1;

    this.#calculateCurrentValues(safePageNumber, false);
  }

  onPageClick(pageNumber: number): void {
    this.#calculateCurrentValues(pageNumber);
  }

  #calculateCurrentValues(pageNumber: number, shouldEmit: boolean = true): void {
    this.currentPage = pageNumber;
    this.pagesNumbers = this.#createPagesArray(pageNumber, this.visibleCount, this.pageCount);

    if (shouldEmit) {
      this.pageClick.emit(pageNumber);
    }
  }

  #createPagesArray(pageNumber: number, maxVisiblePages: number, currentPageCount: number): Array<number> {
    const realCount = (maxVisiblePages < currentPageCount)
      ? maxVisiblePages
      : currentPageCount

    const firstIndex = pageNumber - Math.floor((realCount - 1) / 2);

    const minPage = firstIndex < 0
      ? 0
      : firstIndex

    const startingIndex = (minPage + realCount) < currentPageCount
      ? minPage
      : currentPageCount - realCount;

    return [...Array(realCount)]
      .map((_: unknown, i: number) => startingIndex + i);
  }
}
