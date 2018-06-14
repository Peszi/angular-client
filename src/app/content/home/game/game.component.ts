import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {RefreshInterface} from '../refresh.interface';
import {Subscription} from 'rxjs';
import {CptZoneDataModel, GameAttributes, GameDataModel, GameDataService, GamePrefsModel} from '../../../services/game-data.service';
import {CaptureZoneModel, LocationModel} from '../../../services/model/user-data.model';
import {GameMapComponent} from './game-map/game-map.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy, RefreshInterface {
  @ViewChild(GameMapComponent) gameMap: GameMapComponent;

  private gameAttrs: GameAttributes = {lat: 0, lng: 0, ready: false};

  private loopHandle: number;
  private gameDataSub: Subscription;
  // var
  private targetPosition: LocationModel;

  constructor(private gameDataService: GameDataService) { }

  // Init

  ngOnInit() {
    this.gameDataService.getGamePrefsRequest()
      .subscribe(() => this.afterPrefsLoaded());
    this.gameDataSub = this.gameDataService.getGameDataSub()
      .subscribe(() => {
        this.checkZonesData();
      });
  }

  checkZonesData() {
    if (this.gameDataService.zonesLocation) {
      for (const zoneData of this.gameDataService.gameData.zones) {
        let hasLocation = false;
        for (const zoneLocation of this.gameDataService.zonesLocation.zones) {
          if (zoneLocation.order === zoneData.order) {
            hasLocation = true;
            break;
          }
        }
        if (!hasLocation) {
          this.updateZonesLocations();
          break;
        }
      }
    }
  }

  afterPrefsLoaded() {
    this.updateZonesLocations();
    this.gameAttrs.lat = this.gameDataService.gamePrefs.resp.lat;
    this.gameAttrs.lng = this.gameDataService.gamePrefs.resp.lng;
    this.gameDataService.postGameDataRequest(this.gameAttrs);
    this.updateLoop();
  }

  // End

  ngOnDestroy(): void {
    this.gameDataSub.unsubscribe();
    clearInterval(this.loopHandle);
  }

  // Updates

  updateLoop() {
    this.loopHandle = setInterval(() => {
      this.updateUserPosition();
      this.gameDataService.postGameDataRequest(this.gameAttrs);
    }, 500);
  }

  updateZonesLocations() {
    this.gameDataService.getZonesLocationRequest().subscribe(() => {});
  }

  updateUserPosition() {
    if (this.targetPosition) {
      const speed = 0.00005;
      const offset = 0.00001;
      const latDiff = this.targetPosition.lat - this.gameAttrs.lat;
      if (Math.abs(latDiff) > offset) {
        this.gameAttrs.lat += Math.sign(latDiff) * speed;
      }
      const lngDiff = this.targetPosition.lng - this.gameAttrs.lng;
      if (Math.abs(lngDiff) > offset) {
        this.gameAttrs.lng += Math.sign(lngDiff) * speed;
      }
    }
  }

  // Events

  onUserPositionChanged(targetPosition: LocationModel) {
    this.targetPosition = targetPosition;
  }

  onRefresh() {}

  // Getters

  getStatus() {
    return (this.gameDataService.gameData && this.gameDataService.gameData.started ? 'started' : 'awaiting players..');
  }

  isDataLoaded() {
    return (this.gameDataService.gamePrefs && this.gameDataService.gameData);
  }
}
