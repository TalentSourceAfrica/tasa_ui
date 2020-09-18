import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { AuthenticationGuard } from '@app/core';
import { ShellComponent } from '@app/shell/shell.component';
// import { extract } from '@app/core';
// import { PublicGuard, ProtectedGuard } from 'ngx-auth';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: 'home',
        loadChildren: () => import('@app/scenes/home/home-routing.module').then((m) => m.HomeRoutingModule),
      },
      {
        path: 'dashboard',
        loadChildren: () => import('@app/scenes/dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'contact-us',
        loadChildren: () => import('@app/scenes/contact-us/contact-us.module').then((m) => m.ContactUsModule),
      },
      {
        path: 'reset-password',
        loadChildren: () =>
          import('@app/scenes/reset-password/reset-password.module').then((m) => m.ResetPasswordModule),
      },
      {
        path: 'course/:id',
        loadChildren: () => import('@app/scenes/course/course.module').then((m) => m.CourseModule),
      },
      { path: '', redirectTo: '/home', pathMatch: 'full' },
    ],
    data: { reuse: true },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShellRoutingModule {}
