import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nModule } from '@app/i18n';
import { AuthModule } from '@app/auth';
import { MaterialModule } from '@app/modules/material.module';
import { RouterModule } from '@angular/router';
import { SocialnetworkService } from '../socialnetwork.service';

// Module
import { LeftSideModule } from '@app/partials/left-side/left-side.module';
import { RightSideModule } from '@app/partials/right-side/right-side.module';
import { CreateGroupPopupModule } from '@app/partials/popups/group/create-group-popup/create-group-popup.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { SocialConnectionsModule } from '@app/partials/social-network/social-connections/social-connections.module';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { SharedModule } from '@app/@shared';

// Component
import { EditUserPopupComponent } from '@app/partials/popups/authentication/edit-user-popup/edit-user-popup.component';
import { ProfileComponent } from './profile.component';

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
    ProfileRoutingModule,
    SocialConnectionsModule,
    NgxDocViewerModule,
    LeftSideModule,
    RightSideModule,
    CreateGroupPopupModule,
    SharedModule
  ],
  declarations: [ProfileComponent, EditUserPopupComponent],
  providers: [SocialnetworkService],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ProfileModule {}
