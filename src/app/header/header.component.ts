import {Component, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {NgbDropdown} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @ViewChild('dropdown') private dropdown: NgbDropdown;

  loginForm: FormGroup;
  enableLogin: boolean;

  constructor() {}

  ngOnInit() {
    this.dropdown.placement = 'bottom-right';
    this.dropdown.autoClose = 'outside';
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, Validators.required)
    });
    this.loginForm.statusChanges.subscribe((status) => {
     console.log(status);
      this.enableLogin = (status === 'VALID');
    });
  }

  onDiscard() {
    this.dropdown.close();
  }

  onSubmit() {
    console.log(this.loginForm.value);
    this.dropdown.close();
  }

}
