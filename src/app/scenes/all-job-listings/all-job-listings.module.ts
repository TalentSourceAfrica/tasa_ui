import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@shared';
import { AllJobListingsRoutingModule } from './all-job-listings-routing.module';
import { AllJobListingsComponent } from './all-job-listings.component';

import { MaterialModule } from '@app/modules/material.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    AllJobListingsRoutingModule,
    MaterialModule
  ],
  declarations: [AllJobListingsComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AllJobListingsModule {}
