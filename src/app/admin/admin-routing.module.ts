import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';

const routes: Routes = [
  {"path": '', component: AdminComponent},
  {"path": 'home', component: AdminHomeComponent},
  {"path": ':page/:sub', component: AdminHomeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
