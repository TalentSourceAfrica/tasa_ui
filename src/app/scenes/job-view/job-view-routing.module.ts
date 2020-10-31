import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { JobViewComponent } from './job-view.component';

const routes: Routes = [
  {
    path: '',
    component: JobViewComponent,
    data: {
      title: extract('TaSA | Job'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobViewRoutingModule {}
