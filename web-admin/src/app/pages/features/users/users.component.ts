import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, startWith, map, switchMap, catchError, of as observableOf, pipe } from 'rxjs';
import { AppConfigService } from 'src/app/services/app-config.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Access } from 'src/app/model/access.model';
import { convertNotationToObject } from 'src/app/shared/utility/utility';
import { UsersTableColumn } from 'src/app/shared/utility/table';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  host: {
    class: "page-component"
  }
})
export class UsersComponent implements OnInit {
  currentAdminCode:string;
  error:string;
  dataSource = new MatTableDataSource<UsersTableColumn>();
  displayedColumns = [];
  isLoading = false;
  isProcessing = false;
  pageIndex = 0;
  pageSize = 10;
  total = 0;
  order: any = { userId: "DESC" };

  filter: {
    apiNotation: string;
    filter?: any;
    name?: string;
    type?: string;
  }[] = [];

  // pageAccess: Access = {
  //   view: true,
  //   modify: false,
  // };
  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public appConfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    public router: Router) {
      this.dataSource = new MatTableDataSource([]);
      if(this.route.snapshot.data) {
        // this.pageAccess = {
        //   ...this.pageAccess,
        //   ...this.route.snapshot.data["access"]
        // };
      }
    }

  ngOnInit(): void {
    const profile = this.storageService.getLoginProfile();
    this.currentAdminCode = profile && profile["adminCode"];
  }

  ngAfterViewInit() {
    this.getUsersPaginated();

  }

  filterChange(event: {
    apiNotation: string;
    filter: string;
    name: string;
    type: string;
  }[]) {
    this.filter = event;
    this.getUsersPaginated();
  }

  async pageChange(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    await this.getUsersPaginated();
  }

  async sortChange(event: { active: string, direction: string }) {
    const { active, direction } = event;
    const { apiNotation } = this.appConfig.config.tableColumns.users.find(x=>x.name === active);
    this.order = convertNotationToObject(apiNotation, direction.toUpperCase());
    this.getUsersPaginated()
  }

  getUsersPaginated(){
    try{
      const findIndex = this.filter.findIndex(x=>x.apiNotation === "confirmationComplete");
      if(findIndex >= 0) {
        this.filter[findIndex] = {
          "apiNotation": "confirmationComplete",
          "filter": "yes",
          type: "option-yes-no"
        };
      } else {
        this.filter.push({
          "apiNotation": "confirmationComplete",
          "filter": "yes",
          type: "option-yes-no"
        });
      }
      this.isLoading = true;
      this.userService.getUsersByAdvanceSearch({
        order: this.order,
        columnDef: this.filter,
        pageIndex: this.pageIndex, pageSize: this.pageSize
      })
      .subscribe(async res => {
        if(res.success){
          let data = res.data.results.map((d)=>{
            return {
              userCode: d.userCode,
              userName: d.userName,
              fullName: d.fullName,
              mobileNumber: d.mobileNumber,
              enable: d.accessGranted,
              access: d.access?.name,
              userType: d.userType,
              userProfilePic: d.userProfilePic?.file?.url,
              url: `/users/${d.userCode}`,
            } as UsersTableColumn
          });
          this.total = res.data.total;
          this.dataSource = new MatTableDataSource(data);
          this.isLoading = false;
        }
        else{
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
          this.isLoading = false;
        }
      }, async (err) => {
        this.error = Array.isArray(err.message) ? err.message[0] : err.message;
        this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
        this.isLoading = false;
      });
    }
    catch(e){
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
    }

  }
}
