import {Injectable} from '@angular/core';
import {AuthorizationService} from './auth.service';
import {RoomDetailsModel, ZoneDataModel} from './model/user-data.model';
import {of, Subject} from 'rxjs';
import {AlertMessage} from './user-data.service';
import {catchError, map, tap} from 'rxjs/operators';
import {a} from '@angular/core/src/render3';
import {Router} from '@angular/router';
import {HttpParams} from '@angular/common/http';

@Injectable()
export class UserRoomService {
  public roomDetails: RoomDetailsModel;

  private roomDetailsSubject = new Subject<RoomDetailsModel>();
  private requestsSubject = new Subject<AlertMessage>();

  constructor(private authService: AuthorizationService, private router: Router) { }

  // User

  getRoomDetailsRequest() {
    this.authService.makeGetRequest<RoomDetailsModel>('/room')
      .subscribe(
        (roomDetails: RoomDetailsModel) => {
          roomDetails.teamsList
            .forEach(team => {
              team.isMyTeam = (team.usersList.filter(user => user.id === this.authService.userData.id).length > 0);
            });
          this.roomDetails = roomDetails;
          this.roomDetails.isRoomHost = (this.authService.userData.id === roomDetails.hostId); // set host flag
          this.roomDetailsSubject.next(roomDetails);
        },
        () => {
          this.router.navigate(['/browse']);
          this.requestsSubject.next({ error: true, message: 'Cannot get room details!'});
        }
      );
  }

  postJoinTeamRequest(teamId: number) {
    return this.authService.makePostTextRequest('/room/team/' + teamId)
      .pipe(
        map(res => {
          this.getRoomDetailsRequest();
          this.requestsSubject.next({ error: false, message: 'You have changed team!'});
          return res;
        }),
        catchError(err => {
          this.requestsSubject.next({ error: true, message: 'Cannot join this team!'});
          return of(err);
        })
      );
  }

  deleteLeaveRoomRequest() {
    return this.authService.makeDeleteRequest('/rooms')
      .pipe(
        map(res => {
          this.requestsSubject.next({ error: false, message: 'You left the room!'});
          this.router.navigate(['/browse']);
          return res;
        }),
        catchError(err => {
          this.requestsSubject.next({ error: true, message: 'Cannot leave this room!'});
          return of(err);
        })
      );
  }

  getRoomDetailsSub() { return this.roomDetailsSubject.asObservable(); }

  getRequestSub() { return this.requestsSubject.asObservable(); }

  // Host

  postCreateTeamRequest(alias: string) {
    return this.authService.makePostTextRequest('/room/host/team/' + alias)
      .pipe(
        map(res => {
          this.getRoomDetailsRequest();
          this.requestsSubject.next({ error: false, message: 'New team created!'});
          return res;
        }),
        catchError(err => {
          this.requestsSubject.next({ error: true, message: 'Team already exists!'});
          return of(err);
        })
      );
  }

  deleteTeamRequest(teamId: number) {
    return this.authService.makeDeleteRequest('/room/host/team/' + teamId)
      .pipe(
        map(res => {
          this.getRoomDetailsRequest();
          this.requestsSubject.next({ error: false, message: 'Room removed!'});
          return res;
        }),
        catchError(err => {
          this.requestsSubject.next({ error: true, message: 'Cannot remove this room!'});
          return of(err);
        })
      );
  }

  deleteRoomRequest() {
    return this.authService.makeDeleteRequest('/room/host/delete')
      .pipe(
        map(res => {
          this.requestsSubject.next({ error: false, message: 'You successfully removed the room!'});
          this.router.navigate(['/browse']);
          return res;
        }),
        catchError(err => {
          this.requestsSubject.next({ error: true, message: 'Cannot remove this room!'});
          return of(err);
        })
      );
  }

  // Editing

  postZoneChange(zone: ZoneDataModel) {
    const bodyParams = new HttpParams()
      .append('zoneLat', String(zone.lat))
      .append('zoneLng', String(zone.lng))
      .append('zoneRadius', String(Math.floor(zone.radius)));
    return this.authService.makePostTextRequest('/room/host/zone', bodyParams)
      .pipe(
        map(res => {
          this.getRoomDetailsRequest();
          return res;
        }),
        catchError(err => {
          this.requestsSubject.next({ error: true, message: 'Cannot change the zone!'});
          return of(err);
        })
      );
  }

}
