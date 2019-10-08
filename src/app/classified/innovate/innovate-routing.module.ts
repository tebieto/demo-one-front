import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InnovateHomeComponent } from './innovate-home/innovate-home.component';
import { IdeasComponent } from './ideas/ideas.component';
import { MentorsComponent } from './mentors/mentors.component';
import { MenteesComponent } from './mentees/mentees.component';
import { InnovateComponent } from './innovate.component';
import { ViewIdeasComponent } from './ideas/view-ideas/view-ideas.component';
import { MentorProfileComponent } from './mentors/mentor-profile/mentor-profile.component';
import { MenteeProfileComponent } from './mentees/mentee-profile/mentee-profile.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { CommitteesComponent } from './committees/committees.component';
import { CommitteeProfileComponent } from './committees/committee-profile/committee-profile.component';

const routes: Routes = [
  {"path": '', component: InnovateComponent},
  {"path": 'admin', component: InnovateHomeComponent},
  {"path": 'ideas/:page', component: IdeasComponent},
  {"path": 'ideas/:page', component: IdeasComponent},
  {"path": 'mentors', component: MentorsComponent},
  {"path": 'mentees', component: MenteesComponent},
  {"path": 'committees', component: CommitteesComponent},
  {"path": 'mentees/:page', component: MenteesComponent},
  {"path": ':view/idea/:code', component: ViewIdeasComponent},
  {"path": 'mentor-profile/:code', component: MentorProfileComponent},
  {"path": 'mentee-profile/:code', component: MenteeProfileComponent},
  {"path": 'committee-profile/:code', component: CommitteeProfileComponent},
  {"path": 'admin/home', component: AdminHomeComponent},
  {"path": 'admin/:page/:sub', component: AdminHomeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InnovateRoutingModule { }
