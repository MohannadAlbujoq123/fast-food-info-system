import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css'],
  standalone: false
})
export class AutocompleteComponent implements OnInit {
  @Output() search = new EventEmitter<string>();
  @Input() options: string[] = []; 
  searchControl = new FormControl();
  filteredOptions: Observable<string[]>;

  constructor() {
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  ngOnInit(): void {
    this.searchControl.valueChanges.subscribe(value => {
      this.search.emit(value);
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  onOptionSelected(event: any): void {
    this.search.emit(event.option.value);
  }
}