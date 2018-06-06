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

}
