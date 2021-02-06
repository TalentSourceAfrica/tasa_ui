import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowApplicantsComponent } from './show-applicants.component';
import { MaterialModule } from '@app/modules/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule, RouterModule],
  declarations: [ShowApplicantsComponent],
  exports: [ShowApplicantsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ShowApplicantsModule {}
