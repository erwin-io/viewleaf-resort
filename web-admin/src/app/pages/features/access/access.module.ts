import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessComponent } from './access.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableModule } from 'src/app/shared/data-table/data-table.module';
import { AccessFormComponent } from './access-form/access-form.component';
import { AccessDetailsComponent } from './access-details/access-details.component';
import { AccessPagesTableModule } from 'src/app/shared/access-pages-table/access-pages-table.module';

export const routes: Routes = [
  {
    path: '',
    component: AccessComponent,
    pathMatch: 'full',
    data: { title: "User group" }
  },
  {
    path: 'add',
    component: AccessDetailsComponent,
    data: { title: "New User group", details: true, isNew: true}
  },
  {
    path: ':accessCode',
    component: AccessDetailsComponent,
    data: { title: "User group", details: true }
  },
  {
    path: ':accessCode/edit',
    component: AccessDetailsComponent,
    data: { title: "User group", details: true, edit: true }
  },
];


@NgModule({
  declarations: [
    AccessComponent,
    AccessDetailsComponent,
    AccessFormComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    DataTableModule,
    AccessPagesTableModule
  ]
})
export class AccessModule { }
