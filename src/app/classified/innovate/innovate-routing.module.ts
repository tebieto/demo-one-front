import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InnovateHomeComponent } from './innovate-home/innovate-home.component';
import { IdeasComponent } from './ideas/ideas.component';
import { MentorsComponent } from './mentors/mentors.component';
import { MenteesComponent } from './mentees/mentees.component';
import { InnovateComponent } from './innovate.component';

const routes: Routes = [
  {"path": '', component: InnovateComponent},
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
