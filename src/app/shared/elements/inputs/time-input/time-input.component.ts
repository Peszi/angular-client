import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {b} from '@angular/core/src/render3';

@Component({
  selector: 'app-time-input',
  templateUrl: './time-input.component.html',
  styles: [`
    :host {
      padding: 0;
    }
    button {
      background-color: #fff;
    }
    button:hover {
      cursor: pointer;
      color: #fff !important;
      background-color: #dc3545;
    }
    i:hover {
      cursor: pointer;
      color: #fff !important;
      border-radius: 2px;
      background-color: #007bff;
    }
  `],
})
export class TimeInputComponent implements OnInit {
  @Input() title: String = 'unnamed';
  @Input() editable: boolean;
  @Input() seconds: number;
  @Output() secondsChange = new EventEmitter<number>();
  @Output() statusChange = new EventEmitter<boolean>();

  private defaultValue: number;
  secValue: string;
  minValue: string;
  isChanged: boolean;

  constructor() { }

  ngOnInit() {
    this.defaultValue = +this.seconds;
    this.showTime();
  }

  onReset() {
    this.seconds = +this.defaultValue;
    this.showTime();
  }

  setValue(value: number) {
    this.defaultValue = value;
    this.onReset();
  }

  showTime() {
    this.isChanged = (this.seconds !== this.defaultValue);
    this.statusChange.next(this.isChanged);
    this.secValue = this.seconds % 60 + ' sec';
    this.minValue = Math.floor(this.seconds / 60) + ' min';
    this.secondsChange.next(this.seconds);
  }

  changeMins(value: number) {
    this.seconds += value * 60;
    if (this.seconds < 0) {
      this.seconds = 0;
    }
    this.showTime();
  }

  changeSecs(value: number) {
    this.seconds += value;
    if (this.seconds < 0) {
      this.seconds = 0;
    }
    this.showTime();
  }

  onMinsChange() {
    if (Number(this.minValue)) {
      this.seconds = +this.minValue * 60;
    }
    this.showTime();
  }

  onSecsChange() {
    if (Number(this.secValue)) {
      if (Number(this.secValue) < 60) {
        const mins = Math.floor(this.seconds / 60);
        this.seconds = mins * 60 + +this.secValue;
      } else {
        this.seconds = +this.secValue;
      }
    }
    this.showTime();
  }
}
