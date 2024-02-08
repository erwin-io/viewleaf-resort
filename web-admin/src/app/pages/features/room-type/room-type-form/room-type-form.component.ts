import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { RoomType } from 'src/app/model/room-type.model';
import { AppConfigService } from 'src/app/services/app-config.service';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { ImageUploadDialogComponent } from 'src/app/shared/image-upload-dialog/image-upload-dialog.component';
import { ImageViewerDialogComponent } from 'src/app/shared/image-viewer-dialog/image-viewer-dialog.component';

@Component({
  selector: 'app-room-type-form',
  templateUrl: './room-type-form.component.html',
  styleUrls: ['./room-type-form.component.scss']
})
export class RoomTypeFormComponent {
  pictureSourceLoaded = false;
  form: FormGroup;
  @Input() isReadOnly: any;
  roomType: RoomType;

  thumbnailFile;
  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private appconfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    public router: Router,
    private authService: AuthService,
  ) {
    this.form = this.formBuilder.group({
      name: ['',[Validators.required, Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')]]
    });
    this.roomType = {
      thumbnailFile: {}
    } as any;
  }

  public setFormValue(value: RoomType) {
    if(this.form) {
      this.form.controls["name"].setValue(value.name);
      // this.form.controls["location"].setValue(value.location);
    }
    if(value.thumbnailFile?.fileId) {
      this.roomType.thumbnailFile = value.thumbnailFile
    }
  }

  public get getFormData() {
    return {
      ...this.form.value,
      thumbnailFile: this.thumbnailFile,
    };
  }

  public get valid() {
    return this.form.valid;
  }

  public get ready() {
    return this.form.valid && this.form.dirty;
  }

  getError(key: string) {
    return this.form.controls && this.form.controls[key] ? this.form.controls[key].errors : null;
  }

  onShowChangeThumbnail(){
    const dialogRef = this.dialog.open(ImageUploadDialogComponent, {
        disableClose: true,
        panelClass: "image-upload-dialog"
    });
    dialogRef.componentInstance.showCropper = false;
    dialogRef.componentInstance.showWebCam = false;
    dialogRef.componentInstance.doneSelect.subscribe(res=> {
      this.pictureSourceLoaded = false;
      this.roomType.thumbnailFile = {
        url: res.base64
      };
      this.form.markAsDirty();
      this.form.markAllAsTouched();
      dialogRef.close();

      this.thumbnailFile = {
        fileName: `${moment().format("YYYY-MM-DD-hh-mm-ss")}.png`,
        data: res.base64.toString().split(',')[1]
      };
    })
  }

  onShowImageViewer() {
    const dialogRef = this.dialog.open(ImageViewerDialogComponent, {
        disableClose: true,
        panelClass: "image-viewer-dialog"
    });
    const img: HTMLImageElement = document.querySelector(".thumbnail-pic img");
    dialogRef.componentInstance.imageSource = img?.src;
    dialogRef.componentInstance.canChange = this.form.enabled;

    dialogRef.componentInstance.changed.subscribe(res=> {
      this.pictureSourceLoaded = false;
      this.roomType.thumbnailFile = {
        url: res.base64
      };
      this.form.markAsDirty();
      this.form.markAllAsTouched();
      dialogRef.close();

      this.thumbnailFile = {
        fileName: `${moment().format("YYYY-MM-DD-hh-mm-ss")}.png`,
        data: res.base64.toString().split(',')[1]
      };
    })
  }

  imageErrorHandler(event) {
    event.target.src = "../../../../../assets/img/banner.png";
  }

}
