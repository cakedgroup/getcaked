import {Component, Input, OnInit} from '@angular/core';
import {Comment} from '../../../models/comment.model';
import {AuthService} from '../../../core/services/auth.service';

@Component({
  selector: 'app-comment-thread',
  templateUrl: './comment-thread.component.html',
  styleUrls: ['./comment-thread.component.css']
})
export class CommentThreadComponent implements OnInit {

  @Input() comment: Comment
  @Input() layer: number

  isReplying: boolean = false;
  isLoggedIn: boolean = false;
  isExtended: boolean = true;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = (this.authService.getUser() !== null);
  }

  toggleReplying () {
    this.isReplying = !this.isReplying;
  }

  toggleExtended () {
    if (this.layer < 5) {
      this.isExtended = !this.isExtended;
    }
  }

}
