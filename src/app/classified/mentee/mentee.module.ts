import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenteeRoutingModule } from './mentee-routing.module';
import { MenteeComponent } from './mentee.component';
import { MenteeHomeComponent } from './mentee-home/mentee-home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MenteeDashComponent } from './mentee-dash/mentee-dash.component';
import { MentorProfileComponent } from './mentor-profile/mentor-profile.component';

@NgModule({
  declarations: [
    MenteeComponent,
    MenteeHomeComponent,
    MenteeDashComponent,
    MentorProfileComponent
  ],
  imports: [
    CommonModule,
    MenteeRoutingModule,
    SharedModule
  ],
  exports: [
    SharedModule,
    MenteeComponent,
    MenteeHomeComponent,
    MenteeDashComponent,
    MentorProfileComponent
  ]
})
export class MenteeModule { }
