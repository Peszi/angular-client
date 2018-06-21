import {AfterContentInit, Component, ContentChild, DoCheck, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {BACKGROUND_SCROLL, SLIDE_AND_SHOW} from '../../animations/background-scrolling.animation';
import {AnimationEvent} from '@angular/animations';

const HIDE_DELAY = 500;

@Component({
  selector: 'app-slide-button',
  templateUrl: './slide-button.component.html',
  styleUrls: ['./slide-button.component.css'],
  animations: [ SLIDE_AND_SHOW ]
})
export class SlideButtonComponent implements OnInit, DoCheck, AfterContentInit {
  @Input() topOffset: String = '200px';
  @Input() imgSrc: String = 'favicon.ico';

  @ViewChild('content') template: ElementRef;

  animationState: string;
  slideWidth: string;

  private timeoutHandler: number;

  constructor(private target: ElementRef) { }

  ngOnInit() {
    this.animationState = 'hide';
    this.target.nativeElement.style.top = this.topOffset;
    this.target.nativeElement.style.right = -110 + 'px';
  }

  ngDoCheck() {
    this.slideWidth = '-' + (this.template.nativeElement.clientWidth + 6) + 'px';
    this.target.nativeElement.style.right = this.slideWidth;
  }

  ngAfterContentInit() {
    this.slideWidth = '-' + (this.template.nativeElement.clientWidth + 6) + 'px';
    this.target.nativeElement.style.right = this.slideWidth;
  }

  onMouseOver() {
    this.animationState = 'show';
    clearTimeout(this.timeoutHandler);
  }

  onMouseOut() {
    this.timeoutHandler = setTimeout(() => {
      this.animationState = 'hide';
    }, HIDE_DELAY);
  }
}
