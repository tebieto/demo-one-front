import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MentorHomeComponent } from './mentor-home/mentor-home.component';

const routes: Routes = [
  {"path": '', component: MentorHomeComponent},
  {"path": 'home', component: MentorHomeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MentorRoutingModule { }
