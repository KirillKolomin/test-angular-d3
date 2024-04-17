import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ChartComponent} from "./chart/chart.component";
import {ListOfValuesComponent} from "./list-of-values/list-of-values.component";
import {Value} from "./domain/value";

const LOCAL_STORAGE_VALUE_KEY = 'values';

@Component({
  selector: 'app-chart-page',
  standalone: true,
  imports: [
    ChartComponent,
    ListOfValuesComponent
  ],
  templateUrl: './chart-page.component.html',
  styleUrl: './chart-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartPageComponent implements OnInit {
  values: Value[] = [];

  ngOnInit(): void {
    this.restoreValuesFromLocalStorage();
  }

  addNewValue(value: number): void {
    this.values = [...this.values, {
      date: new Date(),
      value,
    }];
    this.setValuesToLocalStorage();
  }

  removeValue(index: number): void {
    this.values = this.values.filter((_value, i) => i !== index);
    this.setValuesToLocalStorage();
  }

  setValuesToLocalStorage(): void {
    localStorage.setItem(LOCAL_STORAGE_VALUE_KEY, JSON.stringify(this.values));
  }

  restoreValuesFromLocalStorage(): void {
    const storedValues = localStorage.getItem(LOCAL_STORAGE_VALUE_KEY);

    if (storedValues) {
      const values = JSON.parse(storedValues);

      if (Array.isArray(values)) {
        this.values = values.map(({value, date}) => ({date: new Date(date), value}))
      }
    }
  }
}
