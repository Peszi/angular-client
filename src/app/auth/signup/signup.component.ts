import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {a} from '@angular/core/src/render3';
import {promise} from 'selenium-webdriver';
import {ErrorMessage} from "../../shared/form-error-handler.directive";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  emailErrors: ErrorMessage[] = [{error: 'required', message: 'Email is required!'},
                                  {error: 'email', message: 'Please enter a valid email!'},
                                  {error: 'emailInUse', message: 'Email already registered!'}];

  registerForm: FormGroup;

  enableRegister: boolean;
  checkingEmail: boolean;
  checkingName: boolean;

  emailError: string = '';

  emailControl: any;

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email], this.validateEmailNotTaken.bind(this)),
      'nickname': new FormControl(null, [Validators.required, Validators.minLength(3),
                                                                  Validators.maxLength(20)], this.validateNameNotTaken.bind(this)),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6),
                                                                  Validators.maxLength(20)]),
      'checkbox': new FormControl(null, [Validators.required, Validators.requiredTrue])
    });
    // Listen FORM status
    this.registerForm.statusChanges.subscribe((status) => {
      this.enableRegister = (status === 'VALID');
    });
    // Listen EMAIL status
    this.registerForm.get('email').statusChanges.subscribe(status => {
      this.checkingEmail = (status === 'PENDING');
      if (status === 'INVALID') {
        this.emailError = 'invalid';
      } else {
        this.emailError = '';
      }
    });
    // Listen NICK status
    this.registerForm.get('nickname').statusChanges.subscribe(status => {
      this.checkingName = (status === 'PENDING');
    });

    this.registerForm.get('email').statusChanges;
    // console.log(this.registerForm.get('email').errors);
    // console.log(this.emailControl);
  }

  onSubmit() {
    // console.log(this.registerForm);
    // console.log(this.emailControl);
  }

  validateEmailNotTaken(control: AbstractControl): Promise<any>|Observable<any> {
    const emailPromise = new Promise<any>((resolve) => {
      this.httpClient.get('http://localhost:8080/api/register/check/email/' + control.value, { responseType: 'text', observe: 'body' })
        .subscribe(
          res => { resolve(null); },
            error => { resolve({'emailInUse': true}); }
        );
    });
    return emailPromise;
  }

  validateNameNotTaken(control: AbstractControl): Promise<any>|Observable<any> {
    const nickPromise = new Promise<any>((resolve) => {
      this.httpClient.get('http://localhost:8080/api/register/check/name/' + control.value, { responseType: 'text', observe: 'body' })
        .subscribe(
          res => { resolve(null); },
          error => { resolve({'nameInUse': true}); }
        );
    });
    return nickPromise;
  }
}
