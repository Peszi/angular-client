import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthorizationService} from './services/auth.service';
import {Router} from '@angular/router';

// @ViewChild('myMap') gmapElement: GoogleMapsAPIWrapper;
// mapClicked(event: Event) {
//   this.gmapElement.panBy(1, 1);
// }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {

  }

}
