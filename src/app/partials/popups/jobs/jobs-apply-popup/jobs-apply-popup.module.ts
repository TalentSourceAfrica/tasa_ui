import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { I18nModule } from '@app/i18n';
import { AuthModule } from '@app/auth';
import { MaterialModule } from '@app/modules/material.module';
import { JobsApplyPopupComponent } from './jobs-apply-popup.component';

@NgModule({
  imports: [CommonModule, TranslateModule, AuthModule, FormsModule, I18nModule, MaterialModule],
  declarations: [JobsApplyPopupComponent],
  entryComponents: [JobsApplyPopupComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class JobsApplyPopupModule {}
