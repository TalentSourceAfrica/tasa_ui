import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@app/modules/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateGroupPopupComponent } from './create-group-popup.component';

@NgModule({
  declarations: [CreateGroupPopupComponent],
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
})
export class CreateGroupPopupModule {}
