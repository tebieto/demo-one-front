import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommitteeRoutingModule } from './committee-routing.module';
import { CommitteeHomeComponent } from './committee-home/committee-home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewIdeaComponent } from './view-idea/view-idea.component';
import { CommitteeComponent } from './committee.component';
import { MenteeProfileComponent } from './mentee-profile/mentee-profile.component';

@NgModule({
  declarations: [
    CommitteeComponent,
    CommitteeHomeComponent,
    ViewIdeaComponent,
    MenteeProfileComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    CommitteeRoutingModule
  ],
  exports: [
    SharedModule,
    CommitteeComponent,
    CommitteeHomeComponent,
    ViewIdeaComponent
    
  ]
})
export class CommitteeModule { }
