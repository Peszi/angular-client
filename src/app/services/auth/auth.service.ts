import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import { BASIC_AUTH, BEARER_PREFIX, TOKEN_COOKIE } from '../../shared/globals';
import {CookieService} from 'ngx-cookie';
import {AuthResponse} from '../model/auth-response.model';
import {Router} from '@angular/router';
import {UserDataModel} from '../model/user-data.model';
import {AlertService} from '../alert.service';
import {environment} from '../../../environments/environment';

@Injectable()
export class AuthorizationService {

  public isLogged: boolean;
  public userData: UserDataModel;

  private accessToken: string;

  private authSubject = new Subject<boolean>();
  private userDataSubject = new Subject<UserDataModel>();

  constructor(private httpClient: HttpClient,
              private router: Router,
              private cookieService: CookieService,
              private alertService: AlertService) {}

  // Server status REQUEST
  getApiStatusRequest() {
    return this.httpClient.get(environment.API_URL + '/ping', { responseType: 'text', observe: 'body' });
  }

  // Check Credentials REQUEST
  getCredentialStatusRequest(name: string, value: string): Observable<string> {
    return this.httpClient.get(environment.API_URL + '/api/register/check/' + name + '/' + value, { responseType: 'text', observe: 'body' });
  }

  // Register REQUEST
  postRegisterRequest(userData: {email: string, nickname: string, password: string}): Observable<String> {
    const params = new HttpParams()
      .set('email', userData.email)
      .append('nickname', userData.nickname)
      .append('password', userData.password);
    return this.httpClient.post(environment.API_URL + '/api/register', params, {responseType: 'text', observe: 'body'});
  }

  // Login REQUEST
  postLoginRequest(userData: {email: string, password: string}) {
      const headers = new HttpHeaders()
      .set('Authorization', BASIC_AUTH)
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const body = new URLSearchParams();
      body.append('grant_type', 'password');
      body.append('username', userData.email);
      body.append('password', userData.password);
    const subject = new Subject<number>();
    this.httpClient.post<AuthResponse>(environment.API_URL + '/oauth/token', body.toString(), { observe: 'body', headers: headers })
      .subscribe(
        (authRes: AuthResponse) => {
            this.setupAccessToken(authRes);
          },
        (error) => { subject.error(error.error); },
      () => { subject.next(); subject.complete(); }
      );
    return subject;
  }

  // User Data REQUEST
  getUserDataRequest() {
    this.makeGetRequest<UserDataModel>('/user')
      .subscribe((userData: UserDataModel) => {
          this.userData = userData;
          this.userDataSubject.next(userData);
        },
        (error) => { console.log(error); }
      );
  }

  // Global POST REQUEST
  makePostRequest<T>(url: string, body?: any|null) {
    const token = this.getAccessToken();
    const headers = new HttpHeaders()
      .set('Authorization', BEARER_PREFIX + token);
    return this.httpClient.post<T>(environment.API_URL + '/api' + url, body, {observe: 'body', headers: headers});
  }

  makePostTextRequest(url: string, body?: any|null) {
    const token = this.getAccessToken();
    if (!token) { return null; }
    const headers = new HttpHeaders()
      .set('Authorization', BEARER_PREFIX + token);
    return this.httpClient.post(environment.API_URL + '/api' + url, body, {observe: 'body', headers: headers, responseType: 'text'});
  }

  // Global GET REQUEST
  makeGetRequest<T>(url: string, params?: any|null): Observable<T> {
    const token = this.getAccessToken();
    const headers = new HttpHeaders()
      .set('Authorization', BEARER_PREFIX + token);
    return this.httpClient.get<T>(environment.API_URL + '/api' + url, {observe: 'body', headers: headers, params: params});
  }

  // Global DELETE REQUEST
  makeDeleteRequest(url: string, params?: any|null) {
    const token = this.getAccessToken();
    const headers = new HttpHeaders()
      .set('Authorization', BEARER_PREFIX + token);
    return this.httpClient.delete(environment.API_URL + '/api' + url, {observe: 'body', headers: headers, params: params, responseType: 'text'});
  }

  // Setup token
  private setupAccessToken(authRes: AuthResponse) {
    // const expireDate = new Date(new Date().getTime() + (authRes.expires_in * 1000));
    // this.cookieService.put(TOKEN_COOKIE, authRes.access_token, {expires: expireDate});
    this.accessToken = authRes.access_token;
    this.postLoggedIn();
  }

  isAuthenticated() {
    const promise = new Promise((resolve, reject) => {
        const logged = this.hasAccessToken();
        resolve(logged);
      });
    return promise;
  }

  // Check Token
  hasAccessToken(): boolean {
    // if (this.cookieService.get(TOKEN_COOKIE)) {
    //   this.postLoggedIn();
    //   return true;
    // }
    // return false;
    return (this.accessToken ? true : false);
  }

  // Get token
  getAccessToken(): string {
    // const access_token = this.cookieService.get(TOKEN_COOKIE);
    // if (access_token) {
    //   return access_token;
    // } else { // Token expired
    //   if (this.isLogged) {
    //     this.alertService.showAlert({error: true, message: 'your session expired!'});
    //   }
    //   this.postLoggedOut();
    // }
    return this.accessToken;
  }

  // Remove Token
  revokeAccessToken() {
    if (this.hasAccessToken()) {
      // this.cookieService.remove(TOKEN_COOKIE);
      // if (this.isLogged) {
      //   this.alertService.showAlert({error: false, message: 'you successfully logged out!'});
      // }
      this.accessToken = null;
      this.postLoggedOut();
    }
  }

  private postLoggedIn() {
    this.getUserDataRequest();
    this.authSubject.next(true);
    this.isLogged = true;
    this.router.navigate(['../home']);
  }

  private postLoggedOut() {
    this.authSubject.next(false);
    this.isLogged = false;
    this.router.navigate(['/']); // TODO check
  }

  // Observables

  getAuthSub() { return this.authSubject.asObservable(); }

  getUserDataSub() { return this.userDataSubject.asObservable(); }

}
