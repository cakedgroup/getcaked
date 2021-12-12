import { Component, OnInit } from '@angular/core';
import {Comment} from '../../../models/comment.model';
import {GroupService} from '../../../core/services/group.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-comment-board',
  templateUrl: './comment-board.component.html',
  styleUrls: ['./comment-board.component.css']
})
export class CommentBoardComponent implements OnInit {

  comments: Array<Comment>

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService
  ) { }

  ngOnInit(): void {
    let groupId = this.route.snapshot.params['groupId'];
    this.groupService.getComments(groupId)
      .subscribe(
        (comments: Comment[]) => {
          this.comments = comments;
        }
      )
  }

}
