import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {Value} from "../domain/value";

interface ValueForView {
  date: string;
  value: number;
}

@Component({
  selector: 'app-list-of-values',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './list-of-values.component.html',
  styleUrl: './list-of-values.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListOfValuesComponent {
  @Input() set values(values: Value[]) {
    this._values = values.map(({date, value}) => ({
      date: date.toISOString().slice(14, 23),
      value
    }))
  }

  get values(): ValueForView[] {
    return this._values;
  }

  control = new FormControl<number>(0)

  @Output() onNewValueAdd = new EventEmitter<number>();
  @Output() onValueRemove = new EventEmitter<number>();

  private _values: ValueForView[] = [];

  addValueItem(event: Event) {
    event.stopPropagation();

    this.onNewValueAdd.emit(this.control.value ?? 0);
    this.control.setValue(0);
  }

  removeValueItem(index: number): void {
    this.onValueRemove.emit(index);
  }
}
