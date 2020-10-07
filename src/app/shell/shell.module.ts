import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShellRoutingModule } from './shell-routing.module';
import { MaterialModule } from '@app/modules/material.module';

import { I18nModule } from '@app/i18n';
import { AuthModule } from '@app/auth';
import { ShellComponent } from './shell.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from '@app/partials/footer/footer.component';
import { HomeHeaderComponent } from '@app/partials/home-header/home-header.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    AuthModule,
    I18nModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ShellRoutingModule,
  ],
  declarations: [HeaderComponent, ShellComponent, FooterComponent, HomeHeaderComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ShellModule {}
