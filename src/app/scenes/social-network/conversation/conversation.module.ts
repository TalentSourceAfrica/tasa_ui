import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nModule } from '@app/i18n';
import { AuthModule } from '@app/auth';
import { MaterialModule } from '@app/modules/material.module';
import { RouterModule } from '@angular/router';
import { ConversationRoutingModule } from './conversation-routing.module';
import { ConversationComponent } from './conversation.component';
import { NameFilterModule } from '@app/pipes/name-filter.pipe';
import { LeftSideModule } from '@app/partials/left-side/left-side.module';
import { RightSideModule } from '@app/partials/right-side/right-side.module';
import { PickerModule } from '@ctrl/ngx-emoji-mart';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    AuthModule,
    I18nModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ConversationRoutingModule,
    LeftSideModule,
    RightSideModule,
    PickerModule,
    NameFilterModule
  ],
  declarations: [ConversationComponent],
  entryComponents: [],
})
export class ConversationModule {}
