import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NoSubscriptionComponent } from './no-subscription/no-subscription.component';

@NgModule({
  imports: [CommonModule, CarouselModule, TranslateModule, FormsModule],
  declarations: [LoaderComponent, NoSubscriptionComponent],
  exports: [LoaderComponent, NoSubscriptionComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SharedModule {}
