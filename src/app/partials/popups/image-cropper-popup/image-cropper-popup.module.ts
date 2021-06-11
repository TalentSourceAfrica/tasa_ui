import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { I18nModule } from '@app/i18n';
import { MaterialModule } from '@app/modules/material.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageCropperPopupComponent } from './image-cropper-popup.component';

@NgModule({
  imports: [CommonModule, TranslateModule, FormsModule, I18nModule, MaterialModule, ImageCropperModule],
  declarations: [ImageCropperPopupComponent],
  entryComponents: [ImageCropperPopupComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ImageCropperPopupModule {}
