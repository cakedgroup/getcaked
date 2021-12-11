import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CakeEvent} from '../../../models/cake.model';

@Component({
  selector: 'app-cakechip-group',
  templateUrl: './cakechip.component.html',
  styleUrls: ['./cakechip.component.css']
})
export class CakechipComponent implements OnInit {

  @Input() cakeEvent: CakeEvent;
  @Input() isEditable: boolean;
  @Output() isClosedChanges = new EventEmitter<boolean>()

  selectedOption: string = '';

  constructor() { }

  ngOnInit(): void {
    this.selectedOption = this.cakeEvent.cakeDelivered? 'closed':'open';
  }

  onChange() {
    this.isClosedChanges.emit(this.selectedOption === 'closed');
  }
}
