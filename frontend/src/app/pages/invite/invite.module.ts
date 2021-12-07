import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InviteRoutingModule } from './invite-routing.module';
import { InviteComponent } from './invite.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FailedComponent } from './failed/failed.component';


@NgModule({
  declarations: [
    InviteComponent,
    FailedComponent,
  ],
  imports: [
    CommonModule,
    InviteRoutingModule,
    SharedModule
  ]
})
export class InviteModule { }
