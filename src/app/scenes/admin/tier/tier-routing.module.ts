import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { TierComponent } from './tier.component';

const routes: Routes = [
  {
    path: '',
    component: TierComponent,
    data: {
      title: extract('TaSA | Admin-Tier'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TierRoutingModule {}
