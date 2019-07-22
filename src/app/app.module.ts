import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CustomPreloadingStrategy } from './custom-preloading-strategy';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { WelcomeHeaderComponent } from './welcome-header/welcome-header.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { UserRegistrationComponent } from './authentication/user-registration/user-registration.component';
import { UserLoginComponent } from './authentication/user-login/user-login.component';
import { SpecialRegistrationComponent } from './authentication/special-registration/special-registration.component';
import { RecoverPasswordComponent } from './authentication/recover-password/recover-password.component';
import { ClassifiedComponent } from './classified/classified.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    WelcomeHeaderComponent,
    WelcomeComponent,
    AuthenticationComponent,
    UserRegistrationComponent,
    UserLoginComponent,
    SpecialRegistrationComponent,
    RecoverPasswordComponent,
    ClassifiedComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpModule,
    SharedModule
  ],
  exports: [
    SharedModule
  ],
  providers: [CustomPreloadingStrategy],
  bootstrap: [AppComponent]
})
export class AppModule { }
