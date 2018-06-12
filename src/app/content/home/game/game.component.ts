import {Component, OnDestroy, OnInit} from '@angular/core';
import {RefreshInterface} from '../refresh.interface';
import {Subscription} from 'rxjs';
import {GameDataModel, GameDataService} from '../../../services/game-data.service';
import {CaptureZoneModel} from '../../../services/model/user-data.model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy, RefreshInterface {

  captureZones: CaptureZoneModel[] = [];

  isGame: boolean;

  private gameDataSub: Subscription;

  constructor(private gameDataService: GameDataService) { }

  ngOnInit() {
    this.gameDataSub = this.gameDataService.getGameDataSub()
      .subscribe((gameData: GameDataModel) => {
        this.isGame = gameData.gameStatus.inGame;
        if (this.captureZones.length === 0) {
          this.captureZones = gameData.gameStatus.captureZones;
        } else {
          for (let i = 0; i < this.captureZones.length; i++) {
            this.captureZones[i].points = gameData.gameStatus.captureZones[i].points;
            this.captureZones[i].owner = gameData.gameStatus.captureZones[i].owner;
            this.captureZones[i].capt = gameData.gameStatus.captureZones[i].capt;
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.gameDataSub.unsubscribe();
  }

  onRefresh() {
    // console.log('in game refresh works!');
  }

  getStatus() {
    if (this.isGame) { return 'in game'; }
    return 'awaiting players..';
  }

  getZoneIndicatorDesc(idx: number) {
    if (this.captureZones[idx].capt) {
      return '(capturing...)';
    }
    if (this.captureZones[idx].owner) {
      return this.captureZones[idx].owner + ' zone';
    }
    return '(free zone)';
  }

  getZoneIndicatorIcon(idx: number): string {
    if (this.captureZones[idx].capt) {
      return 'fas fa-crosshairs spin-animate';
    }
    if (this.captureZones[idx].owner) {
      return 'fas fa-podcast';
    }
    return 'fas fa-bullseye';
  }

  getZoneIndicatorColor(idx: number) {
    switch (idx) {
      case 0: return '#00acc1';
      case 1: return '#ff4350';
    }
    return '#ffbf46';
  }

  getZoneCptProgress(idx: number) {
    const zoneCapLimit = this.gameDataService.gameData.gameStatus.attributes.zoneCapacity;
    return this.captureZones[idx].points / zoneCapLimit  * 100 + '%';
  }

}
