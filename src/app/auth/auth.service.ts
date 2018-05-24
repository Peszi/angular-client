import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {BASE_API_URL, BASE_URL, BASIC_AUTH, BEARER_PREFIX, TOKEN_COOKIE} from '../shared/globals';
import {CookieService} from 'ngx-cookie';
import {AuthResponse} from './auth-response.model';
import {Router} from '@angular/router';

@Injectable()
export class AuthorizationService {

  private authSubject = new Subject<any>();

  constructor(private httpClient: HttpClient, private router: Router, private cookieService: CookieService) {}

  // Register
  postRegisterRequest(userData: {email: string, nickname: string, password: string}): Observable<String> {
    const params = new HttpParams()
      .set('email', userData.email)
      .append('nickname', userData.nickname)
      .append('password', userData.password);
    return this.httpClient.post(BASE_API_URL + '/register', params, {responseType: 'text', observe: 'body'});
  }

  getCredentialStatusRequest(name: string, value: string): Observable<string> {
    return this.httpClient.get(BASE_API_URL + '/register/check/' + name + '/' + value, { responseType: 'text', observe: 'body' });
  }

  // Login
  postLoginRequest(userData: {email: string, password: string}) {
    const headers = new HttpHeaders()
      .set('Authorization', BASIC_AUTH)
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const body = new URLSearchParams();
      body.append('grant_type', 'password');
      body.append('username', userData.email);
      body.append('password', userData.password);
    const subject = new Subject<number>();
    this.httpClient.post<AuthResponse>(BASE_URL + '/oauth/token', body.toString(), { observe: 'body', headers: headers })
      .subscribe(
        (authRes: AuthResponse) => {
            this.setupAccessToken(authRes);
          },
        (error) => { this.authSubject.error(''); subject.error(error.error); },
      () => { this.authSubject.next();  subject.next(); subject.complete(); }
      );
    return subject;
  }

  private setupAccessToken(authRes: AuthResponse) {
    const expireDate = new Date(new Date().getTime() + (authRes.expires_in * 1000));
    this.cookieService.put(TOKEN_COOKIE, authRes.access_token, {expires: expireDate});
    this.router.navigate(['/home']);
  }

  // Server status
  getApiStatusRequest() {
    return this.httpClient.get('http://localhost:8080/ping', { responseType: 'text', observe: 'body' });
  }

  // Check Token
  hasAccessToken(): boolean {
    return (this.cookieService.get(TOKEN_COOKIE) ? true : false);
  }

  // Get token
  getAccessToken(): string {
    const access_token = this.cookieService.get(TOKEN_COOKIE);
    if (access_token) {
      return access_token;
    } else {
      this.router.navigate(['/']); // TODO check
    }
  }

  // Remove Token
  revokeAccessToken() {
    if (this.hasAccessToken()) {
      this.cookieService.remove(TOKEN_COOKIE);
    }
  }

  getAuth(): Observable<any> {
    return this.authSubject.asObservable();
  }

  // Requests

  makePostRequest<T>(url: string, body?: any|null) {
    const headers = new HttpHeaders()
      .set('Authorization', BEARER_PREFIX + this.getAccessToken());
    return this.httpClient.post<T>(BASE_API_URL + url, body,{ observe: 'body', headers: headers });
  }

  makeGetRequest<T>(url: string, params?: any|null) {
    const headers = new HttpHeaders()
      .set('Authorization', BEARER_PREFIX + this.getAccessToken());
    return this.httpClient.get<T>(BASE_API_URL + url,{ observe: 'body', headers: headers, params: params });
  }

}
