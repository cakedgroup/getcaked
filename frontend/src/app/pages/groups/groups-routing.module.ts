import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { CakeFailureComponent } from './cake-failure/cake-failure.component';
import { CakeInProgressComponent } from './cake-in-progress/cake-in-progress.component';
import { CakeSuccessComponent } from './cake-success/cake-success.component';
import { CreateComponent } from './create/create.component';
import { OverviewComponent } from './overview/overview.component';

const routes: Routes = [
  {
    path: 'create',
    component: CreateComponent
  },
  {
    path: ':groupId/overview',
    component: OverviewComponent
  },
  {
    path: ':groupId/admin',
    component: AdminComponent
  },
  {
    path: ':groupId/cake-in-progress',
    component: CakeInProgressComponent
  },
  {
    path: ':groupId/cake-success',
    component: CakeSuccessComponent
  }, 
  {
    path: ':groupId/cake-failure',
    component: CakeFailureComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }
