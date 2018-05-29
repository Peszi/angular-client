import {Component, OnDestroy, OnInit} from '@angular/core';
import {RoomDetailsModel} from '../../../services/model/user-data.model';
import {UserDataService} from '../../../services/user-data.service';
import {Subscription} from 'rxjs';
import {UserRoomService} from '../../../services/user-room.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html'
})
export class QueueComponent implements OnInit, OnDestroy {

  private roomDetailsSub: Subscription;

  teamForm: FormGroup;

  constructor(private userRoomService: UserRoomService) { }

  ngOnInit() {
    this.userRoomService.getRoomDetailsRequest();
    this.roomDetailsSub = this.userRoomService.getRoomDetailsSub()
      .subscribe((roomDetails: RoomDetailsModel) => {
        console.log('got room details');
      });
    this.teamForm = new FormGroup({
      'alias': new FormControl(null, [Validators.required, Validators.maxLength(20)])
    });
  }

  ngOnDestroy(): void {
    this.roomDetailsSub.unsubscribe();
  }

  // Request

  onTeamCreate() {
    this.userRoomService.postCreateTeamRequest(this.teamForm.value['alias'])
      .subscribe((value) => {}, (error) => {});
  }

  onTeamRemove(teamId: number) {
    this.userRoomService.deleteTeamRequest(teamId)
      .subscribe((value) => {}, (error) => {});
  }

  onJoinTeam(teamId: number) {
    this.userRoomService.postJoinTeamRequest(teamId)
      .subscribe((value) => {}, (error) => {});
  }

  onLeaveRoom() {
    this.userRoomService.deleteLeaveRoomRequest()
      .subscribe((value) => {}, (error) => {});
  }

  onRoomDelete() {
    this.userRoomService.deleteRoomRequest()
      .subscribe((value) => {}, (error) => {});
  }

  getRoomDetails(): RoomDetailsModel {
    return this.userRoomService.roomDetails;
  }

}
