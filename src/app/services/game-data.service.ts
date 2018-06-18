import {Observable, Subject} from 'rxjs';
import {AuthorizationService} from './auth/auth.service';
import {AlertService} from './alert.service';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {CaptureZoneModel, LocationModel } from './model/user-data.model';
import {b, e, s, st} from '@angular/core/src/render3';
import {ZoneControlModel} from './room-mode.service';
import {map} from 'rxjs/operators';

@Injectable()
export class GameDataService {

  public gamePrefs: GamePrefsModel;
  public zonesLocation: ZonesLocationModel;
  public gameData: GameDataModel;
  public gameResults: GameResultsModel;

  private gameDataSubject = new Subject<GameDataModel>();
  private gameUsersSubject = new Subject<GameUsersModel>();

  constructor(private authService: AuthorizationService,
              private alertService: AlertService,
              private router: Router) {
  }

  getGamePrefsRequest(): Observable<GamePrefsModel> {
    return this.authService.makeGetRequest<GamePrefsModel>('/room/game')
      .pipe(map((gamePrefs: GamePrefsModel) => {
          return (this.gamePrefs = gamePrefs);
        }
      ));
  }

  getGameUsersRequest() {
    this.authService.makeGetRequest<GameUsersModel>('/room/game/users')
      .subscribe((gameUsers: GameUsersModel) => {
          this.gameUsersSubject.next(gameUsers);
        }
      );
  }

  getZonesLocationRequest() {
    return this.authService.makeGetRequest<ZonesLocationModel>('/room/game/zones')
      .pipe(map((zonesLocation: ZonesLocationModel) => {
          return (this.zonesLocation = zonesLocation);
        }
      ));
  }

  postUserReadyRequest() {
    return this.authService.makePostTextRequest('/room/game/ready');
  }

  postGameDataRequest(gameAttributes: GameAttributes) {
    this.authService.makePostRequest<GameDataModel>('/room/game/update', gameAttributes)
      .subscribe(
        (gameData: GameDataModel) => {
          this.gameData = gameData;
          this.gameDataSubject.next(gameData);
        },
        () => {
          this.router.navigate(['../home/queue']);
        }
      );
  }

  getGameResultsRequest() {
    return this.authService.makeGetRequest<GameResultsModel>('/room/game/results')
      .pipe(map((gameResults: GameResultsModel) => {
          return (this.gameResults = gameResults);
        }
      ));
  }

  getGameUsersSub() {
    return this.gameUsersSubject.asObservable();
  }

  getGameDataSub() {
    return this.gameDataSubject.asObservable();
  }
}

// Attributes

export interface GameAttributes extends LocationModel {
  ready: boolean;
}

// Prefs

export interface GamePrefsModel {
  location: ZoneModel;
  limits: GameLimitsModel;
  zones: ZonePrefsModel;
  users: UserDataModel[];
  resp: ZoneModel;
}

export interface GameLimitsModel {
  points: number; time: number;
}

export interface ZonePrefsModel {
  capacity: number; radius: number;
}

export interface UserDataModel {
  id: number; name: string;
}

// Users

export interface GameUsersModel {
  teams: GameTeamModel[];
}

export interface GameTeamModel {
  alias: string;
  users: UserPrefsModel[];
}

export interface UserPrefsModel {
  name: string; ready: boolean; alive: boolean;
}

// Zones

export interface ZonesLocationModel {
  zones: CptZoneModel[];
}

export interface CptZoneModel extends LocationModel {
  order: number;
}

// Updates

export interface GameDataModel {
  time: number;
  started: boolean;
  finished: boolean;
  zones: CptZoneDataModel[];
  results: ResultModel[];

  points: number;
  alias: string;
  user: GameUserDataModel;
  allies: GameUserDataModel[];
}

export interface CptZoneDataModel {
  order: number;
  owner: string;
  points: number;
  cptProgress: number;
  cptStatus: boolean;
}

export interface GameUserDataModel extends LocationModel {
  id: number; alive:	boolean;
}

// Results
export interface GameResultsModel {
  results: ResultModel[];
}

// Shared

export interface ZoneModel extends LocationModel {
  radius: number;
}

export interface ResultModel {
  alias: string; points: number;
}
