import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvestorRoutingModule } from './investor-routing.module';
import { InvestorComponent } from './investor.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { InvestorHomeComponent } from './investor-home/investor-home.component';

@NgModule({
  declarations: [
    InvestorComponent,
    InvestorHomeComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    InvestorRoutingModule
  ],
  exports: [
    SharedModule,
    InvestorComponent,
    InvestorHomeComponent,
    
  ]
})
export class InvestorModule { }
