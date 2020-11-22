import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared';
import { MaterialModule } from '@app/modules/material.module';
import { AllNotificationsRoutingModule } from './all-notifications-routing.module';
import { AllNotificationsComponent } from './all-notifications.component';

@NgModule({
  imports: [CommonModule, TranslateModule, FormsModule, SharedModule, AllNotificationsRoutingModule, MaterialModule],
  declarations: [AllNotificationsComponent],
  entryComponents: [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AllNotificationsModule {}
