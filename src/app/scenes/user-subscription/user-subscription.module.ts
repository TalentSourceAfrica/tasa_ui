import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { I18nModule } from '@app/i18n';
import { AuthModule } from '@app/auth';
import { MaterialModule } from '@app/modules/material.module';
import { RouterModule } from '@angular/router';
import { UserSubscriptionRoutingModule } from './user-subscription-routing.module';
import { UserSubscriptionComponent } from './user-subscription.component';
import { SharedModule } from '@app/@shared';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    AuthModule,
    I18nModule,
    MaterialModule,
    RouterModule,
    UserSubscriptionRoutingModule,
    SharedModule,
    FormsModule,
  ],
  declarations: [UserSubscriptionComponent],
})
export class UserSubscriptionModule {}
