import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerificationComponent } from './verification.component';
import { VerificationRoutingModule } from './verification-routing.module';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    VerificationRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [VerificationComponent],
  entryComponents: [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class VerificationModule { }
