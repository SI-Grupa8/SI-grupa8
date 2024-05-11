import { Pipe, PipeTransform } from '@angular/core';
import { isNullOrUndef } from 'chart.js/dist/helpers/helpers.core';

@Pipe({
  name: 'fullName',
  standalone: true
})
export class FullNamePipe implements PipeTransform {

  transform(value: any): string {
    if (!value || typeof value !== 'object') return '';
    return `${value.name} ${value.surname}`;
  }

}
