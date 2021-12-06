import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataFlowService {

  public isStarted$ = new Subject<boolean>()
  public cleared$ = new Subject<boolean>()
  public speed$ = new Subject<number>()
  public isChangedSpeed$ = new Subject<boolean>()
  public cellSize$ = new Subject<number>()
  //flow for generation counter
  public iterationCounter$ = new Subject<number>()


  //flow for start function (from board to board menu)
  public toggleStart(start: boolean) {
    this.isStarted$.next(start)
  }

  public reset(reset: boolean) {
    this.cleared$.next(reset)
  }

  public provideSpeed(speed: number) {
    this.speed$.next(speed)
  }

  public provideChangedSpeed(isChanged: boolean) {
    this.isChangedSpeed$.next(isChanged)
  }

  public provideCellSize(size: number) {
    this.cellSize$.next(size)
  }

  public provideIterationCounter(count: number) {
    this.iterationCounter$.next(count)
  }
}
