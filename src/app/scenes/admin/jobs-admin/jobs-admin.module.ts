import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { I18nModule } from '@app/i18n';
import { AuthModule } from '@app/auth';
import { MaterialModule } from '@app/modules/material.module';
import { RouterModule } from '@angular/router';
import { JobsAdminComponent } from './jobs-admin.component';
import { JobsAdminRoutingModule } from './jobs-admin-routing.module';

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
    JobsAdminRoutingModule,
  ],
  declarations: [JobsAdminComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class JobsAdminModule {}
