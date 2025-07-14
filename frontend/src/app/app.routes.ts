import { Routes } from '@angular/router';
import { TalkListComponent } from './components/talk-list/talk-list.component';
import { LoginComponent } from './components/login/login.component';
import { PopularTalksComponent } from './components/popular-talks/popular-talks.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: TalkListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'talks', component: TalkListComponent },
  { path: 'popular', component: PopularTalksComponent },
  { path: '**', redirectTo: '' }
];
