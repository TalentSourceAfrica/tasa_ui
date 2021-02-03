import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { GroupComponent } from './group.component';


const routes: Routes = [
  {
    path: '',
    component: GroupComponent,
    data: {
      title: extract('TaSA | Group'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupRoutingModule { }
