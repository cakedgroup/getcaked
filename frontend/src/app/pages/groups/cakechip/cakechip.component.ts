import {Component, Input, OnInit} from '@angular/core';
import {CakeEvent} from '../../../models/cake.model';

@Component({
  selector: 'app-cakechip-group',
  templateUrl: './cakechip.component.html',
  styleUrls: ['./cakechip.component.css']
})
export class CakechipComponent implements OnInit {

  @Input() cakeEvent: CakeEvent;

  constructor() { }

  ngOnInit(): void {
  }

}
