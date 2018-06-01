import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-mode-edit',
  templateUrl: './mode-edit.component.html',
  styles: [`
    :host {
      class: div;
    }
  `],
})
export class ModeEditComponent implements OnInit {
  @Input() isHost: boolean;
  @Input() gameMode: number;

  time: Number = 160;

  constructor() { }

  ngOnInit() {
  }

  onChangesApply() {

  }

  onChangesDiscard() {

  }

  hasChanges() {
    return false;
  }

}
