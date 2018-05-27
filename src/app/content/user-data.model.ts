
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
}

export interface RoomDetailsModel extends RoomDataModel {
  teamsList: TeamsListModel;
}


export interface RoomsDataListModel {
  hasRoom: boolean;
  roomsList: RoomDataModel[];
}
