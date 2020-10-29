import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { UserFavoriteCoursesComponent } from './user-favorite-courses.component';

const routes: Routes = [
  {
    path: '',
    component: UserFavoriteCoursesComponent,
    data: {
      title: extract('TaSA | All Favorite Course'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserFavoriteCoursesRoutingModule {}
