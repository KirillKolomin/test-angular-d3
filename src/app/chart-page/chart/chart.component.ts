import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild
} from '@angular/core';
import {Value} from "../domain/value";
import {extent, scaleUtc, scaleLinear, line} from "d3";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";

interface ViewLabel {
  date: Date;
  value: number;
  x: number;
  y: number;
}

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [
    NgIf,
    JsonPipe,
    NgForOf
  ],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements AfterViewInit {
  @Input() set values(values: Value[]) {
    this._values = values;
    this.initChart();
  };

  @ViewChild('chart') svgElement!: ElementRef<SVGElement>;

  curve: string | null = null;
  labels: ViewLabel[] | null = null
  marginTop = 20;
  marginRight = 20;
  marginBottom = 20;
  marginLeft = 20;

  private size: DOMRect | null = null;
  private _values: Value[] | null = null;

  constructor(private renderer: Renderer2, private cdr: ChangeDetectorRef) {
  }

  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      this.getSize();
    })

    setTimeout(() => {
      this.setViewBoxAttribute();
      this.initChart();
    })
  }

  initChart(): void {
    if (!this.svgElement || !this.size || !this._values) {
      return;
    }

    const dateExtent = extent(this._values, ({date}) => date) as [Date, Date];
    const valueExtent = extent(this._values, ({value}) => value) as [number, number];

    const timeScaleX = scaleUtc(dateExtent, [this.marginLeft, this.size.width - this.marginRight]);
    const valueScaleY = scaleLinear(valueExtent, [this.size.height - this.marginBottom, this.marginTop]);

    this.curve = line<Value>((data) => timeScaleX(data.date), (data) => valueScaleY(data.value))(this._values);
    this.labels = this._values.map(({date, value}) => ({
      date,
      value,
      x: timeScaleX(date),
      y: valueScaleY(value),
    }))

    this.cdr.markForCheck();
  }

  private getSize(): void {
      this.size = this.svgElement.nativeElement.getBoundingClientRect();
  }

  private setViewBoxAttribute(): void {
    if(this.size) {
      this.renderer.setAttribute(this.svgElement.nativeElement, 'viewBox', `0, 0, ${this.size.width}, ${this.size.height}`);
    }
  }

  trackBy(_index: number, item: ViewLabel): string {
    return item.date.toISOString();
  }
}
