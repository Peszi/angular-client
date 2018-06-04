import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GameSettingsModel, RoomDetailsModel, ZoneDataModel} from '../../../services/model/user-data.model';
import {Subject, Subscription} from 'rxjs';
import {UserRoomService} from '../../../services/user-room.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html'
})
export class QueueComponent implements OnInit {

  gameSettings: GameSettingsModel = {gameMode: 0, lat: 0, lng: 0, radius: 0};
  isZoneChanged: boolean;
  isModeChanged: boolean;

  gameModeSub: Subject<number> = new Subject();

  teamForm: FormGroup;

  constructor(private userRoomService: UserRoomService) { }

  ngOnInit() {
    this.userRoomService.getRoomDetailsSub()
      .subscribe(() => {
        this.initSettings();
      });
    this.userRoomService.getRoomDetailsRequest();
    this.teamForm = new FormGroup({
      'alias': new FormControl(null, [Validators.required, Validators.maxLength(20)])
    });
  }

  private initSettings() {
    this.gameSettings.gameMode = this.userRoomService.roomDetails.gameMode;
    this.gameSettings.lat = this.userRoomService.roomDetails.zoneLat;
    this.gameSettings.lng = this.userRoomService.roomDetails.zoneLng;
    this.gameSettings.radius = this.userRoomService.roomDetails.zoneRadius;
    this.isModeChanged = false;
    this.isZoneChanged = false;
    this.gameModeSub.next(this.gameSettings.gameMode);
  }

  onModeChange(option: number) {
    this.gameSettings.gameMode = option;
    this.isModeChanged = (this.gameSettings.gameMode != this.userRoomService.roomDetails.gameMode);
  }

  onZoneChanged(event: any) {
    this.gameSettings.lat = event.coords.lat;
    this.gameSettings.lng = event.coords.lng;
    this.isZoneChanged = true;
  }

  onZoneClicked(event: any) {
    this.gameSettings.lat = +event.attributes[0].value;
    this.gameSettings.lng = +event.attributes[1].value;
    this.gameSettings.radius = +event.attributes[4].value;
    this.isZoneChanged = true;
  }

  onSettingsApply() {
    this.userRoomService.postGameSettingsRequest(this.gameSettings).subscribe();
  }

  onSettingsDiscard() {
    this.initSettings();
  }

  hasChanges() {
    if (this.isZoneChanged || this.isModeChanged) {
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

  isHost() {
    return this.userRoomService.roomDetails.isRoomHost;
  }

  getGameMode() {
    return this.userRoomService.roomDetails.gameMode;
  }

}
