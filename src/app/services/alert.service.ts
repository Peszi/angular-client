import {Injectable, OnInit} from '@angular/core';
import {AlertMessage} from './user-data.service';
import {Subject} from 'rxjs';

export class AlertService {

  alertSub = new Subject<void>();
  private alertQueue: AlertMessage[] = [];

  constructor() {}

  showAlert(alert: AlertMessage) {
    this.alertQueue.push(alert);
    if (this.alertQueue.length === 1) {
      this.alertSub.next();
    }
  }

  getAlert() {
    return this.alertQueue.shift();
  }

  getQueueLength() {
    return this.alertQueue.length;
  }
}
