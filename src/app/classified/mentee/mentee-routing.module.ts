import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenteeHomeComponent } from './mentee-home/mentee-home.component';
import { MenteeDashComponent } from './mentee-dash/mentee-dash.component';
import { MentorProfileComponent } from './mentor-profile/mentor-profile.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

const routes: Routes = [
  {"path": '', component: MenteeDashComponent},
  {"path": 'main', component: MenteeHomeComponent},
  {"path": 'home', component: MenteeDashComponent},
  {"path": 'view/profile', component: ViewProfileComponent},
  {"path": 'edit/profile', component: EditProfileComponent},
  {"path": 'mentor-profile/:code', component: MentorProfileComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenteeRoutingModule { }
