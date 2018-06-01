import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {RoomDetailsModel, ZoneDataModel} from '../../../services/model/user-data.model';
import {Subscription} from 'rxjs';
import {UserRoomService} from '../../../services/user-room.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html'
})
export class QueueComponent implements OnInit {

  changeZone: boolean;
  newZonePlaced: boolean;
  newZone: ZoneDataModel = {lat: 0, lng: 0, radius: 32};

  teamForm: FormGroup;

  private gameMode: number;
  isModeChanged: boolean;

  constructor(private userRoomService: UserRoomService) { }

  ngOnInit() {
    this.userRoomService.getRoomDetailsRequest();
    this.teamForm = new FormGroup({
      'alias': new FormControl(null, [Validators.required, Validators.maxLength(20)])
    });
  }

  onModeChange(option: number) {
    this.gameMode = option;
    this.isModeChanged = (this.gameMode != this.getGameMode());
  }

  onModeApply() {
    this.userRoomService.postModeChangeRequest(this.gameMode).subscribe();
  }

  onZoneChanged(event: any) {
    this.newZone.lat = event.coords.lat;
    this.newZone.lng = event.coords.lng;
    this.newZonePlaced = true;
  }

  onZoneClicked(event: any) {
    this.newZone.lat = +event.attributes[0].value;
    this.newZone.lng = +event.attributes[1].value;
    this.newZone.radius = +event.attributes[4].value;
    this.newZonePlaced = true;
  }

  onZoneApply() {
    this.userRoomService.postZoneChange(this.newZone)
      .subscribe(() => {
        this.newZonePlaced = false;
      });
  }

  onZoneDiscard() {
    this.newZonePlaced = false;
  }

  hasChanges() {
    if (this.newZonePlaced) {
      return true;
    }
    return false;
  }

  // Request

  onTeamCreate() {
    this.userRoomService.postCreateTeamRequest(this.teamForm.value['alias']).subscribe();
  }

  onTeamRemove(teamId: number) {
    this.userRoomService.deleteTeamRequest(teamId).subscribe();
  }

  onJoinTeam(teamId: number) {
    this.userRoomService.postJoinTeamRequest(teamId).subscribe();
  }

  onLeaveRoom() {
    this.userRoomService.deleteLeaveRoomRequest().subscribe();
  }

  onRoomDelete() {
    this.userRoomService.deleteRoomRequest().subscribe();
  }

  // Getters

  getRoomDetails(): RoomDetailsModel {
    return this.userRoomService.roomDetails;
  }

  getGameMode(): number {
    return this.userRoomService.roomDetails.gameMode;
  }

  isHost() {
    return this.userRoomService.roomDetails.isRoomHost;
  }

}
