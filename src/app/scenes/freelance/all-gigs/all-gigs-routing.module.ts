import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { AllGigsComponent } from './all-gigs.component';

const routes: Routes = [
  {
    path: '',
    component: AllGigsComponent,
    data: {
      title: extract('TaSA | All Services'),
    },
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllGigsRoutingModule { }
