import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Ui Frameworks modules
import { MaterialModule } from '@app/modules/material.module';

import { environment } from '@env/environment';
import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { AuthModule } from '@app/auth';
import { HomeModule } from './scenes/home/home.module';
import { ShellModule } from './shell/shell.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ContactUsModule } from './scenes/contact-us/contact-us.module';
import { CourseModule } from './scenes/course/course.module';
import { ResetPasswordModule } from './scenes/reset-password/reset-password.module';
//component
import { LoginPopupComponent } from './partials/popups/authentication/login-popup/login-popup.component';
import { UserDetailsPopupComponent } from './partials/popups/authentication/user-details-popup/user-details-popup.component';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    NgbModule,
    CoreModule,
    MaterialModule,
    SharedModule,
    ShellModule,
    HomeModule,
    AuthModule,
    AppRoutingModule, // must be imported as the last module as it contains the fallback route
    ContactUsModule,
    CourseModule,
    ResetPasswordModule,
  ],
  declarations: [AppComponent, LoginPopupComponent, UserDetailsPopupComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
