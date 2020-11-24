import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { I18nModule } from '@app/i18n';
import { AuthModule } from '@app/auth';
import { MaterialModule } from '@app/modules/material.module';
import { RouterModule } from '@angular/router';
import { OrganizationViewRoutingModule } from './organization-view-routing.module';
import { OrganizationViewComponent } from './organization-view.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    AuthModule,
    I18nModule,
    MaterialModule,
    RouterModule,
    OrganizationViewRoutingModule,
  ],
  declarations: [OrganizationViewComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class OrganizationViewModule {}
