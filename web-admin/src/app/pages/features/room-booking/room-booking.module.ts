import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomBookingComponent } from './room-booking.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableModule } from 'src/app/shared/data-table/data-table.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { RoomBookingDetailsComponent } from './room-booking-details/room-booking-details.component';
import { RoomBookingFormComponent } from './room-booking-form/room-booking-form.component';
import { RoomBookinClosedComponent } from './room-booking-closed/room-booking-closed.component';


export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/booking-history/pending'
  },
  {
    path: 'pending',
    pathMatch: 'full',
    component: RoomBookingComponent,
    data: { title: "Booking History", tab: 0 }
  },
  {
    path: 'confirmed',
    pathMatch: 'full',
    component: RoomBookingComponent,
    data: { title: "Booking History", tab: 1 }
  },
  {
    path: 'checked-in',
    pathMatch: 'full',
    component: RoomBookingComponent,
    data: { title: "Booking History", tab: 2 }
  },
  {
    path: 'closed-booking',
    pathMatch: 'full',
    redirectTo: '/booking-history/closed-booking/checked-out'
  },
  {
    path: 'closed-booking/checked-out',
    pathMatch: 'full',
    component: RoomBookinClosedComponent,
    data: { title: "Closed Request", tab: 0 }
  },
  {
    path: 'closed-booking/cancelled',
    pathMatch: 'full',
    component: RoomBookinClosedComponent,
    data: { title: "Closed Booking", tab: 1 }
  },
  {
    path: 'closed-booking/no-show',
    pathMatch: 'full',
    component: RoomBookinClosedComponent,
    data: { title: "Closed Booking", tab: 2 }
  },
  {
    path: ':roomBookingCode/details',
    component: RoomBookingDetailsComponent,
    data: { title: "Booking History", details: true }
  },
  {
    path: ':roomBookingCode/edit',
    component: RoomBookingDetailsComponent,
    data: { title: "Booking History", details: true, edit: true }
  },
  {
    path: 'closed-booking/:roomBookingCode/details',
    component: RoomBookingDetailsComponent,
    data: { title: "Closed Booking History", details: true }
  },
]

@NgModule({
  declarations: [
    RoomBookingComponent,
    RoomBookingDetailsComponent,
    RoomBookingFormComponent,
    RoomBookinClosedComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    DataTableModule
  ]
})
export class RoomBookingModule { }
