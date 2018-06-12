import {Component, OnDestroy, OnInit} from '@angular/core';
import {CaptureZoneModel, PositionModel} from '../../../../services/model/user-data.model';
import {GameDataModel, GameDataService, UserGameDataModel, ZoneModel} from '../../../../services/game-data.service';
import {Subscription} from 'rxjs';
import {GoogleMapsAPIWrapper} from '@agm/core';
import {google, GoogleMap} from '@agm/core/services/google-maps-types';
import {sendRequest} from 'selenium-webdriver/http';

@Component({
  selector: 'app-game-map',
  templateUrl: './game-map.component.html',
  styles: []
})
export class GameMapComponent implements OnInit, OnDestroy {

  userGameData: UserGameDataModel;
  private newPosition: PositionModel = {lat: 0, lng: 0};

  userPosition: PositionModel = {lat: 0, lng: 0};
  baseZone: ZoneModel = {lat: 0, lng: 0, radius: 0};
  respZone: ZoneModel = {lat: 0, lng: 0, radius: 0};
  captureZones: CaptureZoneModel[] = [];

  private gameDataSub: Subscription;
  private loopHandle: number;
  private centeringHandle: number;

  private nativeMap: GoogleMap;

  constructor(private gameDataService: GameDataService) { }

  ngOnInit() {
    this.gameDataService.postGameDataRequest(null);
    this.gameDataSub = this.gameDataService.getGameDataSub()
      .subscribe((gameData: GameDataModel) => {
        this.userPosition = gameData.userStatus.userData;
        this.baseZone = gameData.gameStatus.baseZone;
        this.respZone = gameData.gameData.respZone;
        if (this.captureZones.length === 0) {
          this.captureZones = gameData.gameStatus.captureZones;
        }
        if (!this.userGameData) {
          this.nativeMap.panTo({lat: this.baseZone.lat, lng: this.baseZone.lng});
          this.userGameData = {lat: this.respZone.lat, lng: this.respZone.lng, ready: false};
          this.newPosition = {lat: this.respZone.lat, lng: this.respZone.lng};
        }
      });
    this.updateLoop();
  }

  ngOnDestroy(): void {
    this.gameDataSub.unsubscribe();
    clearInterval(this.loopHandle);
  }

  updateLoop() {
    this.loopHandle = setInterval(() => {
      if (this.userGameData && this.nativeMap) {
        const speed = 0.00001;
        const offset = 0.00001;
        const latDiff = this.userGameData.lat - this.newPosition.lat;
        if (Math.abs(latDiff) > offset) {
          this.userGameData.lat -= Math.sign(latDiff) * speed;
        }
        const lngDiff = this.userGameData.lng - this.newPosition.lng;
        if (Math.abs(lngDiff) > offset) {
          this.userGameData.lng -= Math.sign(lngDiff) * speed;
        }
        this.gameDataService.postGameDataRequest(this.userGameData);
      }
    }, 250);
  }

  onCenterChange() {
    if (this.centeringHandle) {
      clearTimeout(this.centeringHandle);
    }
    this.centeringHandle = setTimeout(() => {
      this.nativeMap.panTo({lat: this.baseZone.lat, lng: this.baseZone.lng});
    }, 1000);
  }

  onMapReady(nativeMap: GoogleMap) {
    this.nativeMap = nativeMap;
    // googleMap.setZoom(10);
    // const cityCircle = new google.maps.Circle({
    //   strokeColor: '#FF0000',
    //   strokeOpacity: 0.8,
    //   strokeWeight: 2,
    //   fillColor: '#FF0000',
    //   fillOpacity: 0.35,
    //   map: googleMap,
    //   center: googleMap.getCenter(),
    //   radius: 1000
    // });
  }

  onUserPositionChanged(newPosition: PositionModel) {
    this.newPosition = newPosition;
  }

  getUserPosition(): PositionModel {
    if (this.userGameData) {
      return this.userGameData;
    }
    if (this.respZone) {
      return {lat: this.respZone.lat, lng: this.respZone.lng};
    }
    return {lat: 0, lng: 0};
  }

  getZoneIndicatorColor(idx: number) {
    switch (idx) {
      case 0: return '#00acc1';
      case 1: return '#ff4350';
    }
    return '#ffbf46';
  }

}
