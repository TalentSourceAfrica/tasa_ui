import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { I18nModule } from '@app/i18n';
import { MaterialModule } from '@app/modules/material.module';
import { RouterModule } from '@angular/router';
import { NgxEditorModule } from 'ngx-editor';
import { CreateRequirementComponent } from './create-requirement.component';
import { CreateRequirementRoutingModule } from './create-requirement-routing.module';

@NgModule({
  declarations: [CreateRequirementComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    I18nModule,
    RouterModule,
    MaterialModule,
    CreateRequirementRoutingModule,
    NgxEditorModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class CreateRequirementModule {}
