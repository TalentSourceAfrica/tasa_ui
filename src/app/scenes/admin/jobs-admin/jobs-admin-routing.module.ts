import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { JobsAdminComponent } from './jobs-admin.component';

const routes: Routes = [
  {
    path: '',
    component: JobsAdminComponent,
    data: {
      title: extract('TaSA | Jobs'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class JobsAdminRoutingModule { }