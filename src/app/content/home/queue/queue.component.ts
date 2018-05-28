import {Component, OnDestroy, OnInit} from '@angular/core';
import {RoomDetailsModel} from '../../../services/model/user-data.model';
import {UserDataService} from '../../../services/user-data.service';
import {Subscription} from 'rxjs';
import {UserRoomService} from '../../../services/user-room.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html'
})
export class QueueComponent implements OnInit, OnDestroy {

  private roomDetailsSub: Subscription;

  teamForm: FormGroup;

  constructor(private userRoomService: UserRoomService) { }

  ngOnInit() {
    this.userRoomService.getRoomDetailsRequest();
    this.roomDetailsSub = this.userRoomService.getRoomDetailsSub()
      .subscribe((roomDetails: RoomDetailsModel) => {
        console.log('got room details');
      });
    this.teamForm = new FormGroup({
      'alias': new FormControl(null, [Validators.maxLength(20)])
    });
  }

  ngOnDestroy(): void {
    this.roomDetailsSub.unsubscribe();
  }

  onTeamCreate() {
    console.log(this.teamForm.value['alias']);
    this.userRoomService.postCreateTeamRequest(this.teamForm.value['alias'])
      .subscribe(
        (value) => { console.log(value); },
            (error) => { console.log(error); }
            );
  }

  getRoomDetails(): RoomDetailsModel {
    return this.userRoomService.roomDetails;
  }

}
