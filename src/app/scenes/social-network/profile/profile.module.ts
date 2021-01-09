import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nModule } from '@app/i18n';
import { AuthModule } from '@app/auth';
import { MaterialModule } from '@app/modules/material.module';
import { RouterModule } from '@angular/router';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';

import { SocialConnectionsModule } from '@app/partials/social-network/social-connections/social-connections.module';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { SocialnetworkService } from '../socialnetwork.service';



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
  ],
  declarations: [ProfileComponent],
  providers:[SocialnetworkService],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ProfileModule {}
