import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-searchchip',
  templateUrl: './searchchip.component.html',
  styleUrls: ['./searchchip.component.css']
})
export class SearchchipComponent implements OnInit {

  @Output() searchQueryChange = new EventEmitter<string>();
  
  searchQuery: string;

  constructor() { }
  
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
  }

  onInputChange() {
    this.searchQueryChange.emit(this.searchQuery);
  }

}
