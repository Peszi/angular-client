import {RoomDetailsModel} from './model/user-data.model';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AuthorizationService} from './auth/auth.service';
import {AlertMessage} from './user-data.service';
import {of, Subject} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {HttpParams} from '@angular/common/http';
import {AlertService} from './alert.service';

@Injectable()
export class RoomModeService {

  public roomZoneControl: ZoneControlModel;

  private zoneControlSubject = new Subject<ZoneControlModel>();

  constructor(private authService: AuthorizationService,
              private alertService: AlertService) { }

  getZoneControlRequest() {
    this.authService.makeGetRequest<ZoneControlModel>('/room/zoneControl')
      .subscribe(
        (zoneControl: ZoneControlModel) => {
          this.roomZoneControl = zoneControl;
          this.zoneControlSubject.next(zoneControl);
        },
        () => {
          this.alertService.showAlert({ error: true, message: 'Cannot get zone control details!'});
        }
      );
  }

  getZoneControlSub() {
    return this.zoneControlSubject.asObservable();
  }

  postZoneControlRequest(zoneControl: ZoneControlModel) {
    const bodyParams = new HttpParams()
      .append('timeLimit', String(zoneControl.timeLimit))
      .append('pointsLimit', String(zoneControl.pointsLimit))
      .append('zoneCapacity', String(zoneControl.zoneCapacity));
    return this.authService.makePostTextRequest('/room/host/zoneControl', bodyParams)
      .pipe(
        map(res => {
          this.getZoneControlRequest();
          this.alertService.showAlert({ error: false, message: 'You have changed params!'});
          return res;
        }),
        catchError(err => {
          this.alertService.showAlert({ error: true, message: 'Cannot change params!'});
          return of(err);
        })
      );
  }

}

export interface ZoneControlModel {
  pointsLimit: number; timeLimit: number; zoneCapacity: number;
}
