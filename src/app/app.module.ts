import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
import { HeaderComponent } from './header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SignupComponent } from './auth/signup/signup.component';
import { IndexComponent } from './content/index/index.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationService } from './services/auth/auth.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormErrorDirective } from './shared/form-error.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PingIndicatorComponent } from './shared/ping/ping-indicator.component';
import { CookieModule } from 'ngx-cookie';
import { LoginComponent } from './header/login/login.component';
import { ManageComponent } from './header/manage/manage.component';
import { HomeComponent } from './content/home/home.component';
import { AlertComponent } from './shared/alert/alert.component';
import { QueueComponent } from './content/home/queue/queue.component';
import { BrowseComponent } from './content/home/browse/browse.component';
import {UserDataService} from './services/user-data.service';
import {UserRoomService} from './services/user-room.service';
import {TimePickerComponent} from './shared/elements/time-picker.component';
import {ProgressButtonComponent} from './shared/elements/progress-button.component';
import {CountInputComponent} from './shared/elements/inputs/count-input/count-input.component';
import { TimeInputComponent } from './shared/elements/inputs/time-input/time-input.component';
import {AuthGuardService} from './services/auth/auth-guard.service';
import { ModeEditComponent } from './content/home/queue/mode-edit/mode-edit.component';
import {AlertService} from './services/alert.service';
import {ZoneControlComponent} from './content/home/queue/mode-edit/zone-controll/zone-control.component';
import { BattleRoyalComponent } from './content/home/queue/mode-edit/battle-royal/battle-royal.component';
import {RoomModeService} from './services/room-mode.service';

const appRoutes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full'},
  { path: 'index', component: IndexComponent},
  { path: 'signup', component: SignupComponent },
  {
    path: 'home',
    // canActivate: [AuthGuardService],
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
    PingIndicatorComponent,
    LoginComponent,
    ManageComponent,
    HomeComponent,
    AlertComponent,
    QueueComponent,
    BrowseComponent,
    TimePickerComponent,
    ProgressButtonComponent,
    CountInputComponent,
    TimeInputComponent,
    ModeEditComponent,
    ZoneControlComponent,
    BattleRoyalComponent
  ],
  imports: [
    FormsModule,
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
  providers: [
    AuthorizationService,
    AuthGuardService,
    UserDataService,
    UserRoomService,
    RoomModeService,
    AlertService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
