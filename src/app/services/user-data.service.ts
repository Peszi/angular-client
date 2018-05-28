import { Injectable } from '@angular/core';
import {AuthorizationService} from './auth.service';
import {Observable, of, Subject} from 'rxjs';
import {RoomDetailsModel, RoomsDataListModel, UserDataModel} from './model/user-data.model';
import {catchError, map} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable()
export class UserDataService {
  public roomsListModel: RoomsDataListModel;

  private roomsListSubject = new Subject<RoomsDataListModel>();
  private requestsSubject = new Subject<AlertMessage>();

  constructor(private authService: AuthorizationService, private router: Router) { }

  getRoomsListRequest() {
    return this.authService.makeGetRequest<RoomsDataListModel>('/rooms')
      .subscribe(
        (roomsList: RoomsDataListModel) => {
            this.roomsListModel = roomsList;
            this.roomsListSubject.next(roomsList);
            if (roomsList.hasRoom) {
              this.router.navigate(['/home/queue']);
            }
        },
        () => { this.requestsSubject.next({ error: true, message: 'Cannot get rooms list!'}); }
      );
  }

  postNewRoomRequest(): Observable<String> {
    return this.authService.makePostRequest<String>('/room')
      .pipe(
        map(res => {
          this.getRoomsListRequest();
          this.requestsSubject.next({ error: false, message: 'New room created!'});
          return res;
        }),
        catchError(err => { // TODO need check !!!
          this.requestsSubject.next({ error: true, message: 'Room already exists!'});
          return of(err);
        })
      );
  }

  getRoomsListSub() { return this.roomsListSubject.asObservable(); }

  getRequestSub() { return this.requestsSubject.asObservable(); }

}

export interface AlertMessage {
  error: boolean;
  message: string;
}
