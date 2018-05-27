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
import { UserDataService } from '../../user-data.service';
import {Utility} from '../../utility.class';
import {RoomDataModel, RoomsDataListModel} from '../../user-data.model';
import {AgmMap, GoogleMapsAPIWrapper} from '@agm/core';
import {createDirective} from "@angular/compiler/src/core";

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit, OnDestroy {

  @ViewChild('map') agmMap: GoogleMapsAPIWrapper;

  private selectedRoomIndex: number;
  private roomsListSub: Subscription;

  constructor(private userDataService: UserDataService) { }

  ngOnInit() {
    this.userDataService.getRoomsListRequest();
    this.roomsListSub = this.userDataService.getRoomsListObserver().subscribe(
      (roomsList: RoomsDataListModel) => {
        this.checkTime();
        if (roomsList.hasRoom) {
          console.log('need redirect here!');
        }
      }
    );
    setInterval(() => {
      this.checkTime();
    }, 60000);
    // const nyc = new google.maps.LatLng(40.715, -74.002);
    // const london = new google.maps.LatLng(51.506, -0.119);
    // const distance = google.maps.geometry.spherical.computeDistanceBetween(null, null);
    // console.log(distance);


  }

  onCenterChange(): void {
    console.log(this.agmMap);
    this.agmMap.panBy(1, 1);
  }

  ngOnDestroy(): void {
    this.roomsListSub.unsubscribe();
  }

  onRoomSelected(index: number) {
    this.selectedRoomIndex = index;
  }

  // Requests

  onReloadRooms() {
    this.userDataService.getRoomsListRequest();
  }

  onCreateRoom() {
    this.userDataService.postNewRoomRequest();
  }

  // Utility
  getUsersCount(count: number) {
    return Utility.getCountWithName(count, 'user');
  }

  getRoomsCount() {
    if (this.userDataService.getRoomsList()) {
      return this.userDataService.getRoomsList().roomsList.length;
    } else {
      return 'no rooms';
    }
  }

  getRoomsList() {
    return this.userDataService.getRoomsList();
  }

  getRoomDetails() {
    if (this.userDataService.getRoomsList()) {
      return this.userDataService.getRoomsList().roomsList[this.selectedRoomIndex];
    }
    return null;
  }

  checkTime(): void {
    if (this.userDataService.getRoomsList()) {
      this.userDataService.getRoomsList()
        .roomsList.forEach((room: RoomDataModel) => {
          room.elapsedTime = Math.floor((Date.now() - new Date(room.createdAt).getTime()) / 60000) + ' min ago';
      });
    }
  }

  getRoomDetailsStatus() {
    if (this.userDataService.getRoomsList()) {
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
