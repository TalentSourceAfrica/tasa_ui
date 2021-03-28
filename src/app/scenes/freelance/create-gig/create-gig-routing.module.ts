import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { CreateGigComponent } from './create-gig.component';

const routes: Routes = [
  {
    path: '',
    component: CreateGigComponent,
    data: {
      title: extract('TaSA | Create Gig'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateGigRoutingModule {}
