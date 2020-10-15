import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { OurPartnersComponent } from './our-partners.component';

const routes: Routes = [
  {
    path: '',
    component: OurPartnersComponent,
    data: {
      title: extract('TaSA | Our Partner'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OurPartnersRoutingModule {}
