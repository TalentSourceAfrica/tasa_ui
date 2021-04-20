import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { I18nModule } from '@app/i18n';
import { AuthModule } from '@app/auth';
import { SubmitFeedbackPopupComponent } from './submit-feedback-popup.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '@app/modules/material.module';


@NgModule({
  imports: [CommonModule, TranslateModule, AuthModule, FormsModule, I18nModule, NgbModule,MaterialModule],
  declarations: [SubmitFeedbackPopupComponent],
  entryComponents: [SubmitFeedbackPopupComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SubmitFeedbackPopupModule { }
