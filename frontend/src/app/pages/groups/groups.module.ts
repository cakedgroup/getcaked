import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupsRoutingModule } from './groups-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateComponent } from './create/create.component';
import { AdminComponent } from './admin/admin.component';


@NgModule({
  declarations: [
    OverviewComponent,
    CreateComponent,
    AdminComponent
  ],
  imports: [
    CommonModule,
    GroupsRoutingModule,
    SharedModule
  ]
})
export class GroupsModule { }
