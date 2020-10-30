import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { SocialPostsComponent } from './social-posts.component';

const routes: Routes = [
  {
    path: '',
    component: SocialPostsComponent,
    data: {
      title: extract('TaSA | Social Posts'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SocialPostsRoutingModule {}
