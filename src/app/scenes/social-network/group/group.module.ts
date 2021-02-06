import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nModule } from '@app/i18n';
import { AuthModule } from '@app/auth';
import { MaterialModule } from '@app/modules/material.module';
import { RouterModule } from '@angular/router';
import { LeftSideModule } from '@app/partials/left-side/left-side.module';
import { RightSideModule } from '@app/partials/right-side/right-side.module';
import { GroupComponent } from './group.component';
import { GroupRoutingModule } from './group-routing.module';
import { CreateGroupPopupModule } from '@app/partials/popups/group/create-group-popup/create-group-popup.module';
import { InviteUserPopupComponent } from '@app/partials/popups/group/invite-user-popup/invite-user-popup.component';
import { GroupFilterPipe } from '@app/pipes/group-filter.pipe';

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
    GroupRoutingModule,
    LeftSideModule,
    RightSideModule,
    CreateGroupPopupModule,
  ],
  declarations: [GroupComponent, InviteUserPopupComponent, GroupFilterPipe],
  schemas: [NO_ERRORS_SCHEMA],
})
export class GroupModule {}
