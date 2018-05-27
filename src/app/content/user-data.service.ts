import { Injectable } from '@angular/core';
import {AuthorizationService} from '../auth/auth.service';
import {Observable, Subject} from 'rxjs';
import {RoomDetailsModel, RoomsDataListModel, UserDataModel} from './user-data.model';

@Injectable()
export class UserDataService {

  userData: UserDataModel;
  roomDetails: RoomDetailsModel;
  roomsList: RoomsDataListModel;

  private requestsSubject = new Subject<AlertMessage>();

  private userDataSubject = new Subject<UserDataModel>();
  private roomDetailsSubject = new Subject<RoomDetailsModel>();
  private roomsListSubject = new Subject<RoomsDataListModel>();

  constructor(private authService: AuthorizationService) { }

  // User details

  getUserDataRequest() {
    this.authService.makeGetRequest<UserDataModel>('/user')
      .subscribe(
        (userData: UserDataModel) => {
          console.log(userData);
            this.userData = userData;
            this.userDataSubject.next(userData);
            this.requestsSubject.next({error: false, message: 'User details refreshed!'});
          },
        (error) => {
            this.userDataSubject.error(error);
            this.requestsSubject.next({error: true, message: error.error.message});
          },
      );
  }

  getUserDataObserver(): Observable<UserDataModel> {
    return this.userDataSubject.asObservable();
  }

  getUserData() {
    return this.userData;
  }

  // Rooms list

  postNewRoomRequest() {
    this.authService.makePostRequest<String>('/room')
      .subscribe(
        () => {
            this.requestsSubject.next({ error: false, message: 'New room created!'});
            this.getRoomsList();
          },
        (error) => { this.requestsSubject.next({ error: true, message: error.error.message }); },
      );
  }

  getRoomsListRequest() {
    this.authService.makeGetRequest<RoomsDataListModel>('/rooms')
      .subscribe(
        (roomsList: RoomsDataListModel) => { this.roomsList = roomsList; this.roomsListSubject.next(roomsList); },
        (error) => { console.log(error); this.requestsSubject.next(error); this.roomsListSubject.error(error); },
      );
  }

  getRoomsListObserver(): Observable<RoomsDataListModel> {
    return this.roomsListSubject.asObservable();
  }

  getRoomsList() {
    return this.roomsList;
  }

  // Room details

  getUserRoomRequest() {
    this.authService.makeGetRequest<RoomDetailsModel>('/room')
      .subscribe(
        (roomDetails: RoomDetailsModel) => { this.roomDetails = roomDetails; this.roomDetailsSubject.next(roomDetails); },
        (error) => { console.log(error); this.requestsSubject.next(error); this.roomDetailsSubject.error(error); },
      );
  }

  getRoomDetailsObserver(): Observable<RoomDetailsModel> {
    return this.roomDetailsSubject.asObservable();
  }

  getRoomDetails() {
    return this.roomDetails;
  }

  // Requests

  getRequestsObserver() {
    return this.requestsSubject.asObservable();
  }
}

export interface AlertMessage {
  error: boolean;
  message: string;
}
