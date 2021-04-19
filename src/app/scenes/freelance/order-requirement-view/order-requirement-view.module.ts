import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { I18nModule } from '@app/i18n';
import { MaterialModule } from '@app/modules/material.module';
import { RouterModule } from '@angular/router';
import { SafeHtmlModule } from '@app/pipes/safe-html.pipe';

import { OrderRequirementViewRoutingModule } from './order-requirement-view-routing.module';
import { OrderRequirementViewComponent } from './order-requirement-view.component';


@NgModule({
  declarations: [OrderRequirementViewComponent],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    I18nModule,
    FormsModule,
    TranslateModule,
    OrderRequirementViewRoutingModule,
    SafeHtmlModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class OrderRequirementViewModule { }
