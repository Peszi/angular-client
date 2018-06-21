import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-simple-time-input',
  templateUrl: './simple-time-input.component.html',
  styles: [`
    :host {
      min-width: 10px;
    }
    input {
      min-width: 10px;
    }
  `]
})
export class SimpleTimeInputComponent implements OnInit {
  @Input() editable: boolean;
  @Input() seconds: number;
  @Output() secondsChange = new EventEmitter<number>();
  @Output() statusChange = new EventEmitter<boolean>();

  private defaultValue: number;
  secondsValue: string;
  isChanged: boolean;

  constructor() { }

  ngOnInit() {
    this.defaultValue = +this.seconds;
    this.showTime();
  }

  resetValue() {
    this.seconds = +this.defaultValue;
    this.showTime();
  }

  showTime() {
    this.isChanged = (this.seconds !== this.defaultValue);
    const secs = this.seconds % 60 + ' sec';
    this.secondsValue = Math.floor(this.seconds / 60) + ' min ' + secs;
    this.statusChange.next(this.isChanged);
    this.secondsChange.next(this.seconds);
  }

  changeTime(value: number) {
    this.seconds += value;
    if (this.seconds < 0) {
      this.seconds = 0;
    }
    this.showTime();
  }

  onTimeApply() {
    if (Number(this.secondsValue)) {
      this.seconds = +this.secondsValue;
    }
    this.showTime();
  }

}
