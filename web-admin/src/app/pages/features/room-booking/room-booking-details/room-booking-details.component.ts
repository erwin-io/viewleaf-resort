import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { AppConfigService } from 'src/app/services/app-config.service';
import { RoomBookingService } from 'src/app/services/room-booking.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { MyErrorStateMatcher } from 'src/app/shared/form-validation/error-state.matcher';
import { RoomBookingFormComponent } from '../room-booking-form/room-booking-form.component';
import { MatTableDataSource } from '@angular/material/table';
import { Users } from 'src/app/model/users';
import { PusherService } from 'src/app/services/pusher.service';
import { AccessPages } from 'src/app/model/access.model';
import { RoomBooking } from 'src/app/model/room-booking.model';
@Component({
  selector: 'app-room-booking-details',
  templateUrl: './room-booking-details.component.html',
  styleUrls: ['./room-booking-details.component.scss'],
  host: {
    class: "page-component"
  }
})
export class RoomBookingDetailsComponent {
  currentUserProfile:Users;
  roomBookingCode;
  isReadOnly = true;
  error;
  isLoading = true;

  mediaWatcher: Subscription;
  matcher = new MyErrorStateMatcher();
  isProcessing = false;
  isLoadingRoles = false;

  @ViewChild('roomBookingForm', { static: true}) roomBookingForm: RoomBookingFormComponent;

  canAddEdit = false;

  roomBooking: RoomBooking;

  pageAccess: AccessPages = {
    view: true,
    modify: false,
  } as any;

  constructor(
    private roomBookingService: RoomBookingService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private appconfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    private pusherService: PusherService
  ) {
    this.currentUserProfile = this.storageService.getLoginProfile();
    const { isNew, edit } = this.route.snapshot.data;
    this.roomBookingCode = this.route.snapshot.paramMap.get('roomBookingCode');
    this.isReadOnly = !edit && !isNew;
    if (this.route.snapshot.data) {
      this.pageAccess = {
        ...this.pageAccess,
        ...this.route.snapshot.data['access'],
      };
    }
  }

  get pageRights() {
    let rights = {};
    for(var right of this.pageAccess.rights) {
      rights[right] = this.pageAccess.modify;
    }
    return rights;
  }

  ngOnInit(): void {
    const channel = this.pusherService.init(this.currentUserProfile.userId);
    channel.bind('roomBookingChanges', (res: any) => {
      this.snackBar.open("Someone has updated this document.", "",{
        announcementMessage: "Someone has updated this document.",
        verticalPosition: "top"
      });
      if(this.isReadOnly) {
        this.initDetails();
      }
    });
  }

  async ngAfterViewInit() {
    // await Promise.all([
    // ])
    this.initDetails();
  }

  initDetails() {
    this.isLoading = true;
    try {
      this.roomBookingService.getByCode(this.roomBookingCode).subscribe(res=> {
        if (res.success) {
          this.roomBooking = res.data;
          this.roomBookingForm.setFormValue(this.roomBooking);
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
          this.router.navigate(['/booking-history/']);
        }
      });
    } catch(ex) {
      this.error = Array.isArray(ex.message) ? ex.message[0] : ex.message;
      this.snackBar.open(this.error, 'close', {
        panelClass: ['style-error'],
      });
      this.router.navigate(['/booking-history/']);
      this.isLoading = false;
    }
  }

  updateStatus(status: "CONFIRMED"
  | "CHECKED-IN"
  | "CHECKED-OUT"
  | "CANCELLED"
  | "NO-SHOW") {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    if(status === "CONFIRMED") {
      dialogData.message = 'Are you sure you want to confirm reservation?';
    } else if(status === "CHECKED-IN") {
      dialogData.message = 'Are you sure you want to change the status to check in?';
    } else if(status === "CHECKED-OUT") {
      dialogData.message = 'Are you sure you want to change the status to check out?';
    } else if(status === "CANCELLED") {
      dialogData.message = 'Are you sure you want to cancel room booking?';
    } else {
      //no show
      dialogData.message = 'Are you sure you want to mark booking as no show?';
    }
    dialogData.confirmButton = {
      visible: true,
      text: 'yes',
      color: 'primary',
    };
    dialogData.dismissButton = {
      visible: true,
      text: 'cancel',
    };
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      maxWidth: '400px',
      closeOnNavigation: true,
    });
    dialogRef.componentInstance.alertDialogConfig = dialogData;


    dialogRef.componentInstance.conFirm.subscribe(async (data: any) => {

      this.isProcessing = true;
      dialogRef.componentInstance.isProcessing = this.isProcessing;
      try {
        let res = await this.roomBookingService.updateStatus(this.roomBookingCode, { status }).toPromise();
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.router.navigate(['/booking-history/' + this.roomBookingCode + '/details']);
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          await this.ngAfterViewInit();
          dialogRef.close();
          this.dialog.closeAll();
        } else {
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          this.error = Array.isArray(res.message)
            ? res.message[0]
            : res.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
          dialogRef.close();
        }
      } catch (e) {
        this.isProcessing = false;
        dialogRef.componentInstance.isProcessing = this.isProcessing;
        this.error = Array.isArray(e.message) ? e.message[0] : e.message;
        this.snackBar.open(this.error, 'close', {
          panelClass: ['style-error'],
        });
        dialogRef.close();
      }
    });
  }
}
