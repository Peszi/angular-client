import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameModeInterface} from '../game-mode.interface';

@Component({
  selector: 'app-br-mode',
  templateUrl: './battle-royal.component.html',
  styles: []
})
export class BattleRoyalComponent implements OnInit, GameModeInterface {
  @Input() isHost: boolean;
  @Output() statusChanged = new EventEmitter<boolean>();

  status: boolean;

  constructor() {
    this.status = false;
  }

  ngOnInit() {

  }

  toggle(status: boolean) {
    this.status = !this.status;
    this.statusChanged.next(this.status);
  }

  onAcceptChanges() {
    console.log('BR accepted!');
  }

  onDiscardChanges() {
    console.log('BR accepted!');
  }

}
