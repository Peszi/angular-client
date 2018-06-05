import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-br-mode',
  templateUrl: './battle-royal.component.html',
  styles: []
})
export class BattleRoyalComponent implements OnInit {
  @Input() isHost: boolean;

  zonesList: ZoneTimeModel[] = [{idx: 0, radius: 128, delay: 200, shrink: 150},
                                {idx: 1, radius: 64, delay: 160, shrink: 120},
                                {idx: 2, radius: 32, delay: 120, shrink: 90},
                                {idx: 3, radius: 16, delay: 80, shrink: 60}];

  hasChanges: boolean;

  constructor() {}

  ngOnInit() {

  }

  toggle(status: boolean) {
    this.hasChanges = !this.hasChanges;
  }

  onAcceptChanges() {
    console.log('BR accepted!');
  }

  onDiscardChanges() {
    console.log('BR accepted!');
    this.hasChanges = false;
  }

}

export interface ZoneTimeModel {
  idx: number; radius: number; delay: number; shrink: number;
}
