import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {a} from '@angular/core/src/render3';
import {promise} from 'selenium-webdriver';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  registerForm: FormGroup;

  enableRegister: boolean;
  checkingEmail: boolean;
  checkingName: boolean;

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
    this.registerForm.get('email').statusChanges.subscribe(value => {
      this.checkingEmail = (value === 'PENDING');
    });
    // Listen NICK status
    this.registerForm.get('nickname').statusChanges.subscribe(value => {
      this.checkingName = (value === 'PENDING');
    });
  }

  onSubmit() {
    console.log(this.registerForm);
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
