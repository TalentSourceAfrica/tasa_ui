import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { TestimonialsComponent } from './testimonials.component';

const routes: Routes = [
  {
    path: '',
    component: TestimonialsComponent,
    data: {
      title: extract('TaSA | Testimonials'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestimonialsRoutingModule {}
