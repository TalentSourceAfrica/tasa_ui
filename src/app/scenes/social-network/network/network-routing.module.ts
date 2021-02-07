import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { NetworkComponent } from './network.component';

const routes: Routes = [
  {
    path: '',
    component: NetworkComponent,
    data: {
      title: extract('TaSA | Network'),
    },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NetworkRoutingModule {}
