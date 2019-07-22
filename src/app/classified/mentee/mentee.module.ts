import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenteeRoutingModule } from './mentee-routing.module';
import { MenteeComponent } from './mentee.component';
import { MenteeHomeComponent } from './mentee-home/mentee-home.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    MenteeComponent,
    MenteeHomeComponent
  ],
  imports: [
    CommonModule,
    MenteeRoutingModule,
    SharedModule
  ],
  exports: [
    SharedModule,
    MenteeComponent,
    MenteeHomeComponent
  ]
})
export class MenteeModule { }
