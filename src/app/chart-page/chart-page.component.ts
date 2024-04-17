import { Component } from '@angular/core';
import {ChartComponent} from "./chart/chart.component";
import {ListOfValuesComponent} from "./list-of-values/list-of-values.component";

@Component({
  selector: 'app-chart-page',
  standalone: true,
  imports: [
    ChartComponent,
    ListOfValuesComponent
  ],
  templateUrl: './chart-page.component.html',
  styleUrl: './chart-page.component.css'
})
export class ChartPageComponent {

}
