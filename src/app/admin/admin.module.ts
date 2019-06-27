import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AdminComponent } from './admin.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminLoginComponent } from '../authentication/admin-login/admin-login.component';
import { AdminRegistrationComponent } from '../authentication/admin-registration/admin-registration.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminHomeComponent,
    AdminLoginComponent,
    AdminRegistrationComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ],
  exports: [
    SharedModule,
    AdminComponent,
    AdminHomeComponent,
    AdminLoginComponent,
    AdminRegistrationComponent,
  ]
})
export class AdminModule { }
