import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthorizationService} from './services/auth/auth.service';
import {Router} from '@angular/router';
import {SlideButtonComponent} from './shared/components/slide-button/slide-button.component';
import {WIGGLE_ANIM} from './shared/animations/background-scrolling.animation';
import {AlertService} from './services/alert.service';

// @ViewChild('myMap') gmapElement: GoogleMapsAPIWrapper;
// mapClicked(event: Event) {
//   this.gmapElement.panBy(1, 1);
// }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [ WIGGLE_ANIM ]
})
export class AppComponent implements OnInit {

  showConsole: boolean;
  sliderAnimation; string;

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.showConsole = false;
    this.alertService.alertSub.asObservable()
      .subscribe(() => {
        this.sliderAnimation = 'wiggle';
      });
  }

  getSliderText() {
    if (!this.showConsole) { return 'show alerts'; }
    return 'hide alerts';
  }

  onAnimEnd() {
    this.sliderAnimation = '';
  }
}
