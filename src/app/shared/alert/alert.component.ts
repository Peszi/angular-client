import { Component, OnInit } from '@angular/core';
import {b} from '@angular/core/src/render3';
import {animate, AnimationEvent, state, style, transition, trigger} from '@angular/animations';
import {AlertService} from '../../services/alert.service';
import {Alert} from 'selenium-webdriver';
import {AlertMessage} from '../../services/user-data.service';

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
      transition('* => open', animate(100)),
      transition('* => show', animate(500)),
      transition('* => visible', animate(2000)),
      transition('* => hide', animate(500)),
      transition('hide => close', animate(100)),
      transition('* => *', animate(0))
    ]),
  ]
})
export class AlertComponent implements OnInit {

  state: String = 'close';
  errorMessage: String = 'invalid error!';
  errorTitle: String = 'Alert!';
  private isShowing: boolean;
  isError: boolean;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.alertService.alertSub
      .subscribe(() => {
          if (!this.isShowing) {
            this.checkQueue();
          }
      });
  }

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
      setTimeout(() => {
        this.checkQueue();
      }, 0);
    }
  }

  checkQueue() {
    const alert = this.alertService.getAlert();
    if (alert) {
      this.showAlert(alert);
    }
  }

  showAlert(alert: AlertMessage) {
    this.errorMessage = alert.message;
    if (this.isShowing === false) {
      this.isError = alert.error;
      this.isShowing = true;
      if (alert.error) {
        this.errorTitle = 'Error!';
      } else {
        this.errorTitle = 'Success!';
      }
      this.state = 'open';
    }
  }
}
