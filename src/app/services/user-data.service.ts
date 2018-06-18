import { Injectable } from '@angular/core';
import {AuthorizationService} from './auth/auth.service';
import {Observable, of, Subject} from 'rxjs';
import {RoomDetailsModel, RoomsDataListModel, UserDataModel} from './model/user-data.model';
import {catchError, map} from 'rxjs/operators';
import { Router } from '@angular/router';
import {AlertService} from './alert.service';

@Injectable()
export class UserDataService {

  public roomsListModel: RoomsDataListModel;

  private roomsListSubject = new Subject<RoomsDataListModel>();

  constructor(private authService: AuthorizationService,
              private alertService: AlertService,
              private router: Router) { }

  getUserDataRequest() {
    this.getUserDataRequest();
  }

  getRoomsListRequest() {
    return this.authService.makeGetRequest<RoomsDataListModel>('/rooms')
      .subscribe(
        (roomsList: RoomsDataListModel) => {
            this.roomsListModel = roomsList;
            this.roomsListSubject.next(roomsList);
            if (roomsList.hasRoom) {
              this.router.navigate(['../home/queue']);
            }
        },
        () => {
          // this.alertService.showAlert({ error: true, message: 'Cannot get rooms list!'});
          console.log('redir to ../')
          this.router.navigate(['../']);
        }
      );
  }

  postNewRoomRequest() {
    return this.authService.makePostTextRequest('/room')
      .pipe(
        map(res => {
          this.getRoomsListRequest();
          this.alertService.showAlert({ error: false, message: 'New room created!'});
          return res;
        }),
        catchError(err => {
          this.alertService.showAlert({ error: true, message: 'Room already exists!'});
          return of(err);
        })
      );
  }

  postJoinRoomRequest(roomId: number) {
    return this.authService.makePostTextRequest('/rooms/' + roomId)
      .pipe(
        map(res => {
          this.getRoomsListRequest();
          this.alertService.showAlert({ error: false, message: 'You joined to the room!'});
          return res;
        }),
        catchError(err => {
          this.alertService.showAlert({ error: true, message: 'Cannot join to this room!'});
          return of(err);
        })
      );
  }

  getRoomsListSub() { return this.roomsListSubject.asObservable(); }

}

export interface AlertMessage {
  error: boolean;
  message: string;
}
