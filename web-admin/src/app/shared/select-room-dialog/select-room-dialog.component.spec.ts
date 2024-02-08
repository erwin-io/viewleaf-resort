import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectRoomDialogComponent } from './select-room-dialog.component';

describe('SelectRoomDialogComponent', () => {
  let component: SelectRoomDialogComponent;
  let fixture: ComponentFixture<SelectRoomDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectRoomDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectRoomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
