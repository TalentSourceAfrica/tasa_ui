import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nModule } from '@app/i18n';
import { AuthModule } from '@app/auth';
import { MaterialModule } from '@app/modules/material.module';
import { RouterModule } from '@angular/router';

import { SocialPostsRoutingModule } from './social-posts-routing.module';
import { SocialPostsComponent } from './social-posts.component';
import { UserInteractionSocialpostPopoverComponent } from '@app/partials/popups/community/user-interaction-socialpost-popover/user-interaction-socialpost-popover.component';

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
    SocialPostsRoutingModule
  ],
  declarations: [SocialPostsComponent, UserInteractionSocialpostPopoverComponent],
  entryComponents: [UserInteractionSocialpostPopoverComponent]
})
export class SocialPostsModule {}
