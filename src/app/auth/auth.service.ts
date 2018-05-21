import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AuthorizationService {

  constructor(private httpClient: HttpClient) {
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
