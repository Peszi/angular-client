import {Subject} from 'rxjs';
import {AuthorizationService} from './auth/auth.service';
import {AlertService} from './alert.service';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {CaptureZoneModel, PositionModel } from './model/user-data.model';
import {b} from '@angular/core/src/render3';
import {ZoneControlModel} from './room-mode.service';

@Injectable()
export class GameDataService {

  public gameData: GameDataModel;

  private gameDataSubject = new Subject<GameDataModel>();

  constructor(private authService: AuthorizationService,
              private alertService: AlertService,
              private router: Router) {
  }

  postGameDataRequest(userData: UserGameDataModel) {
    this.authService.makePostRequest<GameDataModel>('/room/game/update', userData)
      .subscribe(
        (gameData: GameDataModel) => {
          this.gameData = gameData;
          this.gameDataSubject.next(gameData);
        }
      );
  }

  getGameDataSub() {
    return this.gameDataSubject.asObservable();
  }
}

export interface GameStatusModel {
  gameTime: number;
  inGame: boolean;
  baseZone: ZoneModel;
  captureZones: CaptureZoneModel[];
  attributes: ZoneControlAttributesModel;
}

export interface UserStatusModel {
  userData: UserDataModel;
  alliesList: any;
}

export interface GameDataModel {
  respZone: ZoneModel;
}

export interface GameDataModel {
  gameStatus: GameStatusModel;
  userStatus: UserStatusModel;
  gameData: GameDataModel;
}

export interface ZoneModel extends PositionModel {
  radius: number;
}

export interface UserGameDataModel extends PositionModel {
  ready: boolean;
}

export interface UserDataModel extends PositionModel {
  id: number;
  name: string;
  died:	boolean;
}

export interface ZoneControlAttributesModel {
  pointsLimit: number; timeLimit: number; zoneCapacity: number;
}
