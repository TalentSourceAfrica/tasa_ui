import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { JobsComponent } from './jobs.component';
const routes: Routes = [
  {
    path: '',
    component: JobsComponent,
    data: {
      title: extract('TaSA | All Jobs'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobsRoutingModule {}
