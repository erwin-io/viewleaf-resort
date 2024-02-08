import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomBookinClosedComponent } from './room-booking-closed.component';

describe('RoomBookinClosedComponent', () => {
  let component: RoomBookinClosedComponent;
  let fixture: ComponentFixture<RoomBookinClosedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomBookinClosedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomBookinClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
