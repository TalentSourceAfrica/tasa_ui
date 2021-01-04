import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nModule } from '@app/i18n';
import { AuthModule } from '@app/auth';
import { MaterialModule } from '@app/modules/material.module';
import { RouterModule } from '@angular/router';
import { NgxEmojiPickerModule } from 'ngx-emoji-picker';
import { ConversationRoutingModule } from './conversation-routing.module';
import { ConversationComponent } from './conversation.component';


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
    NgxEmojiPickerModule,
  ],
  declarations: [ConversationComponent],
  entryComponents: [],
})
export class ConversationModule { }
