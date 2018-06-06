import {Component, OnDestroy, OnInit} from '@angular/core';
import {CaptureZoneModel, PositionModel} from '../../../../services/model/user-data.model';
import {GameDataModel, GameDataService, ZoneModel} from '../../../../services/game-data.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-game-map',
  templateUrl: './game-map.component.html',
  styles: []
})
export class GameMapComponent implements OnInit, OnDestroy {

  userPosition: PositionModel;
  newPosition: PositionModel = {lat: 0, lng: 0};

  baseZone: ZoneModel = {lat: 0, lng: 0, radius: 0};
  captureZones: CaptureZoneModel[] = [];

  private gameDataSub: Subscription;
  private loopHandle: any;

  constructor(private gameDataService: GameDataService) { }

  ngOnInit() {
    this.gameDataService.getGameDataRequest();
    this.gameDataSub = this.gameDataService.getGameDataSub()
      .subscribe((gameData: GameDataModel) => {
        this.baseZone = gameData.gameStatus.baseZone;
        this.captureZones = gameData.gameStatus.captureZones;
      });
    this.updateLoop();
  }

  ngOnDestroy(): void {
    this.gameDataSub.unsubscribe();
    clearInterval(this.loopHandle);
  }

  updateLoop() {
    this.loopHandle = setInterval(() => {
      if (this.userPosition) {
        const speed = 0.000005;
        const offset = 0.00001;
        const latDiff = this.userPosition.lat - this.newPosition.lat;
        if (Math.abs(latDiff) > offset) {
          this.userPosition.lat -= Math.sign(latDiff) * speed;
        }
        const lngDiff = this.userPosition.lng - this.newPosition.lng;
        if (Math.abs(lngDiff) > offset) {
          this.userPosition.lng -= Math.sign(lngDiff) * speed;
        }
      }
    }, 250);
  }

  onUserPositionChanged(newPosition: PositionModel) {
    this.newPosition = newPosition;
    if (!this.userPosition) {
      this.userPosition = newPosition;
    }
  }

  getUserPosition(): PositionModel {
    if (this.userPosition) {
      return this.userPosition;
    }
    if (this.baseZone) {
      return {lat: this.baseZone.lat, lng: this.baseZone.lng};
    }
    return {lat: 0, lng: 0};
  }

}
