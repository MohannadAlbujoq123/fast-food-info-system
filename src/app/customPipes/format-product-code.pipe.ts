import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatProductCode',
  standalone: false,
})
export class FormatProductCodePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    // Remove all spaces
    value = value.replace(/\s+/g, '');

    // Ensure the format is FD-0002
    const letters = value.substring(0, 2).toUpperCase();
    const numbers = value.substring(2);

    return `${letters}-${numbers}`;
  }
}