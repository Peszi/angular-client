import { Component, OnInit } from '@angular/core';
import {GameUtil} from '../game-util';
import {GameDataService} from '../../../../services/game-data.service';

@Component({
  selector: 'app-game-bar',
  templateUrl: './game-bar.component.html',
  styleUrls: ['./game-bar.component.css']
})
export class GameBarComponent implements OnInit {

  readonly zones: number[] = [0, 1, 2];

  constructor(private gameDataService: GameDataService) { }

  ngOnInit() {
  }

  getGameData() {
    return this.gameDataService.gameData;
  }

  getZoneColor(idx: number) {
    return GameUtil.getZoneColor(idx);
  }

  getZoneIcon(idx: number) {
    const zone = this.gameDataService.gameData.zones[idx];
    if (zone.cptStatus) { return GameUtil.ZONE_CAPTURING_ICON; }
    if (zone.owner) { return GameUtil.ZONE_CAPTURED_ICON; }
    return GameUtil.ZONE_FREE_ICON;
  }

  getZoneTitle(idx: number) {
    const zone = this.gameDataService.gameData.zones[idx];
    if (zone.cptStatus) { return '(capturing...' + zone.cptProgress + '%)'; }
    if (zone.owner) { return zone.owner + '\'s zone'; }
    return GameUtil.ZONE_FREE_TITLE;
  }

  getZoneProgress(idx: number) {
    const zonePoints = this.gameDataService.gameData.zones[idx].points;
    const zoneLimit = this.gameDataService.gamePrefs.zones.capacity;
    return zonePoints / zoneLimit  * 100 + '%';
  }

  isZoneCapturing(idx: number) {
    return this.gameDataService.gameData.zones[idx].cptStatus;
  }

  getTimeLeft() {
    const timeLeft = this.gameDataService.gameData.time;
    if (timeLeft > 0) { return this.convertToTime(timeLeft); }
    return 'preparing..';
  }

  getTimeLeftProgress() {
    const timeLimit = this.gameDataService.gamePrefs.limits.time;
    const timeLeft = this.gameDataService.gameData.time;
    return timeLeft / timeLimit * 100 + '%';
  }

  private convertToTime(seconds: number) {
    const secs = seconds % 60 + ' sec';
    return Math.floor(seconds / 60) + ' min ' + secs;
  }
}
