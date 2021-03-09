import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/i18n';
import { GroupViewComponent } from './group-view.component';

const routes: Routes = [
  {
    path: '',
    component: GroupViewComponent,
    data: {
      title: extract('TaSA | Group View'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupViewRoutingModule {}
