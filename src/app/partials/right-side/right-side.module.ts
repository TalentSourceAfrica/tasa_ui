import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RightSideComponent } from './right-side.component';


@NgModule({
  declarations: [RightSideComponent],
  exports: [RightSideComponent],
  imports: [CommonModule, RouterModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RightSideModule {}
