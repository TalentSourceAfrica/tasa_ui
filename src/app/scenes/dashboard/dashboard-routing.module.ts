import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { extract } from '@app/i18n';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: {
      title: extract('TaSA | Dashboard'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
