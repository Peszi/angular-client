import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AbstractControl} from '@angular/forms';
import {BASE_API_URL} from '../shared/globals';

@Injectable()
export class AuthorizationService {

  constructor(private httpClient: HttpClient) {}

  getPing() {
    return this.httpClient.get('http://localhost:8080/ping', { responseType: 'text', observe: 'body' });
  }

  getCredentialStatus(name: string, value: string): Observable<string> {
    return this.httpClient.get(BASE_API_URL + '/register/check/' + name + '/' + value, { responseType: 'text', observe: 'body' });
  }

  postUserRegister(userData: {email: string, nickname: string, password: string}): Observable<String> {
    const params = new HttpParams()
      .set('email', userData.email)
      .append('nickname', userData.nickname)
      .append('password', userData.password);
    return this.httpClient.post(BASE_API_URL + '/register', params, {responseType: 'text', observe: 'body'});
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
