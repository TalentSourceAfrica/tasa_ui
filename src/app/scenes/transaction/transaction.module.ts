import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared';
import { MaterialModule } from '@app/modules/material.module';
import { TransactionComponent } from './transaction.component';
import { TransactionRoutingModule } from './transaction-routing.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    SharedModule,
    TransactionRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [TransactionComponent],
  entryComponents: [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class TransactionModule {}
