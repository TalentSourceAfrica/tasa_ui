import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { I18nModule } from '@app/i18n';
import { AuthModule } from '@app/auth';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GroupViewRoutingModule } from './group-view-routing.module';
import { GroupViewComponent } from './group-view.component';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    AuthModule,
    I18nModule,
    RouterModule,
    GroupViewRoutingModule,
    MatButtonModule,
    MatTooltipModule
  ],
  declarations: [GroupViewComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class GroupViewModule {}
