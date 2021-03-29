import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { I18nModule } from '@app/i18n';
import { MaterialModule } from '@app/modules/material.module';
import { RouterModule } from '@angular/router';
import { CreateEditJobRoutingModule } from './create-edit-job-routing.module';
import { NgxEditorModule } from 'ngx-editor';
import { CreateEditJobComponent } from './create-edit-job.component';

@NgModule({
  declarations: [CreateEditJobComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    I18nModule,
    RouterModule,
    MaterialModule,
    CreateEditJobRoutingModule,
    NgxEditorModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class CreateEditJobModule {}