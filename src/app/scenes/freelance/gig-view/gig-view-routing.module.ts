import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { GigViewComponent } from './gig-view.component';

const routes: Routes = [
  {
    path: '',
    component: GigViewComponent,
    data: {
      title: extract('TaSA | Gig View'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GigViewRoutingModule {}
