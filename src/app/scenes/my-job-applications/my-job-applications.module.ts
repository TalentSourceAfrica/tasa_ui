import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@shared';
import { MyJobApplicationsRoutingModule } from './my-job-applications-routing.module';
import { MyJobApplicationsComponent } from './my-job-applications.component';

import { MaterialModule } from '@app/modules/material.module';

@NgModule({
  imports: [CommonModule, TranslateModule, FormsModule, SharedModule, MyJobApplicationsRoutingModule , MaterialModule],
  declarations: [MyJobApplicationsComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class MyJobApplicationsModule {}
