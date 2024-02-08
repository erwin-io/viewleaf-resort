import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectStallDialogComponent } from './select-room-dialog.component';

describe('SelectStallDialogComponent', () => {
  let component: SelectStallDialogComponent;
  let fixture: ComponentFixture<SelectStallDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectStallDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectStallDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
