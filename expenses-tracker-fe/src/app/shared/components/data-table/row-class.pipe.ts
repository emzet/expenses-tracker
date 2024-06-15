import { Pipe, PipeTransform } from '@angular/core';



@Pipe({
  name: 'rowClasses',
  standalone: true
})
export class RowClassesPipe implements PipeTransform {
  transform(row: any, columns: ReadonlyArray<string>): ReadonlyArray<string> {
    return columns.map((column: string) => `${column}-${row[column].replace(/ /g, '-').toLowerCase()}`);
  }
}
