import { Routes } from '@angular/router';
import { TalkListComponent } from './components/talk-list/talk-list.component';
import { LoginComponent } from './components/login/login.component';
import { PopularTalksComponent } from './components/popular-talks/popular-talks.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { loginRequiredGuard, forcePasswordChangeGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: TalkListComponent, canActivate: [forcePasswordChangeGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [loginRequiredGuard] },
  { path: 'talks', component: TalkListComponent, canActivate: [forcePasswordChangeGuard] },
  { path: 'popular', component: PopularTalksComponent, canActivate: [forcePasswordChangeGuard] },
  { path: '**', redirectTo: '' }
];
