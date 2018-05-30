import {animate, state, style, transition, trigger} from '@angular/animations';
import {AfterViewInit, Component, ElementRef, OnInit, Renderer2} from '@angular/core';


@Component({
  selector: 'app-time-picker',
  template: '<ng-content></ng-content>',
  styles: [`
    :host {
      class: button;
      margin: 2rem !important;
    }
    :host:focus {
      box-shadow: 0 0 0 0.25rem red;
    }
    :host:active {
      box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.5);
    }
  `],
})
export class TimePickerComponent implements OnInit {

  constructor(private element: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.renderer.setAttribute(this.element.nativeElement, 'tabindex', '0');
  }

}
