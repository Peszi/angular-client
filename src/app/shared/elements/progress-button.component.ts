import {animate, AnimationEvent, state, style, transition, trigger} from '@angular/animations';
import {AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {BACKGROUND_SCROLL} from '../animations/background-scrolling.animation';
import {NgForm} from '@angular/forms';


@Component({
  selector: 'app-progress-btn',
  templateUrl: './progress-button.component.html',
  animations: [ BACKGROUND_SCROLL ]
})
export class ProgressButtonComponent implements OnInit {
  @Input('form') form: NgForm;
  @Input('btnClass') btnClass: string;
  @Input('disabled') disabled: boolean;

  loadingStatus: String = 'normal';

  constructor(private element: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    // this.renderer.addClass(this.element.nativeElement, this.btnClass);
  }

  protected onSubmit() {
    if (this.form.valid) {
      this.loadingStatus = 'pending';
    } else {
      this.setFailed();
    }
  }

  setSucceed() {
    this.loadingStatus = 'success';
  }

  setFailed() {
    this.loadingStatus = 'fail';
  }

  protected onAnimationEnd(event: AnimationEvent) {
    if (this.loadingStatus === 'success' || this.loadingStatus === 'fail') {
      setTimeout(() => {
        this.loadingStatus = 'normal';
      }, 0);
    } else if (this.loadingStatus === 'normal') {} else {
      if (event.toState === 'pending') {
        setTimeout(() => {
          this.loadingStatus = 'pendingOn';
        }, 0);
      } else {
        setTimeout(() => {
          this.loadingStatus = 'pending';
        }, 0);
      }
    }
  }

}
