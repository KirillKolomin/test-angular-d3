import {Component} from '@angular/core';
import {ChartPageComponent} from "./chart-page/chart-page.component";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    ChartPageComponent
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
}
