import { Injectable } from '@angular/core';
import {AuthorizationService} from '../../auth/auth.service';
import {Observable, of, Subject} from 'rxjs';
import {e} from '@angular/core/src/render3';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private userDataSubject = new Subject<UserDataModel>();
  private roomDetailsSubject = new Subject<RoomDetailsModel>();
  private roomsListSubject = new Subject<RoomsDataListModel>();

  constructor(private authService: AuthorizationService) { }

  getUserDataRequest() {
    this.authService.makeGetRequest<UserDataModel>('/user')
      .subscribe(
        (userData: UserDataModel) => { this.userDataSubject.next(userData); },
        (error) => { console.log(error); this.userDataSubject.error(error); },
      );
  }

  postNewRoomRequest() {
    return this.authService.makePostRequest<String>('/room');
  }

  getUserRoomRequest() {
    this.authService.makeGetRequest<RoomDetailsModel>('/room')
      .subscribe(
        (roomDetails: RoomDetailsModel) => { this.roomDetailsSubject.next(roomDetails); },
        (error) => { console.log(error); this.roomDetailsSubject.error(error); },
      );
  }

  getRoomsListRequest() {
    this.authService.makeGetRequest<RoomsDataListModel>('/rooms')
      .subscribe(
        (roomsList: RoomsDataListModel) => { this.roomsListSubject.next(roomsList); },
        (error) => { console.log(error); this.roomsListSubject.error(error); },
      );
  }

  getUserDataObserver(): Observable<UserDataModel> {
    return this.userDataSubject.asObservable();
  }

  getRoomDetailsObserver(): Observable<RoomDetailsModel> {
    return this.roomDetailsSubject.asObservable();
  }

  getRoomsListObserver(): Observable<RoomsDataListModel> {
    return this.roomsListSubject.asObservable();
  }
}

export interface UserDataModel {
  id: number;
  name: string;
  email: string;
}

export interface RoomDataModel {
  id: number;
  hostId: number;
  hostName: string;
  started: false;
  teamsCount: number;
}

export interface UserModel {
  id: number;
  name: string;
}

export interface TeamsListModel {
  alias: string;
  id: number;
  usersList: UserModel[];
}

export interface RoomDetailsModel extends RoomDataModel {
  teamsList: TeamsListModel;
}


export interface RoomsDataListModel {
  hasRoom: boolean;
  roomsList: RoomDataModel[];
}
