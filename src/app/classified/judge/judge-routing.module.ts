import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JudgeHomeComponent } from './judge-home/judge-home.component';

const routes: Routes = [
  {"path": 'home', component: JudgeHomeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JudgeRoutingModule { }
