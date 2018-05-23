import {Component, ElementRef, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {BACKGROUND_SCROLL, SHOW_AND_HIDE} from '../animations/background-scrolling.animation';

@Component({
  selector: 'app-loading-button',
  template: '<ngb-alert [dismissible]="false" [@showElement]="visibilityMessage" (@showElement.done)="onEnd()" ' +
  'style="opacity: 0"><strong>Alert!</strong> {{ errorMessage }}</ngb-alert>',
  animations: [ SHOW_AND_HIDE ]
})
export class LoadingButtonComponent implements OnInit {

  visibilityMessage: String = 'hide';
  errorMessage: any;

  constructor() {}

  ngOnInit() {}

  onEnd() {
    this.visibilityMessage = 'hide';
  }

  showMessage(message: string) {
    this.errorMessage = message;
    this.visibilityMessage = 'show';
  }

}
