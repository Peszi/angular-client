import {Injectable} from '@angular/core';
import {AuthorizationService} from './auth/auth.service';
import {RoomDetailsModel} from './model/user-data.model';
import {of, Subject} from 'rxjs';
import {AlertMessage} from './user-data.service';
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class RoomEditService {

  private roomModeSubject = new Subject<RoomDetailsModel>();
  private requestsSubject = new Subject<AlertMessage>();

  constructor(private authService: AuthorizationService) {}

  getRoomModeRequest() {
    this.authService.makeGetRequest<RoomDetailsModel>('/room')
      .subscribe(
        (roomDetails: RoomDetailsModel) => {

          this.roomModeSubject.next(roomDetails);
        },
        () => {
          this.requestsSubject.next({ error: true, message: 'Cannot get room details!'});
        }
      );
  }

}
