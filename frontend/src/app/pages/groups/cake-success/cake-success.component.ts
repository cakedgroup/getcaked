import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cake-success',
  templateUrl: './cake-success.component.html',
  styleUrls: ['./cake-success.component.css']
})
export class CakeSuccessComponent implements OnInit {

  groupId: string;

  constructor(private route: ActivatedRoute) { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this.groupId = this.route.snapshot.params['groupId'];
  }

}
