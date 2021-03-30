import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { RequirementViewComponent } from './requirement-view.component';

const routes: Routes = [
  {
    path: '',
    component: RequirementViewComponent,
    data: {
      title: extract('TaSA | Requirement View'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequirementViewRoutingModule {}
