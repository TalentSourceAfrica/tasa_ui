import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { I18nModule } from '@app/i18n';
import { MaterialModule } from '@app/modules/material.module';
import { RouterModule } from '@angular/router';
import { MyOrdersComponent } from './my-orders.component';
import { MyOrdersRoutingModule } from './my-orders-routing.module';


@NgModule({
  declarations: [MyOrdersComponent],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    I18nModule,
    FormsModule,
    TranslateModule,
    MyOrdersRoutingModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class MyOrdersModule { }
