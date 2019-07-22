import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenteeComponent } from './mentee.component';
import { MenteeHomeComponent } from './mentee-home/mentee-home.component';

const routes: Routes = [
  {"path": '', component: MenteeHomeComponent},
  {"path": 'home', component: MenteeHomeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenteeRoutingModule { }
