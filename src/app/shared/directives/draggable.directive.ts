import {Directive, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective implements OnInit {
  @Input() appDraggable: boolean;
  @Input('dragHandler') dragHandler: HTMLElement;

  private isDragging;
  private startX: number;
  private startY: number;

  constructor(private element: ElementRef) { }

  ngOnInit() {
    console.log(this.element.nativeElement);
    this.element.nativeElement.style.position = 'absolute';
    this.element.nativeElement.style.top = (document.body.scrollHeight / 2 - this.element.nativeElement.scrollHeight / 2) + 'px';
    this.element.nativeElement.style.left = (document.body.scrollWidth / 2 - this.element.nativeElement.scrollWidth / 2) + 'px';
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (this.appDraggable && this.dragHandler !== null && event.target !== this.dragHandler) {
      return;
    }
    this.isDragging = true;
    this.startY = event.clientY - this.element.nativeElement.style.top.replace('px', '');
    this.startX = event.clientX - this.element.nativeElement.style.left.replace('px', '');
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isDragging = false;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      const limitX = document.body.scrollWidth - this.element.nativeElement.offsetWidth - 1;
      const limitY = document.body.scrollHeight - this.element.nativeElement.offsetHeight;
      console.log(document.body.scrollWidth + ' to ' +  this.element.nativeElement.scrollWidth);
      let positionX = event.clientX - this.startX;
      let positionY = event.clientY - this.startY;
      if (positionY < 0) { positionY = 0; }
      if (positionY > limitY) { positionY = limitY; }
      if (positionX < 0) { positionX = 0; }
      if (positionX > limitX) { positionX = limitX; }
      this.element.nativeElement.style.top = positionY + 'px';
      this.element.nativeElement.style.left = positionX + 'px';
    }
  }
}
