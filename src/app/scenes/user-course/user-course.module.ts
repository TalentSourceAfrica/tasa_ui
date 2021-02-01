import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { I18nModule } from '@app/i18n';
import { AuthModule } from '@app/auth';
import { MaterialModule } from '@app/modules/material.module';
import { RouterModule } from '@angular/router';
import { UserCourseRoutingModule } from './user-course-routing.module';
import { UserCourseComponent } from './user-course.component';
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
    UserCourseRoutingModule,
    LeftSideModule,
  ],
  declarations: [UserCourseComponent],
})
export class UserCourseModule {}
