import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { I18nModule } from '@app/i18n';
import { AuthModule } from '@app/auth';
import { MaterialModule } from '@app/modules/material.module';
import { RouterModule } from '@angular/router';
import { AllCourseRoutingModule } from './all-course-routing.module';
import { AllCourseComponent } from './all-course.component';
import { EditCoursePopupComponent } from '@app/partials/popups/course/edit-course-popup/edit-course-popup.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    AuthModule,
    FormsModule,
    I18nModule,
    MaterialModule,
    RouterModule,
    AllCourseRoutingModule,
  ],
  declarations: [AllCourseComponent, EditCoursePopupComponent],
  entryComponents: [EditCoursePopupComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AllCourseModule {}
