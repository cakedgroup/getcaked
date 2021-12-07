import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cake-failure',
  templateUrl: './cake-failure.component.html',
  styleUrls: ['./cake-failure.component.css']
})
export class CakeFailureComponent implements OnInit {

  groupId: string;

  constructor(private route: ActivatedRoute) { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this.groupId = this.route.snapshot.params['groupId'];
  }

}
