import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { LoginGuard } from './core/guards/login.guard';
import { LegalComponent } from './pages/legal/legal.component';
import {PageNotFoundComponent} from "./pages/page-not-found/page-not-found.component";

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'group',
    loadChildren: () => import('./pages/groups/groups.module').then(m => m.GroupsModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'join',
    canActivate: [LoginGuard],
    loadChildren: () => import('./pages/invite/invite.module').then(m => m.InviteModule),
  },
  {
    path: 'cakes',
    loadChildren: () => import('./pages/cakes/cakes.module').then(m => m.CakesModule)
  },
  {
    path: 'legal',
    component: LegalComponent
  },
  {
    path: '404',
    component: PageNotFoundComponent
  },
  { 
    path: 'settings', 
    canActivate: [LoginGuard],
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsModule) 
  },
  {
    path: '**',
    redirectTo: '404'
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
