import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {AlertMessage, UserDataService} from '../../services/user-data.service';
import {Subscription} from 'rxjs';
import {b, s} from '@angular/core/src/render3';
import {AlertComponent} from '../../shared/alert/alert.component';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {RouterEvent} from '@angular/router/src/events';
import {AuthorizationService} from '../../services/auth.service';
import {UserRoomService} from '../../services/user-room.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('alertMessenger') alert: AlertComponent;

  routesList: ActiveRoute[] = [{endpoint: 'Browse', active: false}, {endpoint: 'Queue', active: false}];

  private userDataSub: Subscription;

  constructor(private authService: AuthorizationService,
              private userDataService: UserDataService,
              private userRoomService: UserRoomService,
              private router: Router) { }

  ngOnInit() {
    this.setupActivatedRoute(this.router.url.substring(this.router.url.lastIndexOf('/') + 1));
    this.router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
        map((data: RouterEvent) => this.parseEndpoint(data.url))
      ).subscribe((route) => { this.setupActivatedRoute(route); }
    );
    this.authService.getUserDataRequest();
    this.userDataSub = this.userDataService.getRequestSub().subscribe(
      (alert: AlertMessage) => { this.alert.showAlert(alert.message, alert.error); }
      );
    this.userDataSub = this.userRoomService.getRequestSub().subscribe(
      (alert: AlertMessage) => { this.alert.showAlert(alert.message, alert.error); }
    );
  }

  private parseEndpoint(url: string) {
    return url.substring(url.lastIndexOf('/') + 1);
  }

  private setupActivatedRoute(currentRoute: string) {
    this.routesList
      .forEach((router: ActiveRoute) => router.active = (router.endpoint.toLowerCase() === currentRoute));
    const matches = this.routesList
      .filter((router: ActiveRoute) => router.endpoint.toLowerCase() === currentRoute)
      .length;
    if (matches === 0) {
      this.routesList
        .filter((router: ActiveRoute) => router.endpoint.toLowerCase() === 'browse')
        .forEach((router: ActiveRoute) => router.active = true);
    }
  }

  ngOnDestroy(): void {
    this.userDataSub.unsubscribe();
  }

  onRefresh() {
    // TODO pass event to child components
    this.authService.getUserDataRequest();
    this.userDataService.getRoomsListRequest();
    this.userRoomService.getRoomDetailsRequest();
  }

  getUsername() {
    if (this.authService.userData) { return this.authService.userData.name; }
    return 'loading...';
  }

  getEmail() {
    if (this.authService.userData) { return this.authService.userData.email; }
    return 'loading...';
  }
}

export interface ActiveRoute {
  endpoint: string;
  active: boolean;
}
