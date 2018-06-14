import {ZoneModel} from '../game-data.service';
import {s, st} from '@angular/core/src/render3';

export interface UserDataModel {
  id: number;
  name: string;
  email: string;
}

export interface RoomDataModel {
  id: number;
  hostId: number;
  hostName: string;
  started: false;
  teamsCount: number;
  gameMode: number;
  createdAt: string;
  elapsedTime: string;

  zoneLat: number;
  zoneLng: number;
  zoneRadius: number;
}

export interface UserModel {
  id: number;
  name: string;
}

export interface TeamsListModel {
  alias: string;
  id: number;
  usersList: UserModel[];
  // local var
  isMyTeam: boolean;
}

export interface RoomDetailsModel extends RoomDataModel {
  teamsList: TeamsListModel[];
  // local var
  isRoomHost: boolean;
}


export interface RoomsDataListModel {
  hasRoom: boolean;
  roomsList: RoomDataModel[];
}

export interface LocationModel {
  lat: number; lng: number;
}

export interface CaptureZoneModel extends ZoneModel {
  color: string; owner: string; points: number; capt: boolean;
}

export interface GameSettingsModel {
  gameMode: number; lat: number; lng: number; radius: number;
}
