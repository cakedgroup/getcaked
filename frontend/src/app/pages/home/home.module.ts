import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from './home-page/home-page.component';
import { GroupchipComponent } from './groupchip/groupchip.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SearchchipComponent } from './searchchip/searchchip.component';
import { FormsModule } from '@angular/forms';
import { AddChipComponent } from './add-chip/add-chip.component';


@NgModule({
  declarations: [
    HomePageComponent,
    GroupchipComponent,
    SearchchipComponent,
    AddChipComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class HomeModule { }
