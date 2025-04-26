import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateColor'
})
export class DateColorPipe implements PipeTransform {
  transform(date: string | Date, done: boolean): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(date);

    return inputDate < today && !done ? 'text-error-50' : 'text-gray-500';
  }

}
