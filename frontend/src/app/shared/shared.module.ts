import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import { ChipComponent } from './chip/chip.component';
import { TitlePaneComponent } from './title-pane/title-pane.component';
import { BodyBlockComponent } from './body-block/body-block.component';
import { InputFieldComponent } from './input-field/input-field.component';
import { ActionButtonComponent } from './action-button/action-button.component';
import { SelectionInputComponent } from './selection-input/selection-input.component';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { BigButtonComponent } from './big-button/big-button.component';
import { SubHeaderComponent } from './sub-header/sub-header.component';
import { SuccessBadgeComponent } from './success-badge/success-badge.component';


@NgModule({
  declarations: [
    ChipComponent,
    TitlePaneComponent,
    BodyBlockComponent,
    InputFieldComponent,
    ActionButtonComponent,
    SelectionInputComponent,
    ErrorMessageComponent,
    BigButtonComponent,
    SubHeaderComponent,
    SuccessBadgeComponent,
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
    BodyBlockComponent,
    InputFieldComponent,
    ActionButtonComponent,
    SelectionInputComponent,
    ErrorMessageComponent,
    BigButtonComponent,
    SubHeaderComponent,
    SuccessBadgeComponent
  ]
})
export class SharedModule {
}
