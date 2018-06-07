import {Component, OnDestroy, OnInit} from '@angular/core';
import {RefreshInterface} from '../refresh.interface';
import {Subscription} from 'rxjs';
import {GameDataModel, GameDataService} from '../../../services/game-data.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy, RefreshInterface {

  zoneIndicators: ZoneIndicator[] = [{owner: 'John', points: 100, capt: false, color: 'green'},
                                      {owner: 'John', points: 25, capt: true, color: 'cyan'},
                                      {owner: 'John', points: 0, capt: true, color: 'yellow'}];

  isGame: boolean;

  private gameDataSub: Subscription;

  constructor(private gameDataService: GameDataService) { }

  ngOnInit() {
    this.gameDataSub = this.gameDataService.getGameDataSub()
      .subscribe((gameData: GameDataModel) => {
        this.isGame = gameData.gameStatus.inGame;
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
    if (this.zoneIndicators[idx].capt) {
      return 'capturing...';
    }
    if (this.zoneIndicators[idx].owner) {
      return this.zoneIndicators[idx].owner;
    }
    return 'free zone';
  }

  getZoneIndicatorIcon(idx: number): string {
    if (this.zoneIndicators[idx].capt) {
      return 'fas fa-crosshairs spin-animate';
    }
    if (this.zoneIndicators[idx].owner) {
      return 'fas fa-podcast';
    }
    return 'fas fa-bullseye';
  }

  getZoneIndicatorColor(idx: number) {
    switch (idx) {
      case 0: return 'bg-success';
      case 1: return 'bg-primary';
    }
    return 'bg-warning';
  }

}

export interface ZoneIndicator {
  owner: string; points: number; capt: boolean; color: string;
}
