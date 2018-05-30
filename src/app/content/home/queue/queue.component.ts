import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {RoomDetailsModel, ZoneDataModel} from '../../../services/model/user-data.model';
import {Subscription} from 'rxjs';
import {UserRoomService} from '../../../services/user-room.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html'
})
export class QueueComponent implements OnInit, OnDestroy {

  private roomDetailsSub: Subscription;

  changeZone: boolean;
  newZonePlaced: boolean;
  newZone: ZoneDataModel;

  teamForm: FormGroup;

  time: any;

  constructor(private userRoomService: UserRoomService) { }

  ngOnInit() {
    this.newZone = {lat: 0, lng: 0, radius: 32};
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

}
