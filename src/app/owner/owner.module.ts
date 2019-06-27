import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OwnerRoutingModule } from './owner-routing.module';
import { SharedModule } from '../shared/shared.module';
import { OwnerComponent } from './owner.component';
import { OwnerHomeComponent } from './owner-home/owner-home.component';
import { OwnerLoginComponent } from '../authentication/owner-login/owner-login.component';
import { OwnerRegistrationComponent } from '../authentication/owner-registration/owner-registration.component';

@NgModule({
  declarations: [
    OwnerComponent,
    OwnerHomeComponent,
    OwnerLoginComponent,
    OwnerRegistrationComponent
  ],
  imports: [
    CommonModule,
    OwnerRoutingModule,
    SharedModule
  ],
  exports: [
    SharedModule,
    OwnerComponent,
    OwnerHomeComponent,
    OwnerLoginComponent,
    OwnerRegistrationComponent

  ]
})
export class OwnerModule { }
