import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {GoogleMapsAPIWrapper} from '@agm/core';
import {FormGroup} from '@angular/forms';

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

  constructor() {

  }

  ngOnInit(): void {

  }


}
