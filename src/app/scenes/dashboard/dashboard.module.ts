import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { MaterialModule } from '@app/modules/material.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ComingSoonModule } from '@app/partials/coming-soon/coming-soon.module';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    CarouselModule,
    ComingSoonModule,
    CoreModule,
    TranslateModule,
    SharedModule,
  ],
  declarations: [DashboardComponent],
  entryComponents: [DashboardComponent],
})
export class DashboardModule {}
