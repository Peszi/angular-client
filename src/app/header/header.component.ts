import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {NgbDropdown} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthorizationService} from '../auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor(private authService: AuthorizationService, private router: Router) {}

  ngOnInit() {
    this.subscription = this.authService.getAuth().subscribe(
      () => {},
      () => {}
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  hasToken(): boolean {
    return this.authService.hasToken();
  }

}
