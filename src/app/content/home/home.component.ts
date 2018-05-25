import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AlertMessage, UserDataService} from '../user-data.service';
import {Subscription} from 'rxjs';
import {b, s} from '@angular/core/src/render3';
import {AlertComponent} from '../../shared/alert/alert.component';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {RouterEvent} from '@angular/router/src/events';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('alertMessenger') alert: AlertComponent;

  routesList: ActiveRoute[] = [{endpoint: 'Browse', active: false}, {endpoint: 'Queue', active: false}];

  private userDataSub: Subscription;

  constructor(private userDataService: UserDataService, private router: Router) { }

  ngOnInit() {
    this.setupActivatedRoute('');
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((data: RouterEvent) => data.url.substring(data.url.lastIndexOf('/') + 1))
      ).subscribe((route) => {
       this.setupActivatedRoute(route);
      }
    );
    this.userDataService.getUserDataRequest();
    this.userDataSub = this.userDataService.getRequestsObserver().subscribe(
      (alert: AlertMessage) => { this.alert.showAlert(alert.message, alert.error); }
      );
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

  getUsername() {
    if (this.userDataService.getUserData()) { return this.userDataService.getUserData().name; }
    return 'loading...';
  }

  getEmail() {
    if (this.userDataService.getUserData()) { return this.userDataService.getUserData().email; }
    return 'loading...';
  }
}

export interface ActiveRoute {
  endpoint: string;
  active: boolean;
}
