import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { I18nModule } from '@app/i18n';
import { AuthModule } from '@app/auth';
import { MaterialModule } from '@app/modules/material.module';
import { RouterModule } from '@angular/router';
import { DigitalAssetsRoutingModule } from './digital-assets-routing.module';
import { DigitalAssetsComponent } from './digital-assets.component';
import { IvyGalleryModule } from 'angular-gallery';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
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
    DigitalAssetsRoutingModule,
    IvyGalleryModule,
    NgxDocViewerModule,
    LeftSideModule,
  ],
  declarations: [DigitalAssetsComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class DigitalAssetsModule {}
