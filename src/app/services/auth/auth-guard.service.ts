import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthorizationService} from './auth.service';
import {Injectable} from '@angular/core';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthorizationService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isAuthenticated()
      .then((authenticated: boolean) => {
          if (authenticated) {
            return true;
          } else {
            // this.router.navigate(['/']);
            return false;
          }
        });
  }

}
