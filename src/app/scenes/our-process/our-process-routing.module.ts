import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { OurProcessComponent } from './our-process.component';

const routes: Routes = [
  {
    path: '',
    component: OurProcessComponent,
    data: {
      title: extract('TaSA | Our Process'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OurProcessRoutingModule {}
