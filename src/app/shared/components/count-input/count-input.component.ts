import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-count-input',
  templateUrl: './count-input.component.html',
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
export class CountInputComponent implements OnInit {
  @Input() title: String = 'unnamed';
  @Input() editable: boolean;
  @Input() placeholder: String = 'value';
  @Input() value: number;
  @Input() defaultValue: number;
  @Output() valueChange = new EventEmitter<number>();
  @Output() statusChange = new EventEmitter<boolean>();

  valueOutput: number;
  isChanged: boolean;

  constructor() {}

  ngOnInit() {
    this.defaultValue = +this.value;
    this.showValue();
  }

  onReset() {
    this.value = +this.defaultValue;
    this.showValue();
  }

  setValue(value: number) {
    this.defaultValue = value;
    this.onReset();
  }

  showValue() {
    this.isChanged = (this.value !== this.defaultValue);
    this.statusChange.next(this.isChanged);
    this.valueOutput = this.value;
    this.valueChange.next(this.value);
  }

  changeValue(value: number) {
    this.value += value;
    if (this.value < 0) {
      this.value = 0;
    }
    this.showValue();
  }

  onValueChange() {
    if (Number(this.valueOutput)) {
      this.value = +this.valueOutput;
    }
    this.showValue();
  }

}
