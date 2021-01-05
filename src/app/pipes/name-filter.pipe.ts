import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameFilter',
})
export class NameFilterPipe implements PipeTransform {
  transform(value: any, args: string): unknown {
    if (!value) return null;
    if (!args) return value;
    args = args.toLowerCase();
    return value.filter((item: any) => {
      return JSON.stringify(item).toLowerCase().includes(args);
    });
  }
}
