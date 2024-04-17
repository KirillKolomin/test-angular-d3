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
    this.values.push({
      date: new Date().toISOString().slice(14, 23),
      value,
    });
    this.setValuesToLocalStorage();
  }

  removeValue(index: number): void {
    this.values.splice(index, 1);
    this.setValuesToLocalStorage();
  }

  setValuesToLocalStorage(): void {
    localStorage.setItem(LOCAL_STORAGE_VALUE_KEY, JSON.stringify(this.values));
  }

  restoreValuesFromLocalStorage(): void {
    const storedValues = localStorage.getItem(LOCAL_STORAGE_VALUE_KEY);

    if (storedValues) {
      this.values = JSON.parse(storedValues);
    }
  }
}
