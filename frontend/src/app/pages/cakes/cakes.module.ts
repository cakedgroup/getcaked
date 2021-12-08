import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CakesRoutingModule } from './cakes-routing.module';
import { OverviewComponent } from './overview/overview.component';
import {SharedModule} from '../../shared/shared.module';
import {GroupsModule} from '../groups/groups.module';
import { CakechipComponent } from './cakechip/cakechip.component';


@NgModule({
  declarations: [
    OverviewComponent,
    CakechipComponent
  ],
  imports: [
    CommonModule,
    CakesRoutingModule,
    SharedModule,
    GroupsModule
  ]
})
export class CakesModule { }
