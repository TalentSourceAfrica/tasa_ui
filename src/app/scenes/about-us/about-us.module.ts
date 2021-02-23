import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nModule } from '@app/i18n';
import { AuthModule } from '@app/auth';
import { RouterModule } from '@angular/router';
import { AboutUsComponent } from './about-us.component';
import { AboutUsRoutingModule } from './about-us-routing.module';
import { OurTeamComponent } from '@app/partials/popups/about-us/our-team/our-team.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    AuthModule,
    FormsModule,
    I18nModule,
    RouterModule,
    AboutUsRoutingModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  declarations: [AboutUsComponent, OurTeamComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AboutUsModule {}
