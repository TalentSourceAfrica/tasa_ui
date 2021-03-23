import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nModule } from '@app/i18n';
import { AuthModule } from '@app/auth';
import { MaterialModule } from '@app/modules/material.module';
import { RouterModule } from '@angular/router';

// module

import { SocialConnectionsModule } from '@app/partials/social-network/social-connections/social-connections.module';
import { LeftSideModule } from '@app/partials/left-side/left-side.module';
import { RightSideModule } from '@app/partials/right-side/right-side.module';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { SharedModule } from '@app/@shared';
import { IvyGalleryModule } from 'angular-gallery';
import { SocialPostsRoutingModule } from './social-posts-routing.module';
import { NgxEditorModule } from 'ngx-editor';
// component
import { SocialPostsComponent } from './social-posts.component';
import { UserInteractionSocialpostPopoverComponent } from '@app/partials/popups/community/user-interaction-socialpost-popover/user-interaction-socialpost-popover.component';
import { ShareUserPostPopoverComponent } from '@app/partials/popups/community/share-user-post-popover/share-user-post-popover.component';
import { ShareArticlePopupComponent } from '@app/partials/popups/community/share-article-popup/share-article-popup.component';
import { SafeHtmlModule } from '@app/pipes/safe-html.pipe';

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
    NgxEditorModule,
    SocialPostsRoutingModule,
    SocialConnectionsModule,
    PickerModule,
    LeftSideModule,
    RightSideModule,
    SharedModule,
    IvyGalleryModule,
    SafeHtmlModule
  ],
  declarations: [
    SocialPostsComponent,
    UserInteractionSocialpostPopoverComponent,
    ShareUserPostPopoverComponent,
    ShareArticlePopupComponent
  ],
  entryComponents: [
    UserInteractionSocialpostPopoverComponent,
    ShareUserPostPopoverComponent,
    ShareArticlePopupComponent,
  ],
})
export class SocialPostsModule {}
