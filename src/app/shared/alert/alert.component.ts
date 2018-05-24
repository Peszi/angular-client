import { Component, OnInit } from '@angular/core';
import {b} from '@angular/core/src/render3';
import {animate, AnimationEvent, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styles: [':host { width: 100%; }'],
  animations: [
    trigger('visibilityState', [
      state('open', style( {
        height: '*',
        opacity: '0.0',
        display: 'block'
      })),
      state('show', style( {
        height: '*',
        opacity: '1.0'
      })),
      state('visible', style( {
        height: '*',
        opacity: '1.0'
      })),
      state('hide', style( {
        height: '*',
        opacity: '0.0'
      })),
      state('close', style( {
        height: '0',
        opacity: '0.0',
        display: 'none'
      })),
      transition('* => open', animate(250)),
      transition('* => show', animate(1000)),
      transition('* => visible', animate(2000)),
      transition('* => hide', animate(1000)),
      transition('hide => close', animate(250)),
      transition('* => *', animate(0))
    ]),
  ]
})
export class AlertComponent implements OnInit {

  state: String = 'close';
  errorMessage: String = 'invalid error!';
  errorTitle: String = 'Alert!';
  private isShowing: boolean;
  private isError: boolean;

  constructor() { }

  ngOnInit() {}

  onEnd(event: AnimationEvent) {
    if (event.toState === 'open') {
      this.state = 'show';
    } else if (event.toState === 'show') {
      this.state = 'visible';
    } else if (event.toState === 'visible') {
      this.state = 'hide';
    } else if (event.toState === 'hide') {
      this.state = 'close';
    } else if (event.toState === 'close') {
      this.isShowing = false;
    }
  }

  showError(message: string) {
    this.showAlert(message, true);
  }

  showSuccess(message: string) {
    this.showAlert(message, false);
  }

  private showAlert(message: string, error: boolean) {
    this.errorMessage = message;
    if (this.isShowing === false) {
      this.isError = error;
      this.isShowing = true;
      if (error) {
        this.errorTitle = 'Error!';
      } else {
        this.errorTitle = 'Success!';
      }
      this.state = 'open';
    }
  }
}
