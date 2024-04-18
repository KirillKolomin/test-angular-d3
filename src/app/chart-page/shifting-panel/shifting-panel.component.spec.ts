import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftingPanelComponent } from './shifting-panel.component';

describe('ShiftingPanelComponent', () => {
  let component: ShiftingPanelComponent;
  let fixture: ComponentFixture<ShiftingPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftingPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShiftingPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
