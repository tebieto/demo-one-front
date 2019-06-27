import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UserComponent } from './user.component';
import { UserHomeComponent } from './user-home/user-home.component';

@NgModule({
  declarations: [
    UserComponent,
    UserHomeComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule
  ],
  exports: [
    SharedModule,
    UserComponent,
    UserHomeComponent,
  ]
})
export class UserModule { }
