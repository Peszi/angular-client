import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {RoomDetailsModel, RoomsDataListModel, UserDataModel, UserDataService} from '../user-data.service';
import {Subscription} from 'rxjs';
import {s} from '@angular/core/src/render3';
import {AlertComponent} from '../../../shared/alert/alert.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  @ViewChild('alertMessenger') alert: AlertComponent;

  userData: UserDataModel;
  roomDetails: RoomDetailsModel;
  roomsList: RoomsDataListModel;

  private userDataSub: Subscription;
  private roomDetailsSub: Subscription;
  private roomsListSub: Subscription;

  constructor(private userDataService: UserDataService) { }

  ngOnInit() {
    this.userDataService.getUserDataRequest();
    this.userDataService.getRoomsListRequest();
    this.userDataSub = this.userDataService.getUserDataObserver().subscribe((userData: UserDataModel) => {
        this.userData = userData;
      });
    this.roomsListSub = this.userDataService.getRoomsListObserver().subscribe(
      (roomsList: RoomsDataListModel) => {
        if (roomsList.hasRoom) {
          this.userDataService.getUserRoomRequest();
        }
        this.roomsList = roomsList;
      }
    );
    this.roomDetailsSub = this.userDataService.getRoomDetailsObserver().subscribe(
      (roomDetails: RoomDetailsModel) => { this.roomDetails = roomDetails; }
    );
  }

  ngOnDestroy(): void {
    this.userDataSub.unsubscribe();
    this.roomDetailsSub.unsubscribe();
    this.roomsListSub.unsubscribe();
  }

  // Requests

  onReloadRoomsList() {
    this.userDataService.getRoomsListRequest();
  }

  onReloadUserRoom() {
    this.userDataService.getUserRoomRequest();
  }

  onCreateRoom() {
    this.userDataService.postNewRoomRequest()
      .subscribe(
        (res) => { console.log(res); },
        (error) => { this.alert.showError(error.error.message); }
      );
  }

  // Get Data getUserRoomRequest

  getUsername() {
    if (this.userData) { return this.userData.name; }
    return 'loading...';
  }

  getEmail() {
    if (this.userData) { return this.userData.email; }
    return 'loading...';
  }

  // Utility

  getRoomsCount() {
    if (this.roomsList) {
      return this.roomsList.roomsList.length;
    } else {
      return 'no rooms';
    }
  }

  getUsersCount(count: number): String {
    if (count === 0) {
      return 'no users';
    } else if (count === 1) {
      return '1 user';
    } else {
      return count + ' users';
    }
  }
}
