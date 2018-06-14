import {Observable, Subject} from 'rxjs';
import {AuthorizationService} from './auth/auth.service';
import {AlertService} from './alert.service';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {CaptureZoneModel, LocationModel } from './model/user-data.model';
import {b, e} from '@angular/core/src/render3';
import {ZoneControlModel} from './room-mode.service';
import {map} from 'rxjs/operators';

@Injectable()
export class GameDataService {

  public gamePrefs: GamePrefsModel;
  public zonesLocation: ZonesLocationModel;
  public gameData: GameDataModel;

  private gameDataSubject = new Subject<GameDataModel>();

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

  getZonesLocationRequest() {
    return this.authService.makeGetRequest<ZonesLocationModel>('/room/game/zones')
      .pipe(map((zonesLocation: ZonesLocationModel) => {
          return (this.zonesLocation = zonesLocation);
        }
      ));
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
  zones: CptZoneDataModel[];

  points: number;
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
  id: number;
  alive:	boolean;
}

// Shared

export interface ZoneModel extends LocationModel {
  radius: number;
}
