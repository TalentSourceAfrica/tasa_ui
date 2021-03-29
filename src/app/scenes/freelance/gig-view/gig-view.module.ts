import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { I18nModule } from '@app/i18n';
import { MaterialModule } from '@app/modules/material.module';
import { RouterModule } from '@angular/router';
import { GigViewRoutingModule } from './gig-view-routing.module';
import { GigViewComponent } from './gig-view.component';
import { SafeHtmlModule } from '@app/pipes/safe-html.pipe';

@NgModule({
  declarations: [GigViewComponent],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    I18nModule,
    FormsModule,
    TranslateModule,
    GigViewRoutingModule,
    SafeHtmlModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class GigViewModule {}