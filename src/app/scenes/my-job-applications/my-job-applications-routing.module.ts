import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { MyJobApplicationsComponent } from './my-job-applications.component';

const routes: Routes = [
  {
    path: '',
    component: MyJobApplicationsComponent,
    data: {
      title: extract('TaSA | My Job Applications'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyJobApplicationsRoutingModule {}