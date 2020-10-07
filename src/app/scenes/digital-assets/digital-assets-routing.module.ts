import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { DigitalAssetsComponent } from './digital-assets.component';

const routes: Routes = [
  {
    path: '',
    component: DigitalAssetsComponent,
    data: {
      title: extract('TaSA | Digital Assets'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DigitalAssetsRoutingModule {}
