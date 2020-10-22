import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { AllJobListingsComponent } from './all-job-listings.component';

const routes: Routes = [
  {
    path: '',
    component: AllJobListingsComponent,
    data: {
      title: extract('TaSA | All Job Listings'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllJobListingsRoutingModule {}
