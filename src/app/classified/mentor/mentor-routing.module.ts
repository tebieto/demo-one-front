import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MentorHomeComponent } from './mentor-home/mentor-home.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { SpecialSetupComponent } from './special-setup/special-setup.component';
import { MenteeProfileComponent } from './mentee-profile/mentee-profile.component';
import { MentorChatComponent } from './mentor-chat/mentor-chat.component';
import { EditProgramComponent } from './edit-program/edit-program.component';

const routes: Routes = [
  {"path": '', component: MentorHomeComponent},
  {"path": 'home', component: MentorHomeComponent},
  {"path": 'main', component: MentorChatComponent},
  {"path": 'view/profile/:code', component: ViewProfileComponent},
  {"path": 'edit/profile', component: EditProfileComponent},
  {"path": 'edit/programme', component: EditProgramComponent},
  {"path": 'quick/setup', component: SpecialSetupComponent}, 
  {"path": 'mentee-profile/:code', component: MenteeProfileComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MentorRoutingModule { }
