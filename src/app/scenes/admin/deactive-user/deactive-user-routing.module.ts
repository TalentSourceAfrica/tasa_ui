import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { DeactiveUserComponent } from './deactive-user.component';

const routes: Routes = [
  {
    path: '',
    component: DeactiveUserComponent,
    data: {
      title: extract('TaSA | Admin-Deactive User'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeactiveUserRoutingModule {}
