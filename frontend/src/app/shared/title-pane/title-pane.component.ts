import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-title-pane',
  templateUrl: './title-pane.component.html',
  styleUrls: ['./title-pane.component.css']
})
export class TitlePaneComponent implements OnInit {

  @Input() title: string;

  constructor() { }

  ngOnInit(): void {
  }

}
