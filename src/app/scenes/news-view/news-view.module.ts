import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { I18nModule } from '@app/i18n';
import { AuthModule } from '@app/auth';
import { RouterModule } from '@angular/router';
import { NewsViewComponent } from './news-view.component';
import { NewsViewRoutingModule } from './news-view-routing.module';

@NgModule({
  imports: [CommonModule, TranslateModule, NgbModule, AuthModule, I18nModule, RouterModule, NewsViewRoutingModule],
  declarations: [NewsViewComponent],
})
export class NewsViewModule {}
