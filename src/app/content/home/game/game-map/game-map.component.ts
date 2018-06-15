import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {google, GoogleMap} from '@agm/core/services/google-maps-types';
import {GameUtil} from '../game-util';
import {LocationModel} from '../../../../services/model/user-data.model';
import {GameDataService} from '../../../../services/game-data.service';

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

  private centeringHandle: number;
  private nativeMap: GoogleMap;

  constructor(private gameDataService: GameDataService) { }

  ngOnInit() {}

  ngOnDestroy() {
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
}
