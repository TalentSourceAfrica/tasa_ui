import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { LovComponent } from './lov.component';

const routes: Routes = [
  {
    path: '',
    component: LovComponent,
    data: {
      title: extract('TaSA | Admin-LOV'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LovRoutingModule {}
