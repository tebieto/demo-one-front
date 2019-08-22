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
import { RecoveryLinkComponent } from './authentication/recovery-link/recovery-link.component';
import { SpecialLoginComponent } from './authentication/special-login/special-login.component';

const routes: Routes = [
  {"path": '', component: WelcomeComponent},
  {"path": 'recover/password', component: RecoverPasswordComponent},
  {"path": 'password/forget/:email/:code', component: RecoveryLinkComponent},
  {"path": 'special/registration/:email/:role/:code', component: SpecialRegistrationComponent},
  {"path": 'special/login/:email/:role/:code', component: SpecialLoginComponent},
  {"path": 'login', component: UserLoginComponent},
  {"path": 'register', component: UserRegistrationComponent},
  {"path": 'user', loadChildren: './user/user.module#UserModule', data: { preload: true, delay: false },},
  {"path": 'admin', loadChildren: './admin/admin.module#AdminModule', data: { preload: false, delay: true },},
  {"path": 'owner', loadChildren: './owner/owner.module#OwnerModule', data: { preload: false, delay: true },},
  {"path": 'classified', component: ClassifiedComponent},
  {"path": 'judge', loadChildren: './classified/judge/judge.module#JudgeModule', data: { preload: true, delay: true },},
  {"path": 'investor', loadChildren: './classified/investor/investor.module#InvestorModule', data: { preload: true, delay: true },},
  {"path": 'mentor', loadChildren: './classified/mentor/mentor.module#MentorModule', data: { preload: true, delay: true },},
  {"path": 'mentee', loadChildren: './classified/mentee/mentee.module#MenteeModule', data: { preload: true, delay: true },},
  {"path": 'committee', loadChildren: './classified/committee/committee.module#CommitteeModule', data: { preload: true, delay: true },},
  {"path": '**', component:PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { 
    preloadingStrategy: CustomPreloadingStrategy}
    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
