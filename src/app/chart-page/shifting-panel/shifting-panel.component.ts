import {Component, Input} from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-shifting-panel',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './shifting-panel.component.html',
  styleUrl: './shifting-panel.component.css'
})
export class ShiftingPanelComponent {
  @Input() direction: 'left' | 'right' | null = null

  private checked = false;

  get class() {
    return `${this.direction} ${this.checked ? 'checked' : ''}`;
  }

  togglePanel(event: Event) {
    this.checked = (event.target as HTMLInputElement).checked;
  }
}
