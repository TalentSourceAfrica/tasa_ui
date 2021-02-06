import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  imports: [CommonModule, CarouselModule],
  declarations: [LoaderComponent],
  exports: [LoaderComponent],
})
export class SharedModule {}
