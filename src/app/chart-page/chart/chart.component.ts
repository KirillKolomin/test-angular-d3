import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  Input, NgZone, OnDestroy, OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {Value} from "../domain/value";
import {extent, scaleUtc, scaleLinear, line} from "d3";
import {AsyncPipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {Subject, Subscription, throttleTime} from "rxjs";

interface ViewLabel {
  date: Date;
  value: number;
  x: number;
  y: number;
}

const MILLISECONDS_PER_FRAME = 1000 / 60;

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [
    NgIf,
    JsonPipe,
    NgForOf,
    AsyncPipe
  ],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements AfterViewInit, OnDestroy, OnInit {
  @Input() set values(values: Value[]) {
    this._values = values;
    this.calculateChart();
  };

  @ViewChild('chart') svgElement!: ElementRef<SVGElement>;

  curve: string | null = null;
  labels: ViewLabel[] | null = null
  marginTop = 20;
  marginRight = 20;
  marginBottom = 20;
  marginLeft = 20;

  private observer = new ResizeObserver(entries => this.ngZone.run(() => this.onResizeObserved$.next(entries[0])));
  private size: DOMRect | null = null;
  private _values: Value[] | null = null;
  private onResizeObservedSubscription: Subscription | null = null;
  private onResizeObserved$ = new Subject<ResizeObserverEntry>();

  constructor(private renderer: Renderer2, private cdr: ChangeDetectorRef, private ngZone: NgZone) {
  }

  ngOnInit() {
    this.onResizeObservedSubscription = this.onResizeObserved$.pipe(throttleTime(MILLISECONDS_PER_FRAME, undefined, {
      leading: true,
      trailing: true
    })).subscribe((entry: ResizeObserverEntry) => {
      this.size = entry.contentRect;

      this.setViewBoxAttribute();
      this.calculateChart();
    });
  }

  ngAfterViewInit(): void {
    this.startResizeObserving();
  }

  ngOnDestroy(): void {
    this.observer.disconnect()
    this.onResizeObservedSubscription?.unsubscribe()
  }

  trackBy(_index: number, item: ViewLabel): string {
    return item.date.toISOString();
  }

  private calculateChart(): void {
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

  private startResizeObserving(): void {
    this.observer.observe(this.svgElement.nativeElement);
  }

  private setViewBoxAttribute(): void {
    if (this.size) {
      this.renderer.setAttribute(this.svgElement.nativeElement, 'viewBox', `0, 0, ${this.size.width}, ${this.size.height}`);
    }
  }
}
