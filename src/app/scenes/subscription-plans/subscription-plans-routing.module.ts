import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubscriptionPlansComponent } from './subscription-plans.component';
import { extract } from '@app/i18n';

const routes: Routes = [
  {
    path: '',
    component: SubscriptionPlansComponent,
    data: {
      title: extract('TaSA | Subscription Plans'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscriptionPlansRoutingModule {}
