import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {RefreshInterface} from '../refresh.interface';
import {Subscription} from 'rxjs';
import {
  CptZoneDataModel,
  GameAttributes,
  GameDataModel,
  GameDataService,
  GamePrefsModel,
  GameUserDataModel
} from '../../../services/game-data.service';
import {CaptureZoneModel, LocationModel} from '../../../services/model/user-data.model';
import {GameMapComponent} from './game-map/game-map.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy, RefreshInterface {
  @ViewChild(GameMapComponent) gameMap: GameMapComponent;

  readonly MOVING_SPEED = 0.00002;
  readonly MOVING_DEAD_ZONE = 0.00002;

  private gameAttrs: GameAttributes = {lat: 0, lng: 0, ready: false};

  private loopHandle: number;
  private gameDataSub: Subscription;

  private targetPosition: LocationModel;

  constructor(private gameDataService: GameDataService, private router: Router) { }

  // Init

  ngOnInit() {
    this.gameDataService.getGamePrefsRequest()
      .subscribe(
        () => { this.afterPrefsLoaded(); },
      () => { this.router.navigate(['../home/queue']); }
      );
    this.gameDataSub = this.gameDataService.getGameDataSub()
      .subscribe((gameData: GameDataModel) => {
        this.checkZonesData();
        if (gameData.finished) {
          clearInterval(this.loopHandle);
        }
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
    this.gameDataService.postUserReadyRequest().subscribe();
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
      const latDiff = this.targetPosition.lat - this.gameAttrs.lat;
      if (Math.abs(latDiff) > this.MOVING_DEAD_ZONE) {
        this.gameAttrs.lat += Math.sign(latDiff) * this.MOVING_SPEED;
      }
      const lngDiff = this.targetPosition.lng - this.gameAttrs.lng;
      if (Math.abs(lngDiff) > this.MOVING_DEAD_ZONE) {
        this.gameAttrs.lng += Math.sign(lngDiff) * this.MOVING_SPEED;
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

  isGameFinished() {
    if (this.gameDataService.gameData) { return this.gameDataService.gameData.finished; }
    return false;
  }
}
