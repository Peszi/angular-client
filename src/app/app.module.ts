import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
import { HeaderComponent } from './header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './login/login.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthorizationService} from './auth/auth.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { FormErrorDirective } from './shared/form-error.directive';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { LoadingButtonComponent } from './shared/loading-button/loading-button.component';
import { LoadingButtonDirective } from './shared/loading-button.directive';

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signup', component: SignupComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SignupComponent,
    LoginComponent,
    FormErrorDirective,
    LoadingButtonComponent,
    LoadingButtonDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAXra6wL8hINthUcIzU-DS5CaL2ei5Eu-A'
    }),
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AuthorizationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
