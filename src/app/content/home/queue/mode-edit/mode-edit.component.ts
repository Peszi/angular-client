import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {TimeInputComponent} from '../../../../shared/elements/inputs/time-input/time-input.component';
import {ZoneControlComponent} from './zone-controll/zone-control.component';
import {b} from '@angular/core/src/render3';
import {Subject} from 'rxjs';
import {UserRoomService} from '../../../../services/user-room.service';
import {BattleRoyalComponent} from './battle-royal/battle-royal.component';
import {GameModeInterface} from './game-mode.interface';

@Component({
  selector: 'app-mode-edit',
  templateUrl: './mode-edit.component.html',
  styles: [],
})
export class ModeEditComponent implements OnInit {
  @Input() isHost: boolean;
  @Input() gameModeSub: Subject<number>;

  @Input() gameMode: number;

  @ViewChild('gameMode') gameModeInterface: GameModeInterface;

  hasChanges: Boolean = false;

  constructor(private userRoomService: UserRoomService) { }

  ngOnInit() {
    this.gameMode = this.userRoomService.roomDetails.gameMode;
    this.userRoomService.getRoomDetailsSub()
      .subscribe(() => {
        this.hasChanges = false;
        this.gameMode = this.userRoomService.roomDetails.gameMode;
      });
  }

  onBattleRoyalChanged(status: boolean) {
    this.hasChanges = status;
  }

  onZoneControlChanged(status: boolean) {
    this.hasChanges = status;
  }

  onChangesApply() {
    this.gameModeInterface.onAcceptChanges();
  }

  onChangesDiscard() {
    this.gameModeInterface.onDiscardChanges();
  }
}
