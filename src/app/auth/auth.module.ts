import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { I18nModule } from '@app/i18n';
import { AuthRoutingModule } from './auth-routing.module';

import { SignupPopupComponent } from '@app/partials/popups/authentication/signup-popup/signup-popup.component';
// import { LoginPopupComponent } from '@app/partials/popups/authentication/login-popup/login-popup.component';
import { ForgotPasswordPopupComponent } from '@app/partials/popups/authentication/forgot-password-popup/forgot-password-popup.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, NgbModule, I18nModule, AuthRoutingModule],
  declarations: [SignupPopupComponent, ForgotPasswordPopupComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AuthModule {}
