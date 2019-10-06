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
