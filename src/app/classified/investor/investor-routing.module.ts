import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvestorHomeComponent } from './investor-home/investor-home.component';

const routes: Routes = [
  {"path": '', component: InvestorHomeComponent},
  {"path": 'home', component: InvestorHomeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestorRoutingModule { }
