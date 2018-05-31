import {Component, Input} from "@angular/core";

@Component({
  selector: 'app-property-input',
  templateUrl: './property-input.component.html',
  styles: [`
    :host {
    }
  `],
})
export class PropertyInputComponent {
  @Input('title') title: string;

  constructor() {}

}
