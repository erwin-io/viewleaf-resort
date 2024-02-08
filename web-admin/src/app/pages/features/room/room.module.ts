import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableModule } from 'src/app/shared/data-table/data-table.module';
import { RoomComponent } from './room.component';
import { RoomDetailsComponent } from './room-details/room-details.component';
import { RoomFormComponent } from './room-form/room-form.component';

export const routes: Routes = [
  {
    path: '',
    component: RoomComponent,
    pathMatch: 'full',
    data: { title: "Rooms" }
  },
  {
    path: 'add',
    component: RoomDetailsComponent,
    data: { title: "New Room", details: true, isNew: true}
  },
  {
    path: ':roomId',
    component: RoomDetailsComponent,
    data: { title: "Room", details: true }
  },
  {
    path: ':roomId/edit',
    component: RoomDetailsComponent,
    data: { title: "Room", details: true, edit: true }
  }
];


@NgModule({
  declarations: [
    RoomComponent,
    RoomDetailsComponent,
    RoomFormComponent
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
export class RoomsModule { }
