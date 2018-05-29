import {
  AfterContentInit,
  AfterViewChecked,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Subscription} from 'rxjs';
import { UserDataService } from '../../../services/user-data.service';
import {Utility} from '../../../services/utility.class';
import {RoomDataModel, RoomsDataListModel} from '../../../services/model/user-data.model';
import {AgmMap, GoogleMapsAPIWrapper} from '@agm/core';
import {createDirective} from "@angular/compiler/src/core";

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html'
})
export class BrowseComponent implements OnInit, OnDestroy {

  private selectedRoomIndex: number;
  private roomsListSub: Subscription;

  constructor(private userDataService: UserDataService) { }

  ngOnInit() {
    this.roomsListSub = this.userDataService.getRoomsListSub()
      .subscribe(() => { this.checkTime(); });
    this.userDataService.getRoomsListRequest();
    setInterval(() => {
      this.checkTime();
    }, 10000);
  }

  ngOnDestroy(): void {
    this.roomsListSub.unsubscribe();
  }

  onRoomSelected(index: number) {
    this.selectedRoomIndex = index;
  }

  // Requests

  onJoinRoom(roomId: number) {
    this.userDataService.postJoinRoomRequest(roomId)
      .subscribe(() => {});
  }

  onCreateRoom() {
    this.userDataService.postNewRoomRequest()
      .subscribe(() => {});
  }

  // Getters

  getRoomsList() {
    return this.userDataService.roomsListModel;
  }

  getRoomDetails() {
    if (this.userDataService.roomsListModel) {
      return this.userDataService.roomsListModel.roomsList[this.selectedRoomIndex];
    }
    return null;
  }

  checkTime(): void {
    if (this.userDataService.roomsListModel) {
      this.userDataService.roomsListModel.roomsList
        .forEach((room: RoomDataModel) => {
          room.elapsedTime = Math.floor((Date.now() - new Date(room.createdAt).getTime()) / 60000) + ' min ago';
      });
    }
  }

  getRoomDetailsStatus() {
    if (this.userDataService.roomsListModel) {
      const status = this.getRoomDetails().started;
      if (status) {
        return 'started';
      } else {
        return 'awaiting';
      }
    }
    return '...';
  }

}
