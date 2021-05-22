import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NoSubscriptionComponent } from './no-subscription/no-subscription.component';
import { ReadMoreComponent } from './read-more/read-more.component';

@NgModule({
  imports: [CommonModule, CarouselModule, TranslateModule, FormsModule,ReactiveFormsModule],
  declarations: [LoaderComponent, NoSubscriptionComponent, ReadMoreComponent],
  exports: [LoaderComponent, NoSubscriptionComponent, ReadMoreComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SharedModule {}
