import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { UserCourseComponent } from './user-course.component';

const routes: Routes = [
  {
    path: '',
    component: UserCourseComponent,
    data: {
      title: extract('TaSA | My Courses'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserCourseRoutingModule {}
