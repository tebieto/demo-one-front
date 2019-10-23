import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenteeHomeComponent } from './mentee-home/mentee-home.component';
import { MenteeDashComponent } from './mentee-dash/mentee-dash.component';
import { MentorProfileComponent } from './mentor-profile/mentor-profile.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { CertificateComponent } from './certificate/certificate.component';
import { MenteeReportComponent } from './mentee-report/mentee-report.component';
import { ViewIdeaComponent } from './view-idea/view-idea.component';

const routes: Routes = [
  {"path": '', component: MenteeDashComponent},
  {"path": 'main', component: MenteeHomeComponent},
  {"path": 'dashboard/:page', component: MenteeHomeComponent},
  {"path": 'home', component: MenteeDashComponent},
  {"path": 'view/profile', component: ViewProfileComponent},
  {"path": ':view/idea/:code', component: ViewIdeaComponent},
  {"path": 'edit/profile', component: EditProfileComponent},
  {"path": 'mentor-profile/:code', component: MentorProfileComponent},
  {"path": 'certificate', component: CertificateComponent},
  {"path": 'report/:page/:code', component: MenteeReportComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenteeRoutingModule { }
