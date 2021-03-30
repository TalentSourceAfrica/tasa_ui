import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { I18nModule } from '@app/i18n';
import { MaterialModule } from '@app/modules/material.module';
import { RouterModule } from '@angular/router';
import { CreateGigRoutingModule } from './create-gig-routing.module';
import { NgxEditorModule } from 'ngx-editor';
import { CreateGigComponent } from './create-gig.component';
import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [CreateGigComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    I18nModule,
    RouterModule,
    MaterialModule,
    CreateGigRoutingModule,
    NgxEditorModule,
    CarouselModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class CreateGigModule {}
