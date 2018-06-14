import {Component, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import { NavigationEnd, Router} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {RouterEvent} from '@angular/router/src/events';
import {AuthorizationService} from '../../services/auth/auth.service';
import {RefreshInterface} from './refresh.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {

  routesList: ActiveRoute[] = [{endpoint: 'Browse', active: false}, {endpoint: 'Queue', active: false}, {endpoint: 'Game', active: false}];

  private refreshHandler: any;
  private refreshChildInterface: RefreshInterface;

  constructor(private authService: AuthorizationService,
              private router: Router) { }

  ngOnInit() {
    this.setupActivatedRoute(this.router.url.substring(this.router.url.lastIndexOf('/') + 1));
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((data: RouterEvent) => this.parseEndpoint(data.url))
    ).subscribe((route) => {
        this.setupActivatedRoute(route);
      }
    );
    this.authService.getUserDataRequest();
    // Auto Refresh
    this.refreshHandler = setInterval(() => {
      this.onRefresh();
    }, 10000);
  }

  ngOnDestroy(): void {
    if (this.refreshHandler) {
      clearInterval(this.refreshHandler);
    }
  }

  onActivate(childComponent: RefreshInterface) {
    this.refreshChildInterface = childComponent;
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
    // if (matches === 0) {
    //   this.routesList
    //     .filter((router: ActiveRoute) => router.endpoint.toLowerCase() === 'browse')
    //     .forEach((router: ActiveRoute) => router.active = true);
    // }
  }

  onRefresh() {
    if (this.refreshChildInterface) {
      this.refreshChildInterface.onRefresh();
    }
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
