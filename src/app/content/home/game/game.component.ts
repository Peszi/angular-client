import { Component, OnInit } from '@angular/core';
import {RefreshInterface} from '../refresh.interface';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, RefreshInterface {

  constructor() { }

  ngOnInit() {
  }

  onRefresh() {
    console.log('in game refresh works!');
  }

}
