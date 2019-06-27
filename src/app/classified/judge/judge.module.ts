import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JudgeRoutingModule } from './judge-routing.module';
import { JudgeComponent } from './judge.component';
import { JudgeHomeComponent } from './judge-home/judge-home.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    JudgeComponent,
    JudgeHomeComponent
  ],
  imports: [
    CommonModule,
    JudgeRoutingModule,
    SharedModule
  ],
  exports: [
    SharedModule,
    JudgeComponent,
    JudgeHomeComponent
  ]
})
export class JudgeModule { }
