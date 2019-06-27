import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MentorRoutingModule } from './mentor-routing.module';
import { MentorComponent } from './mentor.component';
import { MentorHomeComponent } from './mentor-home/mentor-home.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    MentorComponent,
    MentorHomeComponent,
  ],
  imports: [
    CommonModule,
    MentorRoutingModule,
    SharedModule,
  ],
  exports: [
    SharedModule,
    MentorComponent,
    MentorHomeComponent,
  ]
})
export class MentorModule { }
