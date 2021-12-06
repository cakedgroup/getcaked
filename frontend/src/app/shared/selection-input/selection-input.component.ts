import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-selection-input',
  templateUrl: './selection-input.component.html',
  styleUrls: ['./selection-input.component.css']
})
export class SelectionInputComponent implements OnInit {

  @Input() options: string[];
  @Input() defaultOption: string;

  @Input() descriptor: string;

  @Output() selectedOptionChanges = new EventEmitter<string>();

  selectedOption: string = '';

  constructor() { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    if (this.defaultOption) {
      this.selectedOption = this.defaultOption;
      this.selectedOptionChanges.emit(this.defaultOption);
    }
  }

  onChange(value: string) {
    this.selectedOptionChanges.emit(value);
  }
}
