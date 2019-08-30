import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MentorRoutingModule } from './mentor-routing.module';
import { MentorComponent } from './mentor.component';
import { MentorHomeComponent } from './mentor-home/mentor-home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { SpecialSetupComponent } from './special-setup/special-setup.component';
import { MenteeProfileComponent } from './mentee-profile/mentee-profile.component';

@NgModule({
  declarations: [
    MentorComponent,
    MentorHomeComponent,
    ViewProfileComponent,
    EditProfileComponent,
    SpecialSetupComponent,
    MenteeProfileComponent,
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
    EditProfileComponent,
    ViewProfileComponent,
    SpecialSetupComponent,
    MenteeProfileComponent
  ]
})
export class MentorModule { }
