import {Component, Input, OnInit} from '@angular/core';
import {Comment} from '../../../models/Comment.model';

@Component({
  selector: 'app-comment-thread',
  templateUrl: './comment-thread.component.html',
  styleUrls: ['./comment-thread.component.css']
})
export class CommentThreadComponent implements OnInit {

  @Input() comment: Comment
  @Input() layer: number

  constructor() { }

  ngOnInit(): void {
  }

}
