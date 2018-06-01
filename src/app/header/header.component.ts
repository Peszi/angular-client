import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {NgbDropdown} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthorizationService} from '../services/auth/auth.service';
import {Subscription} from 'rxjs';
import {b, s} from '@angular/core/src/render3';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isLogged: boolean;
  authSub: Subscription;

  constructor(private authService: AuthorizationService) { }

  ngOnInit() {
    this.isLogged = this.authService.hasAccessToken();
    this.authSub = this.authService.getAuthSub()
      .subscribe((status: boolean) => {
        this.isLogged = status;
      });
  }

  ngOnDestroy(): void {

  }

}
