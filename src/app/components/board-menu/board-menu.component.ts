import { DataFlowService } from '../../services/data-flow.service';
import { Component, DoCheck, OnInit } from '@angular/core';


@Component({
  selector: 'app-board-menu',
  templateUrl: './board-menu.component.html',
  styleUrls: ['./board-menu.component.css']
})
export class BoardMenuComponent implements OnInit, DoCheck {

  isPlayed: boolean = false;
  isPaused: boolean = false;
  speed: number = 10;

  constructor(private dataFlowService: DataFlowService) { }

  ngOnInit(): void {
  }

  ngDoCheck(): void {
  }
  //start the game
  public _start(): void {
    this.isPlayed = true;
    this.isPaused = false;
    this.dataFlowService._toggleStart(true);
  }
  //pause the game
  public _pause(): void {
    this.isPlayed = false;
    this.isPaused = true;
    this.dataFlowService._toggleStart(false);
  }
  //changing speed between generation update
  public _changeSpeed(e: any): void {
    this.speed = 11 - +e.target.value;
    this.dataFlowService._provideChangedSpeed(true);
    this.dataFlowService._provideSpeed(this.speed);
  }
  //changing cell cize
  public _changeGrid(e: any): void {
    this.dataFlowService._provideCellSize(+e.target.value);
  }

  //reset grid to the initial state
  public _reset(): void {
    this.dataFlowService._reset(true);
  }

}
