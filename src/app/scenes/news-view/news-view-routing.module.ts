import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { NewsViewComponent } from './news-view.component';

const routes: Routes = [
  {
    path: '',
    component: NewsViewComponent,
    data: {
      title: extract('TaSA | News'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsViewRoutingModule {}
