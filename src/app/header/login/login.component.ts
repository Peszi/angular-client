import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbDropdown} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthorizationService} from '../../services/auth.service';
import {AnimationEvent} from '@angular/animations';
import {BACKGROUND_SCROLL} from '../../shared/animations/background-scrolling.animation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [ BACKGROUND_SCROLL ]
})
export class LoginComponent implements OnInit {

  @ViewChild('loginDropdown') private loginDropdown: NgbDropdown;

  loginForm: FormGroup;
  errorMessage: String = '';
  loadingStatus: String = 'normal';

  constructor(private authService: AuthorizationService) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(20)])
    });
    this.loginForm.statusChanges.subscribe((status) => {
      if (status === 'VALID') {
        this.errorMessage = '';
      }
    });
  }

  onCheck() {
    if (!this.loginForm.valid) {
      if (!this.loginForm.get('email').valid && this.loginForm.get('email').touched) {
        this.errorMessage = 'Please enter a valid email!';
      } else if (!this.loginForm.get('password').valid && this.loginForm.get('password').touched) {
        this.errorMessage = 'Incorrect password! (6 to 20 chars)';
      }
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.sendLoginRequest();
    } else {
      this.onLoggingFail('Credentials cannot be empty!');
    }
  }

  onDiscard() {
    this.loginForm.reset();
    this.loginDropdown.close();
  }

  private sendLoginRequest() {
    this.loadingStatus = 'pending';
    this.authService.postLoginRequest({email: this.loginForm.value.email, password: this.loginForm.value.password})
      .subscribe(
        () => {},
        (error) => { this.onLoggingFail(error.error_description); },
        () => { this.onLoggingSuccess(); }
      );
  }

  private onLoggingSuccess() {
    this.loadingStatus = 'success';
    this.loginForm.reset();
    // TODO redirect
  }

  private onLoggingFail(message: String) {
    this.loadingStatus = 'fail';
    this.errorMessage = message;
    console.log(message);
  }

  onLoadingEnd(event: AnimationEvent) {
    if (this.loadingStatus === 'success' || this.loadingStatus === 'fail') {
      setTimeout(() => {
        this.loadingStatus = 'normal';
      }, 0);
    } else if (this.loadingStatus === 'normal') {} else {
      if (event.toState === 'pending') {
        setTimeout(() => {
          this.loadingStatus = 'pendingOn';
        }, 0);
      } else {
        setTimeout(() => {
          this.loadingStatus = 'pending';
        }, 0);
      }
    }
  }
}
