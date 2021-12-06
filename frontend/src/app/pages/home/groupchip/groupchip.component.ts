import { Component, Input, OnInit } from '@angular/core';
import { Group } from 'src/app/models/group.model';

@Component({
  selector: 'app-groupchip',
  templateUrl: './groupchip.component.html',
  styleUrls: ['./groupchip.component.css']
})
export class GroupchipComponent implements OnInit {

  @Input() group: Group;

  constructor() { }

  ngOnInit(): void {
  }

}
