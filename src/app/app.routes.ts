import { Routes } from '@angular/router';
import { JobDashboardComponent } from './pages/job-dashboard/job-dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { authRouteGuard } from './guards/auth-route.guard';
import { redirectLegacyGuard } from './guards/redirect-legacy.guard';
import { CvDetailsComponent } from './pages/cv-details/cv-details.component';
import { DetailsViewComponent } from './pages/cv-details/details-view/details-view.component';
import { ShortViewComponent } from './pages/cv-details/short-view/short-view.component';
import { UrlNotFoundComponent } from './pages/url-not-found/url-not-found.component';
import { CreditComponent } from './pages/credit/credit.component';
import { NotificationComponent } from './pages/notification/notification.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [redirectLegacyGuard],
  },
  {
    path: 'notification',
    component: NotificationComponent,
    // canActivate: [redirectLegacyGuard],
  },

  {
    path: 'credit-system',
    component: CreditComponent,
    canActivate: [authRouteGuard],
  },
  {
    path: 'dashboard',
    component: JobDashboardComponent,
    canActivate: [authRouteGuard],
  },
  {
    path: 'cvdetails',
    component: CvDetailsComponent,
    // canActivate: [authRouteGuard],
    children: [
      // {
      //   path: '',
      //   redirectTo: 'details-view',
      //   canActivate: [authRouteGuard],
      //   pathMatch: 'full',
      // },
      {
        path: 'details-view',
        // canActivate: [authRouteGuard],
        component: DetailsViewComponent,
      },
      {
        path: 'short-view',
        component: ShortViewComponent,
        // canActivate: [authRouteGuard],
      },
    ],
  },
  {
    path: '**',
    component: UrlNotFoundComponent,
  },
];
