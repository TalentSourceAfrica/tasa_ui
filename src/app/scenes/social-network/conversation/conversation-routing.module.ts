import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { ConversationComponent } from './conversation.component';


const routes: Routes = [
  {
    path: '',
    component: ConversationComponent,
    data: {
      title: extract('TaSA | Conversations'),
    },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConversationRoutingModule { }
