import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { PartnersComponent } from './partners.component';

const routes: Routes = [
  {
    path: '',
    component: PartnersComponent,
    data: {
      title: extract('TaSA | Admin-Partners'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartnersRoutingModule {}
