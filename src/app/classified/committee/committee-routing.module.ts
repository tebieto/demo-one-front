import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommitteeHomeComponent } from './committee-home/committee-home.component';
import { ViewIdeaComponent } from './view-idea/view-idea.component';

const routes: Routes = [
  {"path": '', component: CommitteeHomeComponent},
  {"path": 'home', component: CommitteeHomeComponent},
  {"path": ':page/:sub', component: CommitteeHomeComponent},
  {"path": ':view/idea/:id', component: ViewIdeaComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommitteeRoutingModule { }
