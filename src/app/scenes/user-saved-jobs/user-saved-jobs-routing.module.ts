import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { UserSavedJobsComponent } from './user-saved-jobs.component';


const routes: Routes = [
  {
    path: '',
    component: UserSavedJobsComponent,
    data: {
      title: extract('TaSA | Saved Jobs'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserSavedJobsRoutingModule { }
