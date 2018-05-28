import {Injectable} from '@angular/core';
import {AuthorizationService} from './auth.service';
import {RoomDetailsModel} from './model/user-data.model';
import {of, Subject} from 'rxjs';
import {AlertMessage} from './user-data.service';
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class UserRoomService {
  public roomDetails: RoomDetailsModel;

  private roomDetailsSubject = new Subject<RoomDetailsModel>();
  private requestsSubject = new Subject<AlertMessage>();

  constructor(private authService: AuthorizationService) { }

  // User

  getRoomDetailsRequest() {
    this.authService.makeGetRequest<RoomDetailsModel>('/room')
      .subscribe(
        (roomDetails: RoomDetailsModel) => {
          this.roomDetails = roomDetails;
          this.roomDetails.isRoomHost = (this.authService.userData.id === roomDetails.hostId); // set host flag
          this.roomDetailsSubject.next(roomDetails);
        },
        () => { this.requestsSubject.next({ error: true, message: 'Cannot get room details!'}); }
      );
  }

  getRoomDetailsSub() { return this.roomDetailsSubject.asObservable(); }

  getRequestSub() { return this.requestsSubject.asObservable(); }

  // Host

  postCreateTeamRequest(alias: string) {
    return this.authService.makePostRequest<String>('/room/host/team/' + alias)
      .pipe(
        map(res => {
          this.getRoomDetailsRequest();
          this.requestsSubject.next({ error: false, message: 'New team created!'});
          return res;
        }),
        catchError(err => {
          this.requestsSubject.next({ error: true, message: 'Cannot add this room!'});
          return of(err);
        })
      );
  }
}
