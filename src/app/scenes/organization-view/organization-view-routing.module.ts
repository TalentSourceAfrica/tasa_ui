import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { OrganizationViewComponent } from './organization-view.component';

const routes: Routes = [
  {
    path: '',
    component: OrganizationViewComponent,
    data: {
      title: extract('TaSA | Organization'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationViewRoutingModule {}
