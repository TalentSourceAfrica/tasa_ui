import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared';
import { MaterialModule } from '@app/modules/material.module';
import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
// Import the library
import { NgxStripeModule } from 'ngx-stripe';
import { stripeKeys } from '@app/models/constants';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    SharedModule,
    CartRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    CarouselModule,
    NgxStripeModule.forRoot(stripeKeys.public)
  ],
  declarations: [CartComponent],
  entryComponents: [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class CartModule {}
