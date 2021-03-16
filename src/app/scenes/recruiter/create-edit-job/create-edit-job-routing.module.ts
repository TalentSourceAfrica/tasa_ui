import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { CreateEditJobComponent } from './create-edit-job.component';


const routes: Routes = [
  {
    path: '',
    component: CreateEditJobComponent,
    data: {
      title: extract('TaSA | Create/Edit Job'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateEditJobRoutingModule { }
