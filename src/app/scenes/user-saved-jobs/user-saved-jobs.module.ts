import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { I18nModule } from '@app/i18n';
import { AuthModule } from '@app/auth';
import { MaterialModule } from '@app/modules/material.module';
import { RouterModule } from '@angular/router';
import { UserSavedJobsComponent } from './user-saved-jobs.component';
import { UserSavedJobsRoutingModule } from './user-saved-jobs-routing.module';
import { LeftSideModule } from '@app/partials/left-side/left-side.module';
import { RightSideModule } from '@app/partials/right-side/right-side.module';

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
    UserSavedJobsRoutingModule,
    LeftSideModule,
    RightSideModule,
  ],
  declarations: [UserSavedJobsComponent],
  entryComponents: [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class UserSavedJobsModule {}
