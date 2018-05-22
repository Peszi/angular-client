import {Directive, HostBinding, OnInit} from '@angular/core';
import {a} from '@angular/core/src/render3';

@Directive({
  selector: '[appLoadingButton]'
})
export class LoadingButtonDirective implements OnInit {
  @HostBinding('') animationState: any;

  constructor() {

  }

  ngOnInit(): void {
    console.log(this.animationState);
  }


}
