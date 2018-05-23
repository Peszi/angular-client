import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbDropdown} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthorizationService} from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('loginDropdown') private loginDropdown: NgbDropdown;

  loginForm: FormGroup;
  enableLogin: boolean;

  constructor(private authService: AuthorizationService, private router: Router) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(20)])
    });
    this.loginForm.statusChanges.subscribe((status) => {
      this.enableLogin = (status === 'VALID');
    });
  }

  onSubmit() {
    this.authService.postUserLogin({email: this.loginForm.value.email, password: this.loginForm.value.password});
  }

  onDiscard() {
    this.loginDropdown.close();
  }
}
