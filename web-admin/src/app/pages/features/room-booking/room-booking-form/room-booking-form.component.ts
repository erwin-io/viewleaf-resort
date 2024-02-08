import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { RoomBooking } from 'src/app/model/room-booking.model';

@Component({
  selector: 'app-room-booking-form',
  templateUrl: './room-booking-form.component.html',
  styleUrls: ['./room-booking-form.component.scss']
})
export class RoomBookingFormComponent {
  roomBooking!: RoomBooking;
  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  public setFormValue(value: RoomBooking) {
    this.roomBooking = value;
  }

  public get getFormData() {
    return this.form.value;
  }

  public get valid() {
    return this.form.valid;
  }

  public get ready() {
    return this.form.valid;
  }

  getError(key: string) {
    return this.form.controls && this.form.controls[key] ? this.form.controls[key].errors : null;
  }
}
