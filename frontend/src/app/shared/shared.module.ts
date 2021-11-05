import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import { ChipComponent } from './chip/chip.component';
import { TitlePaneComponent } from './title-pane/title-pane.component';
import { BodyBlockComponent } from './body-block/body-block.component';


@NgModule({
  declarations: [
    ChipComponent,
    TitlePaneComponent,
    BodyBlockComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ChipComponent,
    TitlePaneComponent,
    BodyBlockComponent
  ]
})
export class SharedModule {
}
