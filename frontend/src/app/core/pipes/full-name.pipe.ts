import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullName',
  standalone: true
})
export class FullNamePipe implements PipeTransform {

  transform(value: any): string {
    if (!value) return '';
    return `${value.name} ${value.surname}`;
  }

}
