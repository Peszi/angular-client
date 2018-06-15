import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {google, GoogleMap} from '@agm/core/services/google-maps-types';
import {GameUtil} from '../game-util';
import {LocationModel} from '../../../../services/model/user-data.model';
import {GameDataService, GameUserDataModel} from '../../../../services/game-data.service';
import {Subscription} from "rxjs/index";

@Component({
  selector: 'app-game-map',
  templateUrl: './game-map.component.html',
  styles: [`
    :host {
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
  `]
})
export class GameMapComponent implements OnInit, OnDestroy {
  @Output() positionChanged = new EventEmitter<LocationModel>();

  private gameDataSub: Subscription;
  private centeringHandle: number;
  private nativeMap: GoogleMap;

  userAllies: GameUserDataModel[] = [];

  constructor(private gameDataService: GameDataService) { }

  ngOnInit() {
    this.gameDataSub = this.gameDataService.getGameDataSub()
      .subscribe(() => {
        for (let ally of this.gameDataService.gameData.allies) {
          // TODO update allies
        }
      });
  }

  ngOnDestroy() {
    this.gameDataSub.unsubscribe();
    clearTimeout(this.centeringHandle);
  }

  // Events

  onMapReady(nativeMap: GoogleMap) {
    this.nativeMap = nativeMap;
  }

  onCenterChange() { // map auto panning
    if (this.centeringHandle) {
      clearTimeout(this.centeringHandle);
    }
    this.centeringHandle = setTimeout(() => {
      if (this.nativeMap.getZoom() < 18) {
        this.nativeMap.panTo({
          lat: this.getGamePrefs().location.lat,
          lng: this.getGamePrefs().location.lng
        });
      }
    }, 1000);
  }

  // Getters

  getGamePrefs() {
    return this.gameDataService.gamePrefs;
  }

  getZonesLocation() {
    if (this.gameDataService.zonesLocation) { return this.gameDataService.zonesLocation.zones; }
    return [];
  }

  getGameData() {
    return this.gameDataService.gameData;
  }

  onUserPositionChanged(targetPosition: LocationModel) {
    this.positionChanged.emit(targetPosition);
  }

  getZoneColor(idx: number) {
    return GameUtil.getZoneColor(idx);
  }

  getAllyIcon(alive: boolean) {
    return GameUtil.getAllyIconUrl(alive);
  }
}
