import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { AllCourseComponent } from './all-course.component';

const routes: Routes = [
  {
    path: '',
    component: AllCourseComponent,
    data: {
      title: extract('TaSA | All Course'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllCourseRoutingModule {}
