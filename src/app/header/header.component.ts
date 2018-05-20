import {Component, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {NgbDropdown, NgbDropdownConfig} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @ViewChild('dropdown') private dropdown: NgbDropdown;

  constructor() {}

  ngOnInit() {
    this.dropdown.placement = 'bottom-right';
    this.dropdown.autoClose = 'outside';
  }

  onSubmit() {
    this.dropdown.close();
  }

}
