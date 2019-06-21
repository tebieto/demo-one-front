import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { CustomPreloadingStrategy } from './custom-preloading-strategy';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  {"path": '', component: WelcomeComponent},
  {"path": 'admin', component: AdminComponent},
  {"path": '**', component:PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { 
    preloadingStrategy: CustomPreloadingStrategy}
    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
