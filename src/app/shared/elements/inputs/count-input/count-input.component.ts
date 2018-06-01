import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-count-input',
  templateUrl: './count-input.component.html',
  styles: [`
    :host {
      padding: 0;
    }
    button:hover, i:hover {
      cursor: pointer;
    }
  `],
})
export class CountInputComponent implements OnInit {
  @Input() title: String = 'unnamed';
  @Input() editable: boolean;
  @Input() placeholder: String = 'value';
  @Input() value: number;
  @Output() valueChange = new EventEmitter<number>();

  private defaultValue: number;
  valueOutput: number;

  constructor() {}

  ngOnInit() {
    this.defaultValue = +this.value;
    this.showValue();
  }

  onReset() {
    this.value = +this.defaultValue;
    this.showValue();
  }

  showValue() {
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
