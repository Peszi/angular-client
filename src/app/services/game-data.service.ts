import {Subject} from 'rxjs';
import {AuthorizationService} from './auth/auth.service';
import {AlertService} from './alert.service';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {CaptureZoneModel, PositionModel } from './model/user-data.model';

@Injectable()
export class GameDataService {

  public gameData: GameDataModel;

  private gameDataSubject = new Subject<GameDataModel>();

  constructor(private authService: AuthorizationService,
              private alertService: AlertService,
              private router: Router) {
  }

  getGameDataRequest() {
    this.authService.makeGetRequest<GameDataModel>('/room/game')
      .subscribe(
        (gameData: GameDataModel) => {
          this.gameData = gameData;
          this.gameDataSubject.next(gameData);
        },
        () => {
          this.alertService.showAlert({error: true, message: 'Cannot get game data!'});
        }
      );
  }

  getGameDataSub() {
    return this.gameDataSubject.asObservable();
  }
}

// {
//   "gameStatus": {
//     "gameTime": 1,
//     "inGame": false,
//     "gameZone": {
//       "zoneLongitude": 19.044788183853143,
//       "zoneLatitude": 49.82619827221035,
//       "zoneRadius": 32
//     }
// },
//   "userStatus": {
//   "userData": {
//     "id": 3,
//       "name": "John",
//       "died": false,
//       "longitude": 0.0,
//       "latitude": 0.0
//   },
//   "alliesList": []
// }
// }

export interface GameStatusModel {
  gameTime: number;
  inGame: boolean;
  baseZone: ZoneModel;
  captureZones: CaptureZoneModel[];
}

export interface UserStatusModel {
  userData: any;
  alliesList: any;
}

export interface GameDataModel {
  gameStatus: GameStatusModel;
  userStatus: UserStatusModel;
}

export interface ZoneModel extends PositionModel {
  radius: number;
}
