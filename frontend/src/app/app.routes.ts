import { Routes } from '@angular/router';
import { TalkListComponent } from './components/talk-list/talk-list.component';
import { LoginComponent } from './components/login/login.component';
import { PopularTalksComponent } from './components/popular-talks/popular-talks.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { authGuard, mainAppGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: TalkListComponent, canActivate: [mainAppGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [authGuard] },
  { path: 'talks', component: TalkListComponent, canActivate: [mainAppGuard] },
  { path: 'popular', component: PopularTalksComponent, canActivate: [mainAppGuard] },
  { path: '**', redirectTo: '' }
];
