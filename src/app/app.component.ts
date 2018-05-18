import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {GoogleMapsAPIWrapper} from '@agm/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  lat = 51.678418;
  lng = 7.809007;

  @ViewChild('myMap') gmapElement: GoogleMapsAPIWrapper;

  // ciclesList: CircleData[] = [];

  constructor() {

  }

  ngOnInit(): void {

  }

  mapClicked(event: Event) {
    this.gmapElement.panBy(1, 1);
  }

}

export class CircleData {
  lat: number;
  lng: number;
  radius: number;

  constructor(lat: number, lng: number, radius: number) {
    this.lat = lat;
    this.lng = lng;
    this.radius = radius;
  }
}
