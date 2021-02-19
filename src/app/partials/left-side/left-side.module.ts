import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LeftSideComponent } from './left-side.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [LeftSideComponent],
  exports: [LeftSideComponent],
  imports: [CommonModule, RouterModule, FormsModule, MatButtonModule, MatIconModule, MatTooltipModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LeftSideModule {}
