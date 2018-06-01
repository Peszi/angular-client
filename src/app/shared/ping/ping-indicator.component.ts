import { Component, OnInit } from '@angular/core';
import {AuthorizationService} from '../../services/auth/auth.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-ping-indicator',
  template: '<span class="badge badge-primary indicator" (click)="getStatus()" [@indicatorStatus]="statusState">{{ statusMessage }}</span>',
  styles: [`
    .indicator {
      cursor: pointer;
    }
    .indicator:hover {
      background-color: #1e7e34;
    }
  `],
  animations: [
    trigger('indicatorStatus', [
      state('checking', style( {
        backgroundColor: '#007bff'
      })),
      state('success', style( {
        backgroundColor: '#28a745'
      })),
      state('fail', style( {
        backgroundColor: '#dc3545'
      })),
      transition('* <=> *', animate(750))
    ])
  ]
})
export class PingIndicatorComponent implements OnInit {

  statusState: String;
  statusMessage: String;

  constructor(private authService: AuthorizationService) {}

  ngOnInit() {
    this.getStatus();
  }

  getStatus() {
    this.setChecking();
    this.authService.getApiStatusRequest()
      .subscribe(
        () => { this.setOnline(); },
        () => { this.setOffline(); }
      );
  }

  private setChecking() {
    this.statusState = 'checking';
    this.statusMessage = 'checking...';
  }

  private setOnline() {
    this.statusState = 'success';
    this.statusMessage = 'online';
  }

  private setOffline() {
    this.statusState = 'fail';
    this.statusMessage = 'offline';
  }
}
