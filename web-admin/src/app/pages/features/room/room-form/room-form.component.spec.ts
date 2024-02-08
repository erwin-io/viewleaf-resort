import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StallFormComponent } from './room-form.component';

describe('StallFormComponent', () => {
  let component: StallFormComponent;
  let fixture: ComponentFixture<StallFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StallFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StallFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
