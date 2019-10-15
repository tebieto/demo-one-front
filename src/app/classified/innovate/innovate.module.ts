import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InnovateRoutingModule } from './innovate-routing.module';
import { InnovateHomeComponent } from './innovate-home/innovate-home.component';
import { InnovateComponent } from './innovate.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MentorsComponent } from './mentors/mentors.component';
import { MenteesComponent } from './mentees/mentees.component';
import { IdeasComponent } from './ideas/ideas.component';
import { MentorProfileComponent } from './mentors/mentor-profile/mentor-profile.component';
import { MenteeProfileComponent } from './mentees/mentee-profile/mentee-profile.component';
import { ViewIdeasComponent } from './ideas/view-ideas/view-ideas.component';
import { MenteeReportComponent } from './mentees/mentee-report/mentee-report.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { CommitteesComponent } from './committees/committees.component';
import { CommitteeProfileComponent } from './committees/committee-profile/committee-profile.component';
import { MentorMenteesComponent } from './mentors/mentor-mentees/mentor-mentees.component';

@NgModule({
  declarations: [
    InnovateHomeComponent,
    InnovateComponent,
    MentorsComponent,
    MenteesComponent,
    IdeasComponent,
    MentorProfileComponent,
    MenteeProfileComponent,
    ViewIdeasComponent,
    MenteeReportComponent,
    AdminHomeComponent,
    CommitteesComponent,
    CommitteeProfileComponent,
    MentorMenteesComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    InnovateRoutingModule
  ],
  exports: [
    InnovateComponent,
    InnovateHomeComponent,
    SharedModule
  ]
})
export class InnovateModule { }
