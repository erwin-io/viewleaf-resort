import { Component, TemplateRef, ViewChild } from '@angular/core';
import { RoomBookingService } from 'src/app/services/room-booking.service';
import { RoomBookingTableColumn } from 'src/app/shared/utility/table';
import { convertNotationToObject } from 'src/app/shared/utility/utility';
import { RoomBookingDetailsComponent } from './room-booking-details/room-booking-details.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from 'src/app/services/app-config.service';
import { StorageService } from 'src/app/services/storage.service';
import { Title } from '@angular/platform-browser';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { Users } from 'src/app/model/users';
import { PusherService } from 'src/app/services/pusher.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-room-booking',
  templateUrl: './room-booking.component.html',
  styleUrls: ['./room-booking.component.scss'],
  host: {
    class: "page-component"
  }
})
export class RoomBookingComponent  {
  tabIndex = 0;
  currentUserProfile: Users;
  error:string;
  dataSource = {
    pending: new MatTableDataSource<any>([]),
    confirmed: new MatTableDataSource<any>([]),
    "checked-in": new MatTableDataSource<any>([])
  }
  displayedColumns = [];
  isLoading = false;
  isProcessing = false;
  pageIndex = {
    pending: 0,
    confirmed: 0,
    "checked-in": 0
  };
  pageSize = {
    pending: 10,
    confirmed: 10,
    "checked-in": 10
  };
  total = {
    pending: 0,
    confirmed: 0,
    "checked-in": 0
  };
  order = {
    pending: { roomBookingId: "ASC" },
    confirmed: { roomBookingId: "DESC" },
    "checked-in": { roomBookingId: "DESC" },
  };

  filter = {
    pending: [] as {
      apiNotation: string;
      filter: string;
      name: string;
      type: string;
    }[],
    confirmed: [] as {
      apiNotation: string;
      filter: string;
      name: string;
      type: string;
    }[],
    "checked-in": [] as {
      apiNotation: string;
      filter: string;
      name: string;
      type: string;
    }[]
  };
  // pageRoomBooking: RoomBooking = {
  //   view: true,
  //   modify: false,
  // };

  @ViewChild('roomBookingFormDialog') roomBookingFormDialogTemp: TemplateRef<any>;
  constructor(
    private spinner: SpinnerVisibilityService,
    private roomBookingService: RoomBookingService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public appConfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private titleService: Title,
    private _location: Location,
    public router: Router,
    private pusherService: PusherService) {
      this.currentUserProfile = this.storageService.getLoginProfile();
      this.tabIndex = this.route.snapshot.data["tab"];
      if(this.route.snapshot.data) {
        // this.pageRoomBooking = {
        //   ...this.pageRoomBooking,
        //   ...this.route.snapshot.data["roomBooking"]
        // };
      }
      this.onSelectedTabChange({index: this.tabIndex}, false);
    }

  ngOnInit(): void {
    const channel = this.pusherService.init("all");
    channel.bind("reSync", (res: any) => {
      const { type, data } = res;
      if(type && type === "ROOMBOOKING") {
        this.getRoomBookingPaginated("pending", false);
        this.getRoomBookingPaginated("confirmed", false);
        this.getRoomBookingPaginated("checked-in", false);
      }
    });
  }

  ngAfterViewInit() {
    this.getRoomBookingPaginated("pending", false);
    this.getRoomBookingPaginated("confirmed", false);
    this.getRoomBookingPaginated("checked-in", false);

  }

  filterChange(event: {
    apiNotation: string;
    filter: string;
    name: string;
    type: string;
  }[], table: string) {
    this.filter[table] = event;
    this.getRoomBookingPaginated(table as any);
  }

  async pageChange(event: { pageIndex: number, pageSize: number }, table: string) {
    this.pageIndex[table] = event.pageIndex;
    this.pageSize[table] = event.pageSize;
    await this.getRoomBookingPaginated(table as any);
  }

  async sortChange(event: { active: string, direction: string }, table: string) {
    const { active, direction } = event;
    const { apiNotation } = this.appConfig.config.tableColumns.roomBooking.find(x=>x.name === active);
    this.order[table] = convertNotationToObject(apiNotation, direction === "" ? "ASC" : direction.toUpperCase());
    this.getRoomBookingPaginated(table as any)
  }

  async getRoomBookingPaginated(table: "pending" | "confirmed" | "checked-in", showProgress = true){
    try{
      const findIndex = this.filter[table].findIndex(x=>x.apiNotation === "status");
      if(findIndex >= 0) {
        this.filter[table][findIndex] = {
          "apiNotation": "status",
          "filter": table.toUpperCase(),
          "name": "status",
          "type": "text"
        };
      } else {
        this.filter[table].push({
          "apiNotation": "status",
          "filter": table.toUpperCase(),
          "name": "status",
          "type": "text"
        });
      }

      this.isLoading = true;
      if(showProgress === true) {
        this.spinner.show();
      }
      await this.roomBookingService.getByAdvanceSearch({
        order: this.order[table],
        columnDef: this.filter[table],
        pageIndex: this.pageIndex[table],
        pageSize: this.pageSize[table]
      })
      .subscribe(async res => {
        if(res.success){
          let data = res.data.results.map((d)=>{
            return {
              roomBookingCode: d.roomBookingCode,
              dateCreated: d.dateCreated.toString(),
              checkInDate: d.checkInDate.toString(),
              checkOutDate: d.checkOutDate.toString(),
              otherCharges: d.otherCharges,
              totalAmount: d.totalAmount,
              room: d.room.roomNumber,
              guest: d.guest,
              bookedByUser: d.bookedByUser.fullName,
              status: d.status,
              url: `/booking-history/${d.roomBookingCode}/details`,
            } as RoomBookingTableColumn
          });
          this.total[table] = res.data.total;
          this.dataSource[table] = new MatTableDataSource(data);
          this.isLoading = false;
          this.spinner.hide();
        }
        else{
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
          this.isLoading = false;
          this.spinner.hide();
        }
      }, async (err) => {
        this.error = Array.isArray(err.message) ? err.message[0] : err.message;
        this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
        this.isLoading = false;
        this.spinner.hide();
      });
    }
    catch(e){
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
      this.isLoading = false;
      this.spinner.hide();
    }

  }

  showAddDialog() {
    this.dialog.open(this.roomBookingFormDialogTemp)
  }

  onSelectedTabChange({ index }, redirect = true) {
    if(index === 1) {
      if(redirect) {
        this._location.go("/booking-history/confirmed");
      }
      this.titleService.setTitle(`Confirmed | ${this.appConfig.config.appName}`);
    } else if(index === 2) {
      if(redirect) {
        this._location.go("/booking-history/checked-in");
      }
      this.titleService.setTitle(`Checked in | ${this.appConfig.config.appName}`);
    } else {
      if(redirect) {
        this._location.go("/booking-history/pending");
      }
      this.titleService.setTitle(`Pending | ${this.appConfig.config.appName}`);
    }
  }
}
