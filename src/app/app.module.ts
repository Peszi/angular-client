import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
import { HeaderComponent } from './header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SignupComponent } from './auth/signup/signup.component';
import { IndexComponent } from './content/index/index.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationService } from './auth/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormErrorDirective } from './shared/form-error.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingButtonComponent } from './shared/loading-button/loading-button.component';
import { LoadingButtonDirective } from './shared/loading-button.directive';
import { PingIndicatorComponent } from './shared/ping/ping-indicator.component';
import { CookieModule } from 'ngx-cookie';
import { LoginComponent } from './header/login/login.component';
import { ManageComponent } from './header/manage/manage.component';
import { HomeComponent } from "./content/data/home/home.component";

const appRoutes: Routes = [
  { path: '', component: IndexComponent},
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SignupComponent,
    IndexComponent,
    FormErrorDirective,
    LoadingButtonComponent,
    LoadingButtonDirective,
    PingIndicatorComponent,
    LoginComponent,
    ManageComponent,
    HomeComponent
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
    CookieModule.forRoot(),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AuthorizationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
