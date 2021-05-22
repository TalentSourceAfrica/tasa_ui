import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared';
import { MaterialModule } from '@app/modules/material.module';
import { TransactionComponent } from './transaction.component';
import { TransactionRoutingModule } from './transaction-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TransactionRoutingModule,
    MaterialModule
  ],
  declarations: [TransactionComponent],
  entryComponents: [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class TransactionModule {}
