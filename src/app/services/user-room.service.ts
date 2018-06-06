import {Injectable} from '@angular/core';
import {AuthorizationService} from './auth/auth.service';
import {GameSettingsModel, RoomDetailsModel } from './model/user-data.model';
import {of, Subject} from 'rxjs';
import {AlertMessage} from './user-data.service';
import {catchError, map, tap} from 'rxjs/operators';
import {a} from '@angular/core/src/render3';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpParams} from '@angular/common/http';
import {AlertService} from './alert.service';
import {ZoneModel} from './game-data.service';

@Injectable()
export class UserRoomService {

  public roomDetails: RoomDetailsModel;

  private roomDetailsSubject = new Subject<RoomDetailsModel>();

  constructor(private authService: AuthorizationService,
              private alertService: AlertService,
              private router: Router) { }

  // User

  getRoomDetailsRequest() {
    this.authService.makeGetRequest<RoomDetailsModel>('/room')
      .subscribe(
        (roomDetails: RoomDetailsModel) => {
          if (roomDetails.started) {
            this.router.navigate(['../home/game']);
          } else {
            roomDetails.teamsList
              .forEach(team => {
                team.isMyTeam = (team.usersList.filter(user => user.id === this.authService.userData.id).length > 0);
              });
            this.roomDetails = roomDetails;
            this.roomDetails.isRoomHost = (this.authService.userData.id === roomDetails.hostId); // set host flag
            this.roomDetailsSubject.next(roomDetails);
          }
        },
        () => {
          this.router.navigate(['../home/browse']);
          this.alertService.showAlert({ error: true, message: 'Cannot get room details!'});
        }
      );
  }

  postJoinTeamRequest(teamId: number) {
    return this.authService.makePostTextRequest('/room/team/' + teamId)
      .pipe(
        map(res => {
          this.getRoomDetailsRequest();
          this.alertService.showAlert({ error: false, message: 'You have changed team!'});
          return res;
        }),
        catchError(err => {
          this.alertService.showAlert({ error: true, message: 'Cannot join this team!'});
          return of(err);
        })
      );
  }

  deleteLeaveRoomRequest() {
    return this.authService.makeDeleteRequest('/rooms')
      .pipe(
        map(res => {
          this.alertService.showAlert({ error: false, message: 'You left the room!'});
          this.router.navigate(['../home/browse']);
          return res;
        }),
        catchError(err => {
          this.alertService.showAlert({ error: true, message: 'Cannot leave this room!'});
          return of(err);
        })
      );
  }

  getRoomDetailsSub() { return this.roomDetailsSubject.asObservable(); }

  // Host

  postCreateTeamRequest(alias: string) {
    return this.authService.makePostTextRequest('/room/host/team/' + alias)
      .pipe(
        map(res => {
          this.getRoomDetailsRequest();
          this.alertService.showAlert({ error: false, message: 'New team created!'});
          return res;
        }),
        catchError(err => {
          this.alertService.showAlert({ error: true, message: 'Team already exists!'});
          return of(err);
        })
      );
  }

  deleteTeamRequest(teamId: number) {
    return this.authService.makeDeleteRequest('/room/host/team/' + teamId)
      .pipe(
        map(res => {
          this.getRoomDetailsRequest();
          this.alertService.showAlert({ error: false, message: 'Room removed!'});
          return res;
        }),
        catchError(err => {
          this.alertService.showAlert({ error: true, message: 'Cannot remove this room!'});
          return of(err);
        })
      );
  }

  deleteRoomRequest() {
    return this.authService.makeDeleteRequest('/room/host/delete')
      .pipe(
        map(res => {
          this.alertService.showAlert({ error: false, message: 'You successfully removed the room!'});
          this.router.navigate(['../home/browse']);
          return res;
        }),
        catchError(err => {
          this.alertService.showAlert({ error: true, message: 'Cannot remove this room!'});
          return of(err);
        })
      );
  }

  // Editing

  postGameSettingsRequest(gameSettings: GameSettingsModel) {
    const bodyParams = new HttpParams()
      .append('gameMode', String(gameSettings.gameMode))
      .append('zoneLat', String(gameSettings.lat))
      .append('zoneLng', String(gameSettings.lng))
      .append('zoneRadius', String(Math.floor(gameSettings.radius)));
    return this.authService.makePostTextRequest('/room/host/game', bodyParams)
      .pipe(
        map(res => {
          this.getRoomDetailsRequest();
          this.alertService.showAlert({ error: false, message: 'You have changed game settings!'});
          return res;
        }),
        catchError(err => {
          this.alertService.showAlert({ error: true, message: 'Cannot change game settings!'});
          return of(err);
        })
      );
  }

  postZoneChange(zone: ZoneModel) {
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
          this.alertService.showAlert({ error: true, message: 'Cannot change the zone!'});
          return of(err);
        })
      );
  }

  postModeChangeRequest(gameMode: number) {
    return this.authService.makePostTextRequest('/room/host/mode/' + gameMode)
      .pipe(
        map(res => {
          this.getRoomDetailsRequest();
          this.alertService.showAlert({ error: false, message: 'You have changed mode!'});
          return res;
        }),
        catchError(err => {
          this.alertService.showAlert({ error: true, message: 'Cannot change game mode!'});
          return of(err);
        })
      );
  }

  postGameStartRequest() {
    return this.authService.makePostTextRequest('/room/game')
      .pipe(
        map(res => {
          this.getRoomDetailsRequest();
          this.alertService.showAlert({ error: false, message: 'The game is started!'});
          return res;
        }),
        catchError(err => {
          this.alertService.showAlert({ error: true, message: 'Cannot start the game!'});
          return of(err);
        })
      );
  }

}
