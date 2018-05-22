import {Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {AbstractControl} from '@angular/forms';

@Directive({
  selector: '[appFormError]'
})
export class FormErrorDirective implements OnInit {
  @Input('appFormError') formErrorHandler: AbstractControl;
  @Input('errorMessages') errorMessages: ErrorMessage[];

  private mainRenderer: Renderer2;
  private inputElement: any;
  private errorElement: any;

  constructor(element: ElementRef, private renderer: Renderer2) {
    this.mainRenderer = renderer;
    this.inputElement = element.nativeElement;
    this.createErrorElement(element.nativeElement, renderer);
    this.errorElement = this.inputElement.nextSibling;
  }

  createErrorElement(nativeElement: any, renderer: Renderer2): void {
    const errorText = this.renderer.createElement('small');
    this.renderer.addClass(errorText, 'help-block');
    this.renderer.addClass(errorText, 'text-muted');
    renderer.appendChild(nativeElement.parentElement, errorText);
  }

  ngOnInit(): void {
    this.formErrorHandler.markAsPending({onlySelf: true, emitEvent: true});
    this.formErrorHandler.statusChanges.subscribe((status) => {
      if (status === 'INVALID') {
        this.setErrorMessage(this.getCurrentError());
      } else if (status === 'VALID') {
        this.setErrorMessage('Correct!');
      } else {
        this.setErrorMessage('Checking...');
      }
      this.setSuccess(status === 'VALID');
    });
  }

  private getCurrentError(): string {
    for (const error of this.errorMessages) {
      if (this.formErrorHandler.hasError(error.error)) {
        return error.message;
      }
    }
    return 'Unknown error!';
  }

  private setErrorMessage(message: string): void {
    this.errorElement.innerText = message;
  }

  private setSuccess(enable: boolean): void {
    const successClass = 'is-valid';
    if (enable) {
      this.mainRenderer.addClass(this.inputElement, successClass);
    } else {
      this.mainRenderer.removeClass(this.inputElement, successClass);
    }
  }
}

export interface ErrorMessage {
  error: string;
  message: string;
}
