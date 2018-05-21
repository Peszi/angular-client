import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs/index";
import {a, e} from "@angular/core/src/render3";
import {AbstractControl} from "@angular/forms";

@Directive({
  selector: '[formErrorHandler]'
})
export class FormErrorHandlerDirective implements OnInit{
  inProgress: boolean;

  @Input('formErrorHandler') formErrorHandler: AbstractControl;
  @Input('messages') errorMessages: ErrorMessage[];

  constructor(element: ElementRef) {
    element.nativeElement.style.backgroundColor = 'yellow';
  }

  ngOnInit(): void {
    this.formErrorHandler.statusChanges.subscribe((status) => {
      this.inProgress = (status === 'PENDING');
      if (status === 'INVALID') {
        for (let error of this.errorMessages) {
          if (this.formErrorHandler.hasError(error.error)) {
            console.log(error.message);
          }
        }

        // console.log(this.errorMessages);

        // this.emailError = 'invalid';
      } else {
        // this.emailError = '';
      }
      if (status === 'VALID') {

      }
    });

  }

}

export interface ErrorMessage {
  error: string;
  message: string;
}
