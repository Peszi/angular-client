import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {b, e} from '@angular/core/src/render3';
import {AlertService} from '../../../services/alert.service';

@Component({
  selector: 'app-console-dialog',
  templateUrl: './console-dialog.component.html',
  styleUrls: ['./console-dialog.component.css']
})
export class ConsoleDialogComponent implements OnInit {
  @Input() show: boolean;
  @Output() showChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('console') consoleView: ElementRef;

  logsList: String[] = [];

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.alertService.alertSub
      .subscribe(() => {
        this.logsList.push(this.alertService.getAlert().message);
      });
  }

  onClose() {
    this.show = false;
    this.showChange.emit(this.show);
  }
}
