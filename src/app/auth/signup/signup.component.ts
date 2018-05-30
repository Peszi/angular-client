import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {ErrorMessage} from '../../shared/form-error.directive';
import {AuthorizationService} from '../../services/auth.service';
import {AnimationEvent} from '@angular/animations';
import {Router} from '@angular/router';
import {AlertComponent} from '../../shared/alert/alert.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  readonly emailErrors: ErrorMessage[] = [{error: 'required', message: 'Email is required!'},
                                          {error: 'email', message: 'Please enter a valid email!'},
                                          {error: 'emailInUse', message: 'Email already registered!'}];

  readonly nameErrors: ErrorMessage[] = [{error: 'required', message: 'Name is required!'},
                                          {error: 'minlength', message: 'Nickname is too short, at least 3 characters!'},
                                          {error: 'maxlength', message: 'Nickname is too long, at most 20 characters!'},
                                          {error: 'nameInUse', message: 'Name already taken!'}];

  readonly passwordErrors: ErrorMessage[] = [{error: 'required', message: 'Password is required!'},
                                              {error: 'minlength', message: 'Password is too short, at least 6 characters!'},
                                              {error: 'maxlength', message: 'Password is too long, at most 20 characters!'}];

  @ViewChild('alertDialog') alert: AlertComponent;

  registerForm: FormGroup;
  enableRegister: boolean;
  loadingStatus: String = 'normal';

  constructor(private authService: AuthorizationService, private router: Router) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email], this.validateEmailNotTaken.bind(this)),
      'nickname': new FormControl(null, [Validators.required, Validators.minLength(3),
                                                                  Validators.maxLength(20)], this.validateNameNotTaken.bind(this)),
      'password': new FormControl(null, [Validators.required, Validators.minLength(3),
                                                                  Validators.maxLength(20)]),
      'checkbox': new FormControl(null, [Validators.required, Validators.requiredTrue])
    });
    // Listen FORM statusMessage
    this.registerForm.statusChanges.subscribe((status) => {
      this.enableRegister = (status === 'VALID');
    });
  }

  onSubmit() {
    this.onSingingRequest();
    this.authService.postRegisterRequest({email: this.registerForm.value.email,
                                                nickname: this.registerForm.value.nickname,
                                                password: this.registerForm.value.password})
      .subscribe(
      next => {},
      error => { this.onSigningFail(error.error); },
        () => { this.onSigningSuccess(); }
    );
  }

  private onSingingRequest(): void {
    this.loadingStatus = 'pending';
  }

  private onSigningSuccess(): void {
    this.loadingStatus = 'success';
    this.registerForm.reset();
    this.alert.showSuccess('Successfully registered!');
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 2000);
  }

  private onSigningFail(error: string): void {
    this.loadingStatus = 'fail';
    this.alert.showError(error);
    console.log(error);
  }

  private validateEmailNotTaken(control: AbstractControl): Promise<any>|Observable<any> {
    const emailPromise = new Promise<any>((resolve) => {
      this.authService.getCredentialStatusRequest('email', control.value).subscribe(
          value => { resolve(null); },
            error => { resolve({'emailInUse': true}); }
        );
    });
    return emailPromise;
  }

  private validateNameNotTaken(control: AbstractControl): Promise<any>|Observable<any> {
    const nickPromise = new Promise<any>((resolve) => {
      this.authService.getCredentialStatusRequest('name', control.value).subscribe(
        value => { resolve(null); },
          error => { resolve({'nameInUse': true}); }
        );
    });
    return nickPromise;
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
