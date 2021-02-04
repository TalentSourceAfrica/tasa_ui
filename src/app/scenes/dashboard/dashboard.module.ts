import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { I18nModule } from '@app/i18n';
import { AuthModule } from '@app/auth';
import { MaterialModule } from '@app/modules/material.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';

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
    MatTableModule
  ],
  declarations: [DashboardComponent],
})
export class DashboardModule {}
