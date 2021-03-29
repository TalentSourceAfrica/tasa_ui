import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { CreateRequirementComponent } from './create-requirement.component';

const routes: Routes = [
  {
    path: '',
    component: CreateRequirementComponent,
    data: {
      title: extract('TaSA | Create Requirement'),
    },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateRequirementRoutingModule { }
