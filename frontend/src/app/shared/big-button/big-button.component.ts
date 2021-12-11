import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-big-button',
  templateUrl: './big-button.component.html',
  styleUrls: ['./big-button.component.css']
})
export class BigButtonComponent implements OnInit {

  @Input() content: string;
  @Input() onClick: Function;

  constructor() { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    if (!this.onClick) this.onClick = () => {}
  }

}
