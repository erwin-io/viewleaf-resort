import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomTypeComponent } from './room-type.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableModule } from 'src/app/shared/data-table/data-table.module';
import { RoomTypeFormComponent } from './room-type-form/room-type-form.component';
import { RoomTypeDetailsComponent } from './room-type-details/room-type-details.component';

export const routes: Routes = [
  {
    path: '',
    component: RoomTypeComponent,
    pathMatch: 'full',
    data: { title: "Room Type" }
  },
  {
    path: 'add',
    component: RoomTypeDetailsComponent,
    data: { title: "Room Type", details: true, isNew: true}
  },
  {
    path: ':roomTypeCode',
    component: RoomTypeDetailsComponent,
    data: { title: "Room Type", details: true }
  },
  {
    path: ':roomTypeCode/edit',
    component: RoomTypeDetailsComponent,
    data: { title: "Room Type", details: true, edit: true }
  },
];


@NgModule({
  declarations: [
    RoomTypeComponent,
    RoomTypeDetailsComponent,
    RoomTypeFormComponent
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
export class RoomTypeModule { }
