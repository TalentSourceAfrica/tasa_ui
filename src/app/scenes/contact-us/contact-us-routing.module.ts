import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { ContactUsComponent } from './contact-us.component';

const routes: Routes = [
  {
    path: '',
    component: ContactUsComponent,
    data: {
      title: extract('TaSA | Contact Us'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactUsRoutingModule {}
