import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {Value} from "../domain/value";

@Component({
  selector: 'app-list-of-values',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './list-of-values.component.html',
  styleUrl: './list-of-values.component.css'
})
export class ListOfValuesComponent {
  @Input() values: Value[] = []

  control = new FormControl<number>(0)

  @Output() onNewValueAdd = new EventEmitter<number>();
  @Output() onValueRemove = new EventEmitter<number>();

  addValueItem(event: Event) {
    event.stopPropagation();

    this.onNewValueAdd.emit(this.control.value ?? 0);
    this.control.setValue(0);
  }

  removeValueItem(index: number): void {
    this.onValueRemove.emit(index);
  }
}
