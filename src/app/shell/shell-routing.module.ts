import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShellComponent } from '@app/shell/shell.component';
import { AuthenticationGuard } from '@app/auth';
import { AdminGuard } from '@app/auth/guard/admin.guard';
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
        canActivate: [AuthenticationGuard],
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
        path: 'course/:key',
        loadChildren: () => import('@app/scenes/course/course.module').then((m) => m.CourseModule),
      },
      {
        path: 'user/profile',
        canActivate: [AuthenticationGuard],
        loadChildren: () => import('@app/scenes/user-profile/user-profile.module').then((m) => m.UserProfileModule),
      },
      {
        path: 'subscription-plans',
        canActivate: [AuthenticationGuard],
        loadChildren: () =>
          import('@app/scenes/subscription-plans/subscription-plans.module').then((m) => m.SubscriptionPlansModule),
      },
      {
        path: 'my-plan',
        canActivate: [AuthenticationGuard],
        loadChildren: () =>
          import('@app/scenes/user-subscription/user-subscription.module').then((m) => m.UserSubscriptionModule),
      },
      {
        path: 'all-course',
        loadChildren: () => import('@app/scenes/all-course/all-course.module').then((m) => m.AllCourseModule),
      },
      {
        path: 'user/course',
        canActivate: [AuthenticationGuard],
        loadChildren: () => import('@app/scenes/user-course/user-course.module').then((m) => m.UserCourseModule),
      },
      {
        path: 'digital-assets',
        canActivate: [AuthenticationGuard],
        loadChildren: () =>
          import('@app/scenes/digital-assets/digital-assets.module').then((m) => m.DigitalAssetsModule),
      },
      {
        path: 'admin/tier',
        canActivate: [AuthenticationGuard, AdminGuard],
        loadChildren: () => import('@app/scenes/admin/tier/tier.module').then((m) => m.TierModule),
      },
      {
        path: 'admin/deactive-user',
        canActivate: [AuthenticationGuard, AdminGuard],
        loadChildren: () =>
          import('@app/scenes/admin/deactive-user/deactive-user.module').then((m) => m.DeactiveUserModule),
      },
      { path: '', redirectTo: '/home', pathMatch: 'full' },
    ],
    data: { reuse: true },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class ShellRoutingModule {}
