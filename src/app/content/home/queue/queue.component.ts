import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GameSettingsModel, RoomDetailsModel, ZoneDataModel} from '../../../services/model/user-data.model';
import {Subject, Subscription} from 'rxjs';
import {UserRoomService} from '../../../services/user-room.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {RefreshInterface} from '../refresh.interface';
import {RoomModeService} from '../../../services/room-mode.service';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html'
})
export class QueueComponent implements OnInit, OnDestroy, RefreshInterface {

  gameMode: number;
  isModeChanged: boolean;

  teamForm: FormGroup;

  private userRoomSubscription: Subscription;

  constructor(private userRoomService: UserRoomService,
              private roomModeService: RoomModeService) {
    this.isModeChanged = false;
  }

  ngOnInit() {
    this.userRoomSubscription = this.userRoomService.getRoomDetailsSub()
      .subscribe(() => {
        this.onSettingsDiscard();
      });
    this.userRoomService.getRoomDetailsRequest();
    this.teamForm = new FormGroup({
      'alias': new FormControl(null, [Validators.required, Validators.maxLength(20)])
    });
  }

  ngOnDestroy(): void {
    this.userRoomSubscription.unsubscribe();
  }

  onRefresh() {
    this.userRoomService.getRoomDetailsRequest();
    this.roomModeService.getZoneControlRequest();
  }

  onModeChange(option: number) {
    this.gameMode = option;
    this.isModeChanged = (this.gameMode != this.userRoomService.roomDetails.gameMode);
  }

  onGameStart() {
    this.userRoomService.postGameStartRequest().subscribe();
  }

  onSettingsApply() {
    this.userRoomService.postModeChangeRequest(this.gameMode).subscribe();
  }

  onSettingsDiscard() {
    this.gameMode = this.userRoomService.roomDetails.gameMode;
    this.isModeChanged = false;
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

  isHost() {
    return this.userRoomService.roomDetails.isRoomHost;
  }

  getRoomDetails(): RoomDetailsModel {
    return this.userRoomService.roomDetails;
  }

  getGameMode() {
    return this.userRoomService.roomDetails.gameMode;
  }

}
