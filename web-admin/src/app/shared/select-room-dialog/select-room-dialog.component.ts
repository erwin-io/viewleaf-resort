import { filter } from 'rxjs';
import { Component, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { RoomService } from 'src/app/services/room.service';
import { RoomTableColumn } from '../utility/table';

export class SelectRoomDialogTableColumn extends RoomTableColumn {
  selected?: boolean;
}

@Component({
  selector: 'app-select-room-dialog',
  templateUrl: './select-room-dialog.component.html',
  styleUrls: ['./select-room-dialog.component.scss']
})
export class  SelectRoomDialogComponent {
  displayedColumns = ["selected", "roomNumber", "adultCapacity", "childrenCapacity", "roomRate", "roomType"  ]
  dataSource = new MatTableDataSource<SelectRoomDialogTableColumn>();
  selected: SelectRoomDialogTableColumn;
  doneSelect = new EventEmitter();
  total = 0;
  pageIndex = 0;
  pageSize = 10
  order = { name: "ASC" } as any;
  filterNumber = "";
  filterAdultCapacity= "";
  filterChildrenCapacity = "";
  filterRoomRate = "";
  filterRoomType = "";
  @ViewChild('paginator', {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  childrenCapacity: any;

  constructor(
    private roomService: RoomService,
    private spinner: SpinnerVisibilityService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SelectRoomDialogComponent>
    ) {
  }

  ngAfterViewInit(): void {
    this.init();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.paginator.page.subscribe((event: PageEvent)=> {
      const { pageIndex, pageSize } = event;
      this.pageIndex = pageIndex;
      this.pageSize = pageSize;
      this.init();
    });
    this.dataSource.sort.sortChange.subscribe((event: MatSort)=> {
      const { active, direction } = event;
      if(active === "adultCapacity") {
        this.order = { adultCapacity: direction.toUpperCase()}
      }
      else if(active === "childrenCapacity") {
        this.order = { childrenCapacity: direction.toUpperCase()}
      }
      else if(active === "roomRate") {
        this.order = { roomRate: direction.toUpperCase()}
      }
      else if(active === "roomType") {
        this.order = { roomType:  { name: direction.toUpperCase()} }
      } else {
        this.order = { roomNumber: direction.toUpperCase()}
      }
      this.init();
    });
  }

  init() {
    const filter: any[] = [
      {
        apiNotation: "roomNumber",
        filter: this.filterNumber,
      },
      {
        apiNotation: "adultCapacity",
        filter: this.filterAdultCapacity,
      },
      {
        apiNotation: "childrenCapacity",
        filter: this.childrenCapacity,
      },
      {
        apiNotation: "roomRate",
        filter: this.filterRoomRate,
      },
      {
        apiNotation: "status",
        filter: "AVAILABLE",
      },
      {
        apiNotation: "roomType.name",
        filter: this.filterRoomType,
      },
    ];
    try {
      this.roomService.getByAdvanceSearch({
        order: this.order,
        columnDef: filter,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }).subscribe(res=> {
        this.dataSource = new MatTableDataSource(res.data.results.map(x=> {
          return {
            roomId: x.roomId,
            roomNumber: x.roomNumber,
            adultCapacity:  x.adultCapacity,
            childrenCapacity:  x.childrenCapacity,
            roomRate: x.roomRate,
            roomType:  x.roomType.name,
            status:  x.status,
            selected: this.selected?.roomNumber === x.roomNumber
          }
        }));
        this.total = res.data.total;
      });
    }catch(ex) {

    }
  }

  isSelected(item: SelectRoomDialogTableColumn) {
    return this.dataSource.data.find(x=>x.roomNumber === item.roomNumber && x.selected) ? true : false;
  }

  selectionChange(currentItem: SelectRoomDialogTableColumn, selected) {
    const items = this.dataSource.data;
    if(selected) {
      for(var item of items) {
        item.selected = currentItem.roomNumber === item.roomNumber;
      }
    }
    else {
      const items = this.dataSource.data;
      for(var item of items) {
        item.selected = false;
      }
    }
    this.dataSource = new MatTableDataSource<SelectRoomDialogTableColumn>(items);
    this.selected = this.dataSource.data.find(x=>x.selected);
  }

  async doneSelection() {
    try {
      this.spinner.show();
      const res = await this.roomService.getByCode(this.selected.roomNumber).toPromise();
      this.spinner.hide();
      if(res.success) {
        this.dialogRef.close(res.data);
      } else {
        const error = Array.isArray(res.message) ? res.message[0] : res.message;
        this.snackBar.open(error, 'close', {panelClass: ['style-error']});
      }
    } catch(ex) {
      const error = Array.isArray(ex.message) ? ex.message[0] : ex.message;
      this.snackBar.open(error, 'close', {panelClass: ['style-error']});
      this.spinner.hide();
    }
  }
}
