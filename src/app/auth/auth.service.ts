import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {BASE_API_URL, BASE_URL, BASIC_AUTH, TOKEN_COOKIE} from '../shared/globals';
import {CookieService} from 'ngx-cookie';
import {promise} from 'selenium-webdriver';
import {AuthResponse} from './auth-response.model';

@Injectable()
export class AuthorizationService {

  private authSubject = new Subject<any>();

  constructor(private httpClient: HttpClient, private cookieService: CookieService) {}

  // Utility

  getPing() {
    return this.httpClient.get('http://localhost:8080/ping', { responseType: 'text', observe: 'body' });
  }

  getCredentialStatus(name: string, value: string): Observable<string> {
    return this.httpClient.get(BASE_API_URL + '/register/check/' + name + '/' + value, { responseType: 'text', observe: 'body' });
  }

  // Register
  postUserRegister(userData: {email: string, nickname: string, password: string}): Observable<String> {
    const params = new HttpParams()
      .set('email', userData.email)
      .append('nickname', userData.nickname)
      .append('password', userData.password);
    return this.httpClient.post(BASE_API_URL + '/register', params, {responseType: 'text', observe: 'body'});
  }

  // Get Token
  hasToken(): boolean {
    return (this.cookieService.get(TOKEN_COOKIE) ? true : false);
  }

  // Login
  postUserLogin(userData: {email: string, password: string}) {
    const headers = new HttpHeaders()
      .set('Authorization', BASIC_AUTH)
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const body = new URLSearchParams();
      body.append('grant_type', 'password');
      body.append('username', userData.email);
      body.append('password', userData.password);
    this.httpClient.post<AuthResponse>(BASE_URL + '/oauth/token', body.toString(), { observe: 'body', headers: headers })
      .subscribe(
        (authRes: AuthResponse) => { this.setupAccessToken(authRes); },
        () => { this.authSubject.error(''); },
      () => { this.authSubject.next(); }
      );
  }

  private setupAccessToken(authRes: AuthResponse) {
    const expireDate = new Date(new Date().getTime() + (authRes.expires_in * 1000));
    this.cookieService.put(TOKEN_COOKIE, authRes.access_token, {expires: expireDate});
  }

  getAuth(): Observable<any> {
    return this.authSubject.asObservable();
  }


  // uploadPropertiesFile(files: FileList) {
  //
  //   const subject = new Subject<number>();
  //   this.httpClient.post('http://localhost:8080/api/properties/upload', formData, {
  //     observe: 'events',
  //     responseType: 'json',
  //     reportProgress: true
  //   })
  //     .subscribe(
  //       (event: HttpEvent<any>) => {
  //         this.getEventMessage(event, subject)
  //       },
  //       (error) => {
  //         subject.error(error);
  //       },
  //       () => {
  //         this.fileName = files[0].name;
  //         subject.complete();
  //         this.auditLogsList = [];
  //       }
  //     );
  //   return subject;
  // }

  // getProperties() {
  //   this.httpClient.get<Prop[]>('http://localhost:8080/api/properties', {observe: 'body', responseType: 'json'})
  //     .pipe(
  //       map((props) => {
  //           return this.toPropertiesList(props);
  //         }
  //       ))
  //     .subscribe(
  //       (properties) => {
  //         this.propertiesList = properties;
  //       }
  //     );
  // }
}
