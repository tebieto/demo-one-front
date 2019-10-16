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
import { MentorChatComponent } from './mentor-chat/mentor-chat.component';
import { EditProgramComponent } from './edit-program/edit-program.component';
import { MenteeReportComponent } from './mentee-report/mentee-report.component';
import { ViewIdeaComponent } from './view-idea/view-idea.component';

@NgModule({
  declarations: [
    MentorComponent,
    MentorHomeComponent,
    ViewProfileComponent,
    EditProfileComponent,
    SpecialSetupComponent,
    MenteeProfileComponent,
    MentorChatComponent,
    EditProgramComponent,
    MenteeReportComponent,
    ViewIdeaComponent,
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
    MenteeProfileComponent,
    MentorChatComponent
  ]
})
export class MentorModule { }
