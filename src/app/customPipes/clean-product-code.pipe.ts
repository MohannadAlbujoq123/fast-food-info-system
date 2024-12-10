// customPipes/clean-product-code.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cleanProductCode',
  standalone: false,
})
export class CleanProductCodePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    // Remove all spaces
    value = value.replace(/\s+/g, '');

    // Make the first two letters capital
    const letters = value.substring(0, 2).toUpperCase();
    let rest = value.substring(2);

    // Ensure the third character is a dash if there are more than two characters
    if (rest.length > 0 && rest[0] !== '-') {
      rest = '-' + rest;
    }

    return `${letters}${rest}`;
  }
}