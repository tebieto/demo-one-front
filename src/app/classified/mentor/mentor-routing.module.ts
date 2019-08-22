import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MentorHomeComponent } from './mentor-home/mentor-home.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { SpecialSetupComponent } from './special-setup/special-setup.component';

const routes: Routes = [
  {"path": '', component: MentorHomeComponent},
  {"path": 'home', component: MentorHomeComponent},
  {"path": 'view/profile', component: ViewProfileComponent},
  {"path": 'edit/profile', component: EditProfileComponent},
  {"path": 'quick/setup', component: SpecialSetupComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MentorRoutingModule { }
