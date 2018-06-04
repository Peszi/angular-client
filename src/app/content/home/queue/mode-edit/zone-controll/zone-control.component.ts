import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {b, s} from '@angular/core/src/render3';
import {GameModeInterface} from '../game-mode.interface';
import {RoomModeService, ZoneControlModel} from '../../../../../services/room-mode.service';
import {Subscription} from 'rxjs';
import {CountInputComponent} from '../../../../../shared/elements/inputs/count-input/count-input.component';
import {TimeInputComponent} from '../../../../../shared/elements/inputs/time-input/time-input.component';

@Component({
  selector: 'app-zc-mode',
  templateUrl: './zone-control.component.html',
  styles: []
})
export class ZoneControlComponent implements OnInit, OnDestroy, GameModeInterface {
  @Input() isHost: boolean;
  @Output() statusChanged = new EventEmitter<boolean>();

  @ViewChild('timeLimitInput') private timeLimitInput: TimeInputComponent;
  @ViewChild('pointsLimitInput') private pointsLimitInput: CountInputComponent;
  @ViewChild('zoneCapacityInput') private zoneCapacityInput: CountInputComponent;

  gameTimeChanged: boolean;
  gamePointsChanged: boolean;
  zonePointsChanged: boolean;

  private gameModeSub: Subscription;

  zoneControlModel: ZoneControlModel = {zoneCapacity: 0, pointsLimit: 0, timeLimit: 0};

  constructor(private roomModeService: RoomModeService) {}

  ngOnInit(): void {
    this.roomModeService.getZoneControlRequest();
    this.gameModeSub = this.roomModeService.getZoneControlSub()
      .subscribe(() => {
        this.setupValues();
      });
  }

  ngOnDestroy(): void {
    this.gameModeSub.unsubscribe();
  }

  setupValues() {
    this.setTimeLimit(this.roomModeService.roomZoneControl.timeLimit);
    this.setPointsLimit(this.roomModeService.roomZoneControl.pointsLimit);
    this.setZoneCapacity(this.roomModeService.roomZoneControl.zoneCapacity);
  }

  setTimeLimit(value: number) {
    if (this.timeLimitInput) {
      this.timeLimitInput.setValue(value);
    }
  }

  setPointsLimit(value: number) {
    if (this.pointsLimitInput) {
      this.pointsLimitInput.setValue(value);
    }
  }

  setZoneCapacity(value: number) {
    if (this.zoneCapacityInput) {
      this.zoneCapacityInput.setValue(value);
    }
  }

  onGameTimeChanged(status: boolean) {
    this.gameTimeChanged = status;
    this.statusChanged.next(this.hasChanges());
  }

  onGamePointsChanged(status: boolean) {
    this.gamePointsChanged = status;
    this.statusChanged.next(this.hasChanges());
  }

  onZonePointsChanged(status: boolean) {
    this.zonePointsChanged = status;
    this.statusChanged.next(this.hasChanges());
  }

  onAcceptChanges() {
    this.roomModeService.postZoneControlRequest(this.zoneControlModel).subscribe();
  }

  onDiscardChanges() {
    this.setupValues();
  }

  hasChanges() {
    return (this.gameTimeChanged || this.gamePointsChanged || this.zonePointsChanged) ? true : false;
  }
}
