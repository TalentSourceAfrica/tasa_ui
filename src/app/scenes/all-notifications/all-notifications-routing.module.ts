import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { AllNotificationsComponent } from './all-notifications.component';

const routes: Routes = [
  {
    path: '',
    component: AllNotificationsComponent,
    data: {
      title: extract('TaSA | All Notifications'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllNotificationsRoutingModule {}
