import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupsRoutingModule } from './groups-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateComponent } from './create/create.component';
import { AdminComponent } from './admin/admin.component';
import { CakeInProgressComponent } from './cake-in-progress/cake-in-progress.component';
import { CakeSuccessComponent } from './cake-success/cake-success.component';
import { CakeFailureComponent } from './cake-failure/cake-failure.component';
import { CakechipComponent } from './cakechip/cakechip.component';
import { CommentBoardComponent } from './comment-board/comment-board.component';
import { CommentThreadComponent } from './comment-thread/comment-thread.component';
import { CakeGameComponent } from './cake-game/cake-game.component';
import { CommentInputComponent } from './comment-input/comment-input.component';


@NgModule({
  declarations: [
    OverviewComponent,
    CreateComponent,
    AdminComponent,
    CakeInProgressComponent,
    CakeSuccessComponent,
    CakeFailureComponent,
    CakechipComponent,
    CommentBoardComponent,
    CommentThreadComponent,
    CakeGameComponent,
    CommentInputComponent
  ],
  imports: [
    CommonModule,
    GroupsRoutingModule,
    SharedModule
  ]
})
export class GroupsModule { }
