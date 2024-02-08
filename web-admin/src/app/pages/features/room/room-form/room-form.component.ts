import { RoomTypeService } from 'src/app/services/room-type.service';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Room } from 'src/app/model/room.model';
import { RoomType } from 'src/app/model/room-type.model';
import { ImageViewerDialogComponent } from 'src/app/shared/image-viewer-dialog/image-viewer-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { ImageUploadDialogComponent } from 'src/app/shared/image-upload-dialog/image-upload-dialog.component';

@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.scss']
})
export class RoomFormComponent implements OnInit, AfterViewInit {
  pictureSourceLoaded = false;
  form: FormGroup;
  @Input() isReadOnly: any;
  roomTypeSearchCtrl = new FormControl()
  isOptionsRoomTypeLoading = false;
  optionsRoomType: { name: string; id: string; image: string}[] = [];
  @ViewChild('roomTypeSearchInput', { static: true}) roomTypeSearchInput: ElementRef<HTMLInputElement>;
  room!: Room;
  roomType!: any;
  roomTypeLoaded = false;
  thumbnailFile;
  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private roomTypeService: RoomTypeService
  ) {
    this.form = this.formBuilder.group({
      roomNumber: ['',[Validators.required, Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')]],
      adultCapacity: ['',
      [
        Validators.minLength(1),
        Validators.maxLength(6),
        Validators.pattern('^[0-9]*$'),
        Validators.required,
        Validators.compose([
          Validators.required, this.notBelowOne ])
      ],],
      childrenCapacity: ['',
      [
        Validators.minLength(1),
        Validators.maxLength(6),
        Validators.pattern('^[0-9]*$'),
        Validators.required,
        Validators.compose([
          Validators.required, this.notBelowOne ])
      ],],
      roomRate: ['',
      [
        Validators.minLength(1),
        Validators.maxLength(6),
        Validators.pattern('^[0-9]*$'),
        Validators.required,
        Validators.compose([
          Validators.required, this.notBelowOne ])
      ],],
      roomTypeId: ['',Validators.required],
    });
  }
  ngAfterViewInit(): void {

  }
  notBelowOne(control: any):{ [key: string]: any; } {
    if (Number(control.value) <= 0) {
      return {notBelowOne: true};
    } else {
      return null;
    }
  }

  async ngOnInit(): Promise<void> {
    await this.initRoomTypeOptions();
    this.roomTypeSearchCtrl.valueChanges
    .pipe(
        debounceTime(2000),
        distinctUntilChanged()
    )
    .subscribe(async value => {
        //your API call
        await this.initRoomTypeOptions();
    });
  }

  async init(details: Room) {
    this.room = details;
    if(this.form && details) {
      this.form.controls["roomNumber"].setValue(details.roomNumber);
      this.form.controls["adultCapacity"].setValue(details.adultCapacity);
      this.form.controls["childrenCapacity"].setValue(details.childrenCapacity);
      this.form.controls["roomRate"].setValue(details.roomRate);
      this.form.controls["roomTypeId"].setValue(details.roomType?.roomTypeId);
      this.roomTypeSearchCtrl.setValue(details.roomType?.roomTypeId);
    };
  }

  async initRoomTypeOptions() {
    this.isOptionsRoomTypeLoading = true;
    const res = await this.roomTypeService.getByAdvanceSearch({
      order: {},
      columnDef: [{
        apiNotation: "name",
        filter: this.roomTypeSearchInput.nativeElement.value
      }],
      pageIndex: 0,
      pageSize: 10
    }).toPromise();
    this.optionsRoomType = res.data.results.map(a=> { return { name: a.name, id: a.roomTypeId, image: a.thumbnailFile?.url }});
    this.mapSearchRoomType();
    this.isOptionsRoomTypeLoading = false;
  }

  mapSearchRoomType() {
    if(this.form.controls['roomTypeId'] !== this.roomTypeSearchCtrl.value){
      this.form.controls['roomTypeId'].setErrors({ required: true});
      const selected = this.optionsRoomType.find(x=>x.id === this.roomTypeSearchCtrl.value);
      if(selected) {
        this.form.controls["roomTypeId"].setValue(selected.id);
        this.form.controls['roomTypeId'].markAsDirty();
        this.form.controls['roomTypeId'].markAsTouched();
      } else {
        this.form.controls["roomTypeId"].setValue(null);
      }
      if(!this.form.controls["roomTypeId"].value) {
        this.form.controls["roomTypeId"].setErrors({required: true});
      } else {
        this.form.controls['roomTypeId'].setErrors(null);
        this.form.controls['roomTypeId'].markAsPristine();
      }
    }
    this.roomTypeSearchCtrl.setErrors(this.form.controls["roomTypeId"].errors);
    if(this.form.controls["roomTypeId"].value && this.form.controls["roomTypeId"].value !== "") {
      this.roomType = this.optionsRoomType.find(x=>x.id === this.form.controls["roomTypeId"].value);
    }
  }

  public get getFormData() {
    return {
      ...this.form.value,
      thumbnailFile: this.thumbnailFile,
    };
  }

  public get valid() {
    return this.form.valid && this.roomTypeSearchCtrl.valid;
  }

  public get ready() {
    return (this.form.valid && this.form.dirty) || (this.roomTypeSearchCtrl.valid && this.roomTypeSearchCtrl.dirty);
  }

  getError(key: string) {
    if(key === "roomCode") {
      if(/\s/.test(this.form.controls[key].value)) {
        this.form.controls[key].setErrors({ whitespace: true})
      }
    }
    return this.form.controls && this.form.controls[key] ? this.form.controls[key].errors : null;
  }

  displayFn(value?: number) {
    return value ? this.optionsRoomType.find(_ => _.id === value?.toString())?.name : undefined;
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
      this.room.thumbnailFile = {
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
