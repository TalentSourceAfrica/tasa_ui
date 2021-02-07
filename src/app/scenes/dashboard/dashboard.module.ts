import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { I18nModule } from '@app/i18n';
import { AuthModule } from '@app/auth';
import { MaterialModule } from '@app/modules/material.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { ShowApplicantsModule } from '@app/partials/popups/recruiter/show-applicants/show-applicants.module';
import { RightSideModule } from '@app/partials/right-side/right-side.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    AuthModule,
    I18nModule,
    MaterialModule,
    CarouselModule,
    RouterModule,
    DashboardRoutingModule,
    MatTableModule,
    ShowApplicantsModule,
    MatSortModule,
    MatPaginatorModule,
    RightSideModule,
  ],
  declarations: [DashboardComponent],
})
export class DashboardModule {}
