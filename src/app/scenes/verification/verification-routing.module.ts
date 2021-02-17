import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';
import { VerificationComponent } from './verification.component';


const routes: Routes = [
  {
    path: '',
    component: VerificationComponent,
    data: {
      title: extract('TaSA | Verification'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerificationRoutingModule { }
