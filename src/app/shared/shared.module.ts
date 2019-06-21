import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import {MatIconModule, MatToolbarModule, MatButtonModule, MatCardModule} from '@angular/material';

@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule
  ],
  exports:[
    HeaderComponent,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule
  ],
})
export class SharedModule { }
