import { DataFlowService } from '../../services/data-flow.service';
import { Component, DoCheck, OnInit } from '@angular/core';


@Component({
  selector: 'app-board-menu',
  templateUrl: './board-menu.component.html',
  styleUrls: ['./board-menu.component.css']
})
export class BoardMenuComponent implements OnInit, DoCheck {

  isPlayed: boolean = false
  isPaused: boolean = false
  speed: number = 10

  constructor(private dataFlowService: DataFlowService) { }

  ngOnInit(): void {
  }

  ngDoCheck() {
  }
  //start the game
  start() {
    this.isPlayed = true
    this.isPaused = false
    this.dataFlowService.toggleStart(true)
  }
  //pause the game
  pause() {
    this.isPlayed = false
    this.isPaused = true
    this.dataFlowService.toggleStart(false)
  }
  //changing speed between generation update
  changeSpeed(e: any) {
    this.speed = 11 - +e.target.value
    this.dataFlowService.provideChangedSpeed(true)
    this.dataFlowService.provideSpeed(this.speed)
  }
  //changing cell cize
  changeGrid(e: any) {
    this.dataFlowService.provideCellSize(+e.target.value)
  }

  //reset grid to the initial state
  reset() {
    this.dataFlowService.reset(true)
  }

}
