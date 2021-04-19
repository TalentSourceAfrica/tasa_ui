import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { OrderRequirementViewComponent } from './order-requirement-view.component';

const routes: Routes = [
  {
    path: '',
    component: OrderRequirementViewComponent,
    data: {
      title: extract('TaSA | Requirement View'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRequirementViewRoutingModule { }
