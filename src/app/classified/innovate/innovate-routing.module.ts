import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InnovateHomeComponent } from './innovate-home/innovate-home.component';
import { IdeasComponent } from './ideas/ideas.component';
import { MentorsComponent } from './mentors/mentors.component';
import { MenteesComponent } from './mentees/mentees.component';

const routes: Routes = [
  {"path": 'admin', component: InnovateHomeComponent},
  {"path": 'ideas/:page', component: IdeasComponent},
  {"path": 'ideas/:page', component: IdeasComponent},
  {"path": 'mentors', component: MentorsComponent},
  {"path": 'mentees', component: MenteesComponent},
  {"path": 'mentees/:page', component: MenteesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InnovateRoutingModule { }
