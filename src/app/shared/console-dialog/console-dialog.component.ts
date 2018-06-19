import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {e} from '@angular/core/src/render3';

@Component({
  selector: 'app-console-dialog',
  templateUrl: './console-dialog.component.html',
  styleUrls: ['./console-dialog.component.css']
})
export class ConsoleDialogComponent implements OnInit {

  private isDragging;
  private startX: number;
  private startY: number;

  constructor(private element: ElementRef) { }

  ngOnInit() {
    this.isDragging = false;
    this.element.nativeElement.style.position = 'relative';
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.startY = event.clientY - this.element.nativeElement.style.top.replace('px', '');
    this.startX = event.clientX - this.element.nativeElement.style.left.replace('px', '');
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    console.log('up');
    this.isDragging = false;

  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.isDragging = false;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    console.log(event);
    if (this.isDragging) {
      console.log()
      this.element.nativeElement.style.top = (event.clientX - this.startX) + 'px';
      this.element.nativeElement.style.left = (event.clientY - this.startY) + 'px';
    }
  }
}
