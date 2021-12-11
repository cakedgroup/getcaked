import { Component, OnInit } from '@angular/core';
import {Comment} from '../../../models/Comment.model';

@Component({
  selector: 'app-comment-board',
  templateUrl: './comment-board.component.html',
  styleUrls: ['./comment-board.component.css']
})
export class CommentBoardComponent implements OnInit {

  comments: Array<Comment>

  constructor() { }

  ngOnInit(): void {
    this.comments = [
      {
        content: "comment1",
        replies: [
          {
            content: "comment1.1",
            replies: [
              {
                content: "comment1.1.1",
                replies: [
                  {
                    content: "comment1.1.1.1",
                    replies: [
                      {
                        content: "comment1.1.1.1.1",
                        replies: [
                          {
                            content: "comment1.1.1.1.1.1",
                            replies: [

                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        content: "comment2",
        replies:[]
      }
    ]
  }

}
