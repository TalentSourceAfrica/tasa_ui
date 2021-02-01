import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nModule } from '@app/i18n';
import { AuthModule } from '@app/auth';
import { MaterialModule } from '@app/modules/material.module';
import { RouterModule } from '@angular/router';
import { NetworkComponent } from './network.component';
import { NetworkRoutingModule } from './network-routing.module';
import { LeftSideModule } from '@app/partials/left-side/left-side.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    AuthModule,
    I18nModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NetworkRoutingModule,
    LeftSideModule,
  ],
  declarations: [NetworkComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NetworkModule {}
