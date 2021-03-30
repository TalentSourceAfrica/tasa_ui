import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShellComponent } from '@app/shell/shell.component';
import { AuthenticationGuard } from '@app/auth';
import { AdminGuard } from '@app/auth/guard/admin.guard';
import { RecruiterGuard } from '@app/auth/guard/recruiter.guard';

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
        path: 'digital-assets',
        canActivate: [AuthenticationGuard],
        loadChildren: () =>
          import('@app/scenes/digital-assets/digital-assets.module').then((m) => m.DigitalAssetsModule),
      },
      {
        path: 'about-us',
        loadChildren: () => import('@app/scenes/about-us/about-us.module').then((m) => m.AboutUsModule),
      },
      {
        path: 'our-process',
        loadChildren: () => import('@app/scenes/our-process/our-process.module').then((m) => m.OurProcessModule),
      },
      {
        path: 'our-partner',
        loadChildren: () => import('@app/scenes/our-partners/our-partners.module').then((m) => m.OurPartnersModule),
      },
      {
        path: 'testimonial',
        canActivate: [AuthenticationGuard],
        loadChildren: () => import('@app/scenes/testimonials/testimonials.module').then((m) => m.TestimonialsModule),
      },
      {
        path: 'notifications',
        canActivate: [AuthenticationGuard],
        loadChildren: () =>
          import('@app/scenes/all-notifications/all-notifications.module').then((m) => m.AllNotificationsModule),
      },
      {
        path: 'cart',
        canActivate: [AuthenticationGuard],
        loadChildren: () => import('@app/scenes/cart/cart.module').then((m) => m.CartModule),
      },
      {
        path: 'transaction',
        canActivate: [AuthenticationGuard],
        loadChildren: () => import('@app/scenes/transaction/transaction.module').then((m) => m.TransactionModule),
      },
      {
        path: 'verification',
        loadChildren: () => import('@app/scenes/verification/verification.module').then((m) => m.VerificationModule),
      },
      {
        path: 'news/:newsId',
        loadChildren: () => import('@app/scenes/news-view/news-view.module').then((m) => m.NewsViewModule),
      },
      {
        path: 'user/profile',
        canActivate: [AuthenticationGuard],
        loadChildren: () => import('@app/scenes/user-profile/user-profile.module').then((m) => m.UserProfileModule),
      },
      {
        path: 'user/course',
        canActivate: [AuthenticationGuard],
        loadChildren: () => import('@app/scenes/user-course/user-course.module').then((m) => m.UserCourseModule),
      },
      {
        path: 'user/fav-course',
        canActivate: [AuthenticationGuard],
        loadChildren: () =>
          import('@app/scenes/user-favorite-courses/user-favorite-courses.module').then(
            (m) => m.UserFavoriteCoursesModule
          ),
      },
      {
        path: 'user/saved-jobs',
        canActivate: [AuthenticationGuard],
        loadChildren: () =>
          import('@app/scenes/user-saved-jobs/user-saved-jobs.module').then((m) => m.UserSavedJobsModule),
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
      {
        path: 'admin/news',
        canActivate: [AuthenticationGuard, AdminGuard],
        loadChildren: () => import('@app/scenes/admin/news/news.module').then((m) => m.NewsModule),
      },
      {
        path: 'admin/lovs',
        canActivate: [AuthenticationGuard, AdminGuard],
        loadChildren: () => import('@app/scenes/admin/lov/lov.module').then((m) => m.LovModule),
      },
      {
        path: 'admin/organization',
        canActivate: [AuthenticationGuard, AdminGuard],
        loadChildren: () =>
          import('@app/scenes/admin/organization/organization.module').then((m) => m.OrganizationModule),
      },
      {
        path: 'recruiter',
        children: [
          {
            path: 'jobs',
            canActivate: [AuthenticationGuard, RecruiterGuard],
            loadChildren: () => import('@app/scenes/recruiter/jobs/jobs.module').then((m) => m.JobsModule),
          },
          {
            path: 'create-job',
            canActivate: [AuthenticationGuard, RecruiterGuard],
            loadChildren: () =>
              import('@app/scenes/recruiter/create-edit-job/create-edit-job.module').then((m) => m.CreateEditJobModule),
          },
        ],
      },
      {
        path: 'admin/jobs',
        canActivate: [AuthenticationGuard, AdminGuard],
        loadChildren: () => import('@app/scenes/admin/jobs-admin/jobs-admin.module').then((m) => m.JobsAdminModule),
      },
      {
        path: 'jobs/listings',
        canActivate: [AuthenticationGuard],
        loadChildren: () =>
          import('@app/scenes/all-job-listings/all-job-listings.module').then((m) => m.AllJobListingsModule),
      },
      {
        path: 'organization/:orgId',
        canActivate: [AuthenticationGuard],
        loadChildren: () =>
          import('@app/scenes/organization-view/organization-view.module').then((m) => m.OrganizationViewModule),
      },
      {
        path: 'job/:jobId',
        canActivate: [AuthenticationGuard],
        loadChildren: () => import('@app/scenes/job-view/job-view.module').then((m) => m.JobViewModule),
      },
      {
        path: 'group/:groupId',
        canActivate: [AuthenticationGuard],
        loadChildren: () => import('@app/scenes/group-view/group-view.module').then((m) => m.GroupViewModule),
      },
      {
        path: 'jobs/my-applications',
        canActivate: [AuthenticationGuard],
        loadChildren: () =>
          import('@app/scenes/my-job-applications/my-job-applications.module').then((m) => m.MyJobApplicationsModule),
      },
      {
        path: 'admin/partners',
        canActivate: [AuthenticationGuard],
        loadChildren: () => import('@app/scenes/admin/partners/partners.module').then((m) => m.PartnersModule),
      },
      {
        path: 'social-network',
        children: [
          {
            path: 'profile/:tasaId',
            canActivate: [AuthenticationGuard],
            loadChildren: () =>
              import('@app/scenes/social-network/profile/profile.module').then((m) => m.ProfileModule),
          },
          {
            path: 'posts',
            canActivate: [AuthenticationGuard],
            loadChildren: () =>
              import('@app/scenes/social-network/social-posts/social-posts.module').then((m) => m.SocialPostsModule),
          },
          {
            path: 'network',
            canActivate: [AuthenticationGuard],
            loadChildren: () =>
              import('@app/scenes/social-network/network/network.module').then((m) => m.NetworkModule),
          },
          {
            path: 'conversation',
            canActivate: [AuthenticationGuard],
            loadChildren: () =>
              import('@app/scenes/social-network/conversation/conversation.module').then((m) => m.ConversationModule),
          },
          {
            path: 'group',
            canActivate: [AuthenticationGuard],
            loadChildren: () => import('@app/scenes/social-network/group/group.module').then((m) => m.GroupModule),
          },
        ],
      },
      {
        path: 'freelance',
        children: [
          {
            path: 'create-gig',
            canActivate: [AuthenticationGuard],
            loadChildren: () =>
              import('@app/scenes/freelance/create-gig/create-gig.module').then((m) => m.CreateGigModule),
          },
          {
            path: 'gig/:gigId',
            canActivate: [AuthenticationGuard],
            loadChildren: () => import('@app/scenes/freelance/gig-view/gig-view.module').then((m) => m.GigViewModule),
          },
          {
            path: 'all-gigs',
            canActivate: [AuthenticationGuard],
            loadChildren: () => import('@app/scenes/freelance/all-gigs/all-gigs.module').then((m) => m.AllGigsModule),
          },
          {
            path: 'create-requirement',
            canActivate: [AuthenticationGuard],
            loadChildren: () =>
              import('@app/scenes/freelance/create-requirement/create-requirement.module').then(
                (m) => m.CreateRequirementModule
              ),
          },
          {
            path: 'requirement/:requirementId',
            canActivate: [AuthenticationGuard],
            loadChildren: () =>
              import('@app/scenes/freelance/requirement-view/requirement-view.module').then(
                (m) => m.RequirementViewModule
              ),
          },
        ],
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
