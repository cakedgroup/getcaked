import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import { ChipComponent } from './chip/chip.component';


@NgModule({
  declarations: [
    ChipComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ChipComponent
  ]
})
export class SharedModule {
}
