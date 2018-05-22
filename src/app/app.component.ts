import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {GoogleMapsAPIWrapper} from '@agm/core';
import {FormGroup} from '@angular/forms';
import {AuthorizationService} from "./auth/auth.service";

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

  apiStatus: String = 'checking...';

  constructor(private authService: AuthorizationService) {}

  ngOnInit(): void {
    this.getStatus();
  }

  getStatus() {
    this.authService.getPing()
      .subscribe(
        (next) => { this.apiStatus = 'online'; },
        (error) => { this.apiStatus = 'offline'; }
        );
  }

}
