import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { AllRequirementComponent } from './all-requirement.component';

const routes: Routes = [
  {
    path: '',
    component: AllRequirementComponent,
    data: {
      title: extract('TaSA | All Requirement'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllRequirementRoutingModule {}
