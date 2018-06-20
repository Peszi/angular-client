import {Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {b, e} from '@angular/core/src/render3';
import {AlertService} from '../../services/alert.service';

@Component({
  selector: 'app-console-dialog',
  templateUrl: './console-dialog.component.html',
  styleUrls: ['./console-dialog.component.css']
})
export class ConsoleDialogComponent implements OnInit {
  @ViewChild('console') consoleView: ElementRef;

  logsList: String[] = [];
  showConsole: boolean;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.alertService.alertSub
      .subscribe(() => {
        this.logsList.push(this.alertService.getAlert().message);
      });
  }

  onToggle() {
    if (this.showConsole === true) {
      this.showConsole = false;
    } else {
      this.showConsole = true;
    }
  }

  onClose() {
    this.showConsole = false;
  }
}
