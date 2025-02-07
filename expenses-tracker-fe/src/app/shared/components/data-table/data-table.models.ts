export type DataTableSortDirections
  = 'ASC'
  | 'DESC';

export type DataTableRowActions
  = 'edit'
  | 'remove';

export interface DataTableRowData<T1 = any, T2 = any> {
  rawData: T1;
  viewData: T2;
  [property: string]: any;
}

export interface DataTableSortQueryParams {
  column: string;
  direction: DataTableSortDirections;
}

export interface DataTableQueryParams extends DataTableSortQueryParams {
  page: number;
}
