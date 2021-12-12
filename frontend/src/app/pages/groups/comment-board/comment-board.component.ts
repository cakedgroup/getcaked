import { Component, OnInit } from '@angular/core';
import {Comment} from '../../../models/comment.model';
import {GroupService} from '../../../core/services/group.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-comment-board',
  templateUrl: './comment-board.component.html',
  styleUrls: ['./comment-board.component.css']
})
export class CommentBoardComponent implements OnInit {

  private groupId: string;

  comments: Array<Comment>

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupService: GroupService
  ) { }

  ngOnInit(): void {
    this.groupId = this.route.snapshot.params['groupId'];
    this.updateComments();
  }

  updateComments = () => {
    this.groupService.getComments(this.groupId)
    .subscribe(
      (comments: Comment[]) => {
        this.comments = comments;
      }, (err) => {
        if (err.status) this.router.navigate(['/404']);
      }
    )
  }

}
