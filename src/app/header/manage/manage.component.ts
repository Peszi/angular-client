import { Component, OnInit } from '@angular/core';
import {AuthorizationService} from "../../auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  constructor(private authService: AuthorizationService, private router: Router) { }

  ngOnInit() {
  }

  onLogout() {
    this.authService.revokeToken();
    this.router.navigate(['/']);
  }

}
