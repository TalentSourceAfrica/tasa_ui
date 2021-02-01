import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LeftSideComponent } from './left-side.component';
LeftSideComponent

@NgModule({
  declarations: [LeftSideComponent],
  exports: [LeftSideComponent],
  imports: [CommonModule, RouterModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LeftSideModule {}
