import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

import { QuoteService } from './quote.service';
import { MaterialModule } from '@app/modules/material.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [CommonModule, TranslateModule, CoreModule, SharedModule, HomeRoutingModule, MaterialModule, CarouselModule, BrowserAnimationsModule],
  declarations: [HomeComponent],
})
export class HomeModule {}
