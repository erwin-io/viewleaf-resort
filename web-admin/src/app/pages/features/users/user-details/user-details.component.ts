import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, Subscription, debounceTime, distinctUntilChanged, forkJoin, of, map } from 'rxjs';
import { Access } from 'src/app/model/access.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { Users } from 'src/app/model/users';
import { AccessService } from 'src/app/services/access.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { MyErrorStateMatcher } from 'src/app/shared/form-validation/error-state.matcher';
import { AccessPagesTableComponent } from '../../../../shared/access-pages-table/access-pages-table.component';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ImageViewerDialogComponent } from 'src/app/shared/image-viewer-dialog/image-viewer-dialog.component';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
  host: {
    class: 'page-component',
  },
})
export class UserDetailsComponent implements OnInit {
  currentUserCode;
  userCode;
  isNew = false;
  // pageAccess: Access = {
  //   view: true,
  //   modify: false,
  // };

  isReadOnly = true;

  error;
  isLoading = true;

  userForm: FormGroup;
  mediaWatcher: Subscription;
  matcher = new MyErrorStateMatcher();
  isProcessing = false;
  isLoadingRoles = false;
  maxDate = moment(new Date().getFullYear() - 18).format('YYYY-MM-DD');

  displayedColumns = ['page', 'view', 'modify', 'rights'];
  accessDataSource = new MatTableDataSource<Access>();

  accessSearchCtrl = new FormControl()
  isOptionsAccessLoading = false;
  optionsAccess: { name: string; code: string}[] = [];
  @ViewChild('accessPagesTable', { static: true}) accessPagesTable: AccessPagesTableComponent;
  @ViewChild('accessSearchInput', { static: true}) accessSearchInput: ElementRef<HTMLInputElement>;

  user: Users;
  userProfilePicSource: any;
  userProfilePic;
  userProfilePicLoaded = false;

  constructor(
    private userService: UserService,
    private accessService: AccessService,
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
    const { isNew, edit } = this.route.snapshot.data;
    this.isNew = isNew ? isNew : false;
    this.userCode = this.route.snapshot.paramMap.get('userCode');
    const profile = this.storageService.getLoginProfile();
    this.currentUserCode = profile["userCode"];
    this.isReadOnly = !edit && !isNew;
    if(!isNew && edit && edit !== undefined && this.currentUserCode ===this.userCode) {
      this.router.navigate(['/users/' + this.userCode]);
    }
    if (this.route.snapshot.data) {
      // this.pageAccess = {
      //   ...this.pageAccess,
      //   ...this.route.snapshot.data['access'],
      // };
    }
    this.accessDataSource = new MatTableDataSource([] as Access[]);
  }

  get pageRights() {
    let rights = {};
    // for(var right of this.pageAccess.rights) {
    //   rights[right] = this.pageAccess.modify;
    // }
    return rights;
  }

  get f() {
    return this.userForm.controls;
  }
  get formIsValid() {
    return this.userForm.valid && this.accessSearchCtrl.valid;
  }
  get formIsReady() {
    return (this.userForm.valid && this.userForm.dirty) ||
    (this.accessSearchCtrl.valid && this.accessSearchCtrl.dirty);
  }
  get formData() {
    return this.userForm.value;
  }

  get showAccess() {
    return this.isNew ? this.formData?.userType !== "GUEST" : this.user?.userType !== "GUEST";
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.initDetails();
  }

  async initDetails() {
    try {
      if (this.isNew) {
        this.userForm = this.formBuilder.group(
          {
            userType: [null,[Validators.required]],
            userName: [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')]],
            fullName: [
              '',
              [Validators.required, Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')],
            ],
            gender: ['',[Validators.required]],
            birthDate: ['',[Validators.required]],
            mobileNumber: [
              '',
              [
                Validators.minLength(11),
                Validators.maxLength(11),
                Validators.pattern('^[0-9]*$'),
                Validators.required,
              ],
            ],
            email: ['',[Validators.email, Validators.required]],
            address: ['',[Validators.required]],
            password: [
              '',
              [
                Validators.minLength(6),
                Validators.maxLength(16),
                Validators.required,
              ],
            ],
            confirmPassword: '',
            accessCode: [''],
          },
          { validators: this.checkPasswords }
        );
        this.f['userName'].valueChanges.subscribe(value=> {
          if(/\s/.test(value)) {
            this.f['userName'].setErrors({ whitespace: true})
          }
        })
        this.isLoading = false;
      } else {
        this.userForm = this.formBuilder.group({
          userType: [null],
          userName: [null],
          fullName: [
            '',
            [Validators.required, Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')],
          ],
          gender: ['',[Validators.required]],
          birthDate: ['',[Validators.required]],
          mobileNumber: [
            '',
            [
              Validators.minLength(11),
              Validators.maxLength(11),
              Validators.pattern('^[0-9]*$'),
              Validators.required,
            ],
          ],
          email: ['',[Validators.email, Validators.required]],
          address: ['',[Validators.required]],
          accessCode: [],
        });


        forkJoin([
          this.userService.getByCode(this.userCode).toPromise(),
          this.accessService.getByAdvanceSearch({
          order: {},
          columnDef: [],
          pageIndex: 0,
          pageSize: 10
        })
        ]).subscribe(([user, accessOptions])=> {
          if(accessOptions.success) {
            this.optionsAccess = accessOptions.data.results.map(x=> {
              return { name: x.name, code: x.accessCode }
            });
          }
          if (user.success) {
            this.user = user.data;
            this.userForm.patchValue({
              userType: user.data.userType,
              userName: user.data.userName,
              fullName: user.data.fullName,
              gender: user.data.gender && ["MALE", "FEMALE"].includes(user.data.gender) ? user.data.gender : "OTHERS",
              birthDate: user.data.birthDate,
              mobileNumber: user.data.mobileNumber,
              email: user.data.email,
              address: user.data.address,
              accessCode: user.data.access?.accessCode,
            });
            this.userForm.updateValueAndValidity();
            if(user.data.access?.accessPages) {
              this.accessPagesTable.setDataSource(user.data.access?.accessPages);
            }
            if(this.user.userType === "GUEST") {
              this.userForm.controls["userType"].markAsPristine();
              this.userForm.controls["userType"].clearAsyncValidators();
              this.userForm.controls["userType"].updateValueAndValidity();
              this.accessSearchCtrl.clearAsyncValidators();
              this.accessSearchCtrl.setValue(null);
              this.accessSearchCtrl.markAsPristine();
              this.accessSearchCtrl.updateValueAndValidity();
              this.userForm.controls["accessCode"].clearAsyncValidators();
              this.userForm.controls["accessCode"].setValue(null);
              this.userForm.controls["accessCode"].markAsPristine();
              this.userForm.controls["accessCode"].updateValueAndValidity();
            }
            this.f['userType'].disable();
            this.f['userName'].disable();
            if (this.isReadOnly) {
              this.userForm.disable();
              this.accessSearchCtrl.disable();
            }
            this.accessSearchCtrl.setValue(user.data.access?.accessCode);
            if(this.user.userProfilePic?.file?.url) {
              this.userProfilePicSource = this.user.userProfilePic?.file?.url;
            }
            this.isLoading = false;
          } else {
            this.isLoading = false;
            this.error = Array.isArray(user.message) ? user.message[0] : user.message;
            this.snackBar.open(this.error, 'close', {
              panelClass: ['style-error'],
            });
          }
        });
      }
      this.f['accessCode'].valueChanges.subscribe(async res=> {
        if(!this.isReadOnly && this.userForm.controls["userType"].value !== "GUEST") {
          this.spinner.show();
          const access = await this.accessService.getByCode(res).toPromise();
          if(access.data && access.data.accessPages) {
            this.accessPagesTable.setDataSource(access.data.accessPages)
          }
          this.spinner.hide();
        }
      })
      if(this.isNew) {
        this.userForm.controls["userType"].valueChanges
        .subscribe(async value => {
          if(value === "GUEST") {
            this.f['accessCode'].clearValidators();
            this.accessSearchCtrl.clearValidators();
            this.accessSearchCtrl.disable();
            this.f['accessCode'].disable();
          } else {
            this.accessSearchCtrl.enable();
            this.f['accessCode'].enable();
            this.f['accessCode'].setValidators([Validators.required]);
            this.accessSearchCtrl.setValidators([Validators.required]);
          }
          this.accessSearchCtrl.setValue(null);
          this.accessSearchCtrl.updateValueAndValidity();
        });
      }
      this.accessSearchCtrl.valueChanges
      .pipe(
          debounceTime(2000),
          distinctUntilChanged()
      )
      .subscribe(async value => {
          await this.initAccessOptions();
      });
      await this.initAccessOptions();
    } catch(ex) {
      this.isLoading = false;
      this.error = Array.isArray(ex.message) ? ex.message[0] : ex.message;
      this.snackBar.open(this.error, 'close', {
        panelClass: ['style-error'],
      });
    }
  }

  onShowImageViewer() {
    const dialogRef = this.dialog.open(ImageViewerDialogComponent, {
        disableClose: true,
        panelClass: "image-viewer-dialog"
    });
    const img: HTMLImageElement = document.querySelector(".profile-pic img");
    dialogRef.componentInstance.imageSource = img?.src;
    dialogRef.componentInstance.canChange = false;

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

  async initAccessOptions() {
    this.isOptionsAccessLoading = true;
    const res = await this.accessService.getByAdvanceSearch({
      order: {},
      columnDef: [{
        apiNotation: "name",
        filter: this.accessSearchInput.nativeElement.value
      }],
      pageIndex: 0,
      pageSize: 10
    }).toPromise();
    this.optionsAccess = res.data.results.map(a=> { return { name: a.name, code: a.accessCode }});
    this.mapSearchAccess();
    this.isOptionsAccessLoading = false;
  }

  displayAccessName(value?: number) {
    return value ? this.optionsAccess.find(_ => _.code === value?.toString())?.name : undefined;
  }

  mapSearchAccess() {
    if(this.f["userType"].value !== "GUEST") {
      if(this.f['accessCode'].value !== this.accessSearchCtrl.value) {
        this.f['accessCode'].setErrors({ required: true});
        const selected = this.optionsAccess.find(x=>x.code === this.accessSearchCtrl.value);
        if(selected) {
          this.f["accessCode"].setValue(selected.code);
        } else {
          this.f["accessCode"].setValue(null);
        }
        if(!this.f["accessCode"].value) {
          this.f["accessCode"].setErrors({required: true});
        } else {
          this.f['accessCode'].setErrors(null);
          this.f['accessCode'].markAsPristine();
        }
      }
      this.accessSearchCtrl.setErrors(this.f["accessCode"].errors);
    } else {
      this.userForm.controls["accessCode"].clearValidators();
      this.userForm.controls["accessCode"].setErrors(null);
      this.userForm.controls["accessCode"].markAsPristine();
      this.userForm.controls["accessCode"].updateValueAndValidity();
      this.accessSearchCtrl.clearValidators();
      this.accessSearchCtrl.setErrors(null);
      this.accessSearchCtrl.markAsPristine();
      this.accessSearchCtrl.updateValueAndValidity();
    }
  }

  getError(key: string) {
    if (key === 'confirmPassword') {
      this.formData.confirmPassword !== this.formData.password
        ? this.f[key].setErrors({ notMatched: true })
        : this.f[key].setErrors(null);
    }
    return this.f[key].errors;
  }

  checkPasswords: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmPassword').value;
    return pass === confirmPass ? null : { notMatched: true };
  };

  onSubmit() {
    if (this.userForm.invalid || this.accessSearchCtrl.invalid) {
      return;
    }

    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Save user?';
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
        let res;
        if(this.isNew) {
          if(this.formData.userType !== "GUEST") {
            res = await this.userService.createUsers(params).toPromise();
          } else {
            res = await this.userService.createGuestUsers(params).toPromise();
          }
        } else {
          if(this.formData.userType !== "GUEST") {
            res = await this.userService.updateUsers(this.userCode, params).toPromise();
          } else {
            res = await this.userService.updateProfile(this.userCode, params).toPromise();
          }
        }

        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.router.navigate(['/users/' + res.data.userCode]);
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          dialogRef.close();
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

  openChangePasswordDialog() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      maxWidth: '720px',
      width: '720px',
      disableClose: true,
    });
    dialogRef.componentInstance.userCode = this.userCode;
  }

  profilePicErrorHandler(event) {
    event.target.src = this.getDeafaultProfilePicture();
  }

  getDeafaultProfilePicture() {
    if(this.user && this.user.gender?.toUpperCase() === "FEMALE") {
      return '../../../../../assets/img/person-female.png';
    } else {
      return '../../../../../assets/img/person.png';
    }
  }
}
