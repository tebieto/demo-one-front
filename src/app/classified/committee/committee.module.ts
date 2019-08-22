import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommitteeRoutingModule } from './committee-routing.module';
import { CommitteeHomeComponent } from './committee-home/committee-home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewIdeaComponent } from './view-idea/view-idea.component';

@NgModule({
  declarations: [
    CommitteeHomeComponent,
    ViewIdeaComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    CommitteeRoutingModule
  ],
  exports: [
    SharedModule,
    CommitteeHomeComponent,
    ViewIdeaComponent
    
  ]
})
export class CommitteeModule { }
