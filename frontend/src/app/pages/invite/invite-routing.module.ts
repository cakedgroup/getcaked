import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FailedComponent } from './failed/failed.component';
import { InviteComponent } from './invite.component';

const routes: Routes = [
  {
    path: 'failed',
    component: FailedComponent
  },
  { 
    path: ':inviteToken', 
    component: InviteComponent 
  },
  {
    path: '',
    redirectTo: '/404'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InviteRoutingModule { }
