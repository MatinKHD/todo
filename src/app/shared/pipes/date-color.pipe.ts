import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateColor'
})
export class DateColorPipe implements PipeTransform {
  transform(date: string | Date): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(date);

    return inputDate < today ? 'text-error-50' : '';
  }

}
