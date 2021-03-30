import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { I18nModule } from '@app/i18n';
import { MaterialModule } from '@app/modules/material.module';
import { RouterModule } from '@angular/router';
import { SafeHtmlModule } from '@app/pipes/safe-html.pipe';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { RequirementViewRoutingModule } from './requirement-view-routing.module';
import { RequirementViewComponent } from './requirement-view.component';

@NgModule({
  declarations: [RequirementViewComponent],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    I18nModule,
    FormsModule,
    TranslateModule,
    RequirementViewRoutingModule,
    SafeHtmlModule,
    CarouselModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class RequirementViewModule {}
