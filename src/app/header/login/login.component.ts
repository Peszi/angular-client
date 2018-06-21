import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbDropdown} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthorizationService} from '../../services/auth/auth.service';
import {AnimationEvent} from '@angular/animations';
import {BACKGROUND_SCROLL} from '../../shared/animations/background-scrolling.animation';
import {ProgressButtonComponent} from '../../shared/components/progress-button/progress-button.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild(ProgressButtonComponent) private progressBtn: ProgressButtonComponent;
  @ViewChild('loginDropdown') private loginDropdown: NgbDropdown;

  loginForm: FormGroup;
  errorMessage: String = '';

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

  onSubmit() {
    if (this.loginForm.valid) {
      this.sendLoginRequest();
    } else {
      if (!this.loginForm.get('email').valid && this.loginForm.get('email').touched) {
        this.errorMessage = 'Please enter a valid email!';
      } else if (!this.loginForm.get('password').valid && this.loginForm.get('password').touched) {
        this.errorMessage = 'Incorrect password! (6 to 20 chars)';
      } else {
        this.errorMessage = 'Credentials cannot be empty!';
      }
    }
  }

  onDiscard() {
    this.loginForm.reset();
    this.loginDropdown.close();
  }

  private sendLoginRequest() {
    this.authService.postLoginRequest({email: this.loginForm.value.email, password: this.loginForm.value.password})
      .subscribe(
        () => {},
        () => { this.onLoggingFail('Incorrect credentials!'); },
        () => { this.onLoggingSuccess(); }
      );
  }

  private onLoggingSuccess() {
    this.progressBtn.setSucceed();
    this.loginForm.reset();
  }

  private onLoggingFail(message: String) {
    this.progressBtn.setFailed();
    this.errorMessage = message;
  }

}
