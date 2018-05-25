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
import { HomeComponent } from './content/home/home.component';
import { AlertComponent } from './shared/alert/alert.component';
import { QueueComponent } from './content/home/queue/queue.component';
import { BrowseComponent } from './content/home/browse/browse.component';
import {UserDataService} from './content/user-data.service';

const appRoutes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full'},
  { path: 'index', component: IndexComponent},
  { path: 'signup', component: SignupComponent },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {path: '', redirectTo: 'browse', pathMatch: 'full' },
      {path: 'browse', component: BrowseComponent },
      {path: 'queue', component: QueueComponent },
    ]
  },
  {path: '**', component: IndexComponent}
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
    HomeComponent,
    AlertComponent,
    QueueComponent,
    BrowseComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAXra6wL8hINthUcIzU-DS5CaL2ei5Eu-A',
      libraries: ['geometry']
    }),
    NgbModule.forRoot(),
    CookieModule.forRoot(),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AuthorizationService, UserDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
