import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductSearchComponent } from './product-search.component';
import { MaterialModule } from '@app/modules/material.module';


@NgModule({
  declarations: [ProductSearchComponent],
  exports: [ProductSearchComponent],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductSearchModule {}
