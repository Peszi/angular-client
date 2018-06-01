import { Component, OnInit } from '@angular/core';
import {AuthorizationService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html'
})
export class IndexComponent implements OnInit {

  constructor(private authService: AuthorizationService, private router: Router) { }

  ngOnInit() {
    if (this.authService.isLogged) {
      this.router.navigate(['/home']);
    }
  }
}
