import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomPreloadingStrategy } from './custom-preloading-strategy';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { UserLoginComponent } from './authentication/user-login/user-login.component';
import { UserRegistrationComponent } from './authentication/user-registration/user-registration.component';
import { SpecialRegistrationComponent } from './authentication/special-registration/special-registration.component';
import { RecoverPasswordComponent } from './authentication/recover-password/recover-password.component';
import { ClassifiedComponent } from './classified/classified.component';

const routes: Routes = [
  {"path": '', component: WelcomeComponent},
  {"path": 'recover/password', component: RecoverPasswordComponent},
  {"path": 'login', component: UserLoginComponent},
  {"path": 'register', component: UserRegistrationComponent},
  {"path": 'special/signup/:type/:email/:code', component: SpecialRegistrationComponent},
  {"path": 'user', loadChildren: './user/user.module#UserModule', data: { preload: true, delay: false },},
  {"path": 'admin', loadChildren: './admin/admin.module#AdminModule', data: { preload: true, delay: true },},
  {"path": 'owner', loadChildren: './owner/owner.module#OwnerModule', data: { preload: true, delay: true },},
  {"path": 'classified', component: ClassifiedComponent},
  {"path": 'judge', loadChildren: './classified/judge/judge.module#JudgeModule', data: { preload: true, delay: false },},
  {"path": 'investor', loadChildren: './classified/investor/investor.module#InvestorModule', data: { preload: true, delay: false },},
  {"path": 'mentor', loadChildren: './classified/mentor/mentor.module#MentorModule', data: { preload: true, delay: false },},
  {"path": 'mentee', loadChildren: './classified/mentee/mentee.module#MenteeModule', data: { preload: true, delay: false },},
  {"path": '**', component:PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { 
    preloadingStrategy: CustomPreloadingStrategy}
    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
