import { Pipe, PipeTransform } from '@angular/core';



@Pipe({
  name: 'etTextFormat',
  standalone: true
})
export class TextFormatPipe implements PipeTransform {
  transform(value: string, format: string, ...args: Array<string>): string {
    if (typeof value !== 'string') {
      return value;
    }

    switch (format) {
      case 'replace':
        return (typeof args[0] === 'string' && typeof args[1] === 'string')
          ? value.replace(new RegExp(args[0], 'g'), args[1])
          : value;
      default:
        return value;
    }
  }
}
