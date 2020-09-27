import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { UserSubscriptionComponent } from './user-subscription.component';

const routes: Routes = [
  {
    path: '',
    component: UserSubscriptionComponent,
    data: {
      title: extract('TaSA | My Subscription Plan'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserSubscriptionRoutingModule {}
