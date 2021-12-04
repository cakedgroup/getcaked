import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }
