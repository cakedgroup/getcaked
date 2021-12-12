import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.css']
})
export class InputFieldComponent implements OnInit {

  @Output() userInputChange = new EventEmitter<string>();

  @Input() descriptor: string;
  @Input() placeholder: string;
  @Input() hideInput: boolean = false;
  @Input() onEnter: Function;

  @Input() isSendBox: boolean = false;

  userInput: string;
  isFocused: boolean;

  constructor() { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
  }

  onChange(userInput: string) {
    this.userInputChange.emit(userInput);
  }
}
