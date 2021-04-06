import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { I18nModule } from '@app/i18n';
import { MaterialModule } from '@app/modules/material.module';
import { RouterModule } from '@angular/router';
import { AllGigsComponent } from './all-gigs.component';
import { AllGigsRoutingModule } from './all-gigs-routing.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { LeftSideModule } from '@app/partials/left-side/left-side.module';
import { RightSideModule } from '@app/partials/right-side/right-side.module';

@NgModule({
  declarations: [AllGigsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    I18nModule,
    RouterModule,
    MaterialModule,
    AllGigsRoutingModule,
    CarouselModule,
    RightSideModule,
    LeftSideModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AllGigsModule {}
