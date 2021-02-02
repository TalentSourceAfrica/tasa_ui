import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@shared';
import { AllJobListingsRoutingModule } from './all-job-listings-routing.module';
import { AllJobListingsComponent } from './all-job-listings.component';
import { JobsApplyPopupModule } from '@app/partials/popups/jobs/jobs-apply-popup/jobs-apply-popup.module';

import { MaterialModule } from '@app/modules/material.module';
import { LeftSideModule } from '@app/partials/left-side/left-side.module';
import { RightSideModule } from '@app/partials/right-side/right-side.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    SharedModule,
    AllJobListingsRoutingModule,
    MaterialModule,
    JobsApplyPopupModule,
    LeftSideModule,
    RightSideModule,
  ],
  declarations: [AllJobListingsComponent],
  entryComponents: [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AllJobListingsModule {}
