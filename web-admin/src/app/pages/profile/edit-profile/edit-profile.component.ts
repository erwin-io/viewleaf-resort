import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { Subscription } from 'rxjs';
import { Users } from 'src/app/model/users';
import { AppConfigService } from 'src/app/services/app-config.service';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { ImageUploadDialogComponent } from 'src/app/shared/image-upload-dialog/image-upload-dialog.component';
import { ImageViewerDialogComponent } from 'src/app/shared/image-viewer-dialog/image-viewer-dialog.component';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  host: {
    class: "page-component"
  }
})
export class EditProfileComponent {
  currentUserCode;
  isNew = false;

  isReadOnly = true;

  error;
  isLoading = true;

  profileForm: FormGroup;
  mediaWatcher: Subscription;
  isProcessing = false;
  isLoadingRoles = false;
  maxDate = moment(new Date().getFullYear() - 18).format('YYYY-MM-DD');

  user: Users;
  userProfilePicSource: any;
  userProfilePic;
  userProfilePicLoaded = false;
  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private appconfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private spinner: SpinnerVisibilityService
  ) {
    this.user = this.storageService.getLoginProfile();
    if(!this.user || !this.user.userCode || !this.user.userId) {
      this.router.navigate(['/auth/']);
    }
    if(this.user.userProfilePic?.file?.url) {
      this.userProfilePicSource = this.user.userProfilePic?.file?.url;
    }
    this.currentUserCode = this.user.userCode;
  }

  get f() {
    return this.profileForm.controls;
  }
  get formIsValid() {
    return this.profileForm.valid;
  }
  get formIsReady() {
    return this.profileForm.valid && this.profileForm.dirty;
  }
  get formData() {
    return {
      ...this.profileForm.value,
      userProfilePic: this.userProfilePic,
    }
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.profileForm = this.formBuilder.group(
      {
        fullName: [
          this.user.fullName,
          [Validators.required, Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')],
        ],
        gender: [this.user?.gender ,[Validators.required]],
        birthDate: [new Date(this.user.birthDate),[Validators.required]],
        mobileNumber: [
          this.user.mobileNumber,
          [
            Validators.minLength(11),
            Validators.maxLength(11),
            Validators.pattern('^[0-9]*$'),
            Validators.required,
          ],
        ],
        email: ['',[Validators.email, Validators.required]],
        address: [this.user.address,[Validators.required]],
      }
    );
    this.profileForm.markAllAsTouched();
  }

  getError(key: string) {
    return this.f[key].errors;
  }

  onShowImageViewer() {
    const dialogRef = this.dialog.open(ImageViewerDialogComponent, {
        disableClose: true,
        panelClass: "image-viewer-dialog"
    });
    dialogRef.componentInstance.imageSource = this.userProfilePicSource;
    dialogRef.componentInstance.canChange = true;

    dialogRef.componentInstance.changed.subscribe(res=> {
      this.userProfilePicLoaded = false;
      this.userProfilePicSource = res.base64;
      dialogRef.close();

      this.userProfilePic = {
        fileName: `${moment().format("YYYY-MM-DD-hh-mm-ss")}.png`,
        data: res.base64.toString().split(',')[1]
      };
    })
  }

  onChangeProfile() {
    const dialogRef = this.dialog.open(ImageUploadDialogComponent, {
        disableClose: true,
        panelClass: "image-upload-dialog"
    });
    dialogRef.componentInstance.showCropper = false;
    dialogRef.componentInstance.showWebCam = false;
    dialogRef.componentInstance.doneSelect.subscribe(res=> {
      this.userProfilePicLoaded = false;
      this.userProfilePicSource = res.base64;
      dialogRef.close();

      this.userProfilePic = {
        fileName: `${moment().format("YYYY-MM-DD-hh-mm-ss")}.png`,
        data: res.base64.toString().split(',')[1]
      };
    })
  }


  onSubmitUpdateProfile() {
    if (!this.profileForm.valid) {
      return;
    }

    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Update profile?';
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
        this.isProcessing = true;
        const params = this.formData;
        const res = await this.userService.updateProfile(this.currentUserCode, params).toPromise();
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          dialogRef.close();
          this.profileForm.markAsPristine();
          this.user.fullName = this.formData.fullName;
          this.user.gender = this.formData.gender;
          this.user.birthDate = this.formData.birthDate;
          this.user.mobileNumber = this.formData.mobileNumber;
          this.user.address = this.formData.address;
          this.user.userProfilePic = res.data.userProfilePic;
          this.storageService.saveLoginProfile(this.user);
          window.location.reload();
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

  profilePicErrorHandler(event) {
    event.target.src = this.getDeafaultProfilePicture();
  }

  getDeafaultProfilePicture() {
    if(this.user && this.user.gender?.toUpperCase() === "FEMALE") {
      return '../../../../assets/img/person-female.png';
    } else {
      return '../../../../assets/img/person.png';
    }
  }
}
