import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '@app/services/shared.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-cropper-popup',
  templateUrl: './image-cropper-popup.component.html',
  styleUrls: ['./image-cropper-popup.component.scss'],
})
export class ImageCropperPopupComponent implements OnInit {
  popupData: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ImageCropperPopupComponent>,
    public sharedService: SharedService
  ) {
    this.popupData = this.data;
    this.imageChangedEvent = this.popupData.imageEvent;
  }
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded(image: HTMLImageElement) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
  submit() {
    this.popupData.submit(this.imageChangedEvent);
    this.dialogRef.close();
  }
  ngOnInit(): void {}
}
