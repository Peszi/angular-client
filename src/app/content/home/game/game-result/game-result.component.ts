import { Component, OnInit } from '@angular/core';
import {GameDataService} from '../../../../services/game-data.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-game-result',
  templateUrl: './game-result.component.html',
  styleUrls: ['./game-result.component.css']
})
export class GameResultComponent implements OnInit {

  constructor(private gameDataService: GameDataService,
              private router: Router) { }

  ngOnInit() {
    setTimeout(() => this.gameDataService.getGameResultsRequest().subscribe(), 500);
  }

  getGameResults() {
    return this.gameDataService.gameResults;
  }

  onBack() {
    this.router.navigate(['../home']);
  }
}
