import { Component, OnInit } from '@angular/core';
import {AuthorizationService} from '../../auth/auth.service';
import {Router} from '@angular/router';
import {UserDataModel, UserDataService} from '../../content/data/user-data.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  username: String = 'loading..';

  constructor(private authService: AuthorizationService, private userDataService: UserDataService, private router: Router) { }

  ngOnInit() {
    this.userDataService.getUserDataObserver().subscribe(
      (userData: UserDataModel) => { this.username = userData.name; }
      );
  }

  onLogout() {
    this.authService.revokeAccessToken();
    this.router.navigate(['/']);
  }

}
