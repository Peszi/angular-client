import {Component, Input, OnInit} from '@angular/core';
import {GameSettingsModel, RoomDetailsModel } from '../../../../services/model/user-data.model';
import {UserRoomService} from '../../../../services/user-room.service';
import {Subscription} from 'rxjs';
import {ZoneModel} from '../../../../services/game-data.service';

@Component({
  selector: 'app-queue-map',
  templateUrl: './queue-map.component.html',
  styles: []
})
export class QueueMapComponent implements OnInit {
  @Input() isHost: boolean;

  gameSettings: ZoneModel = {lat: 0, lng: 0, radius: 0};
  isZoneChanged: boolean;

  private userRoomSubscription: Subscription;

  constructor(private userRoomService: UserRoomService) { }

  ngOnInit() {
    this.userRoomSubscription = this.userRoomService.getRoomDetailsSub()
      .subscribe(() => {
        this.initSettings();
      });
  }

  private initSettings() {
    this.gameSettings.lat = this.userRoomService.roomDetails.zoneLat;
    this.gameSettings.lng = this.userRoomService.roomDetails.zoneLng;
    this.gameSettings.radius = this.userRoomService.roomDetails.zoneRadius;
    this.isZoneChanged = false;
  }

  onSettingsApply() {
    this.userRoomService.postZoneChange(this.gameSettings).subscribe();
  }

  onSettingsDiscard() {
    this.initSettings();
  }

  onZoneChanged(event: any) {
    if (this.isHost) {
      this.gameSettings.lat = event.coords.lat;
      this.gameSettings.lng = event.coords.lng;
      this.isZoneChanged = true;
    }
  }

  onZoneClicked(event: any) {
    if (this.isHost) {
      this.gameSettings.lat = +event.attributes[0].value;
      this.gameSettings.lng = +event.attributes[1].value;
      this.gameSettings.radius = +event.attributes[4].value;
      this.isZoneChanged = true;
    }
  }

  getRoomDetails(): RoomDetailsModel {
    return this.userRoomService.roomDetails;
  }
}
