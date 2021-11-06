import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {PageNotFoundComponent} from "./pages/page-not-found/page-not-found.component";
import {HeaderComponent} from "./core/header/header.component";
import {FooterComponent} from "./core/footer/footer.component";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import { LegalComponent } from './pages/legal/legal.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    LegalComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
