import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DndDirective } from './dnd.directive';
import { AppComponent } from './app.component';
import { ProgressComponent } from './progress/progress.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports:      [ BrowserModule, FormsModule, NgbModule, Ng2ImgMaxModule, HttpClientModule, ],
  declarations: [ AppComponent, DndDirective, ProgressComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
