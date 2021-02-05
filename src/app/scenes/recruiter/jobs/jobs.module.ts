import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { I18nModule } from '@app/i18n';
import { AuthModule } from '@app/auth';
import { MaterialModule } from '@app/modules/material.module';
import { RouterModule } from '@angular/router';
import { NgxDocViewerModule } from 'ngx-doc-viewer';

import { JobsRoutingModule } from './jobs-routing.module';
import { JobsComponent } from './jobs.component';
// import { ShowApplicantsComponent } from '@app/partials/popups/recruiter/show-applicants/show-applicants.component';
import { ShowApplicantsModule } from '@app/partials/popups/recruiter/show-applicants/show-applicants.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    AuthModule,
    FormsModule,
    I18nModule,
    MaterialModule,
    RouterModule,
    JobsRoutingModule,
    NgxDocViewerModule,
    ShowApplicantsModule
  ],
  declarations: [JobsComponent],
  entryComponents: [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class JobsModule {}
