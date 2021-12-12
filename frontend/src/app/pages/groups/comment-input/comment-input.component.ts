import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GroupService} from '../../../core/services/group.service';
import {AuthService} from '../../../core/services/auth.service';

@Component({
  selector: 'app-comment-input',
  templateUrl: './comment-input.component.html',
  styleUrls: ['./comment-input.component.css']
})
export class CommentInputComponent implements OnInit {

  @Input() parentId: string | null = null
  @Input() placeholder: string = "Comment"
  @Input() onSend: Function

  private groupId : string

  content: string = '';
  isLoggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = (this.authService.getUser() !== null);
    this.groupId = this.route.snapshot.params['groupId'];
  }

  send = () => {
    this.groupService.postComment(this.groupId, this.content, this.parentId)
      .subscribe(() => {
        this.onSend();
        this.content = '';
      })
  }

}
