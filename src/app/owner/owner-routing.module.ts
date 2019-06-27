import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OwnerComponent } from './owner.component';
import { OwnerHomeComponent } from './owner-home/owner-home.component';

const routes: Routes = [
  {"path": '', component: OwnerComponent},
  {"path": 'home', component: OwnerHomeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OwnerRoutingModule { }
