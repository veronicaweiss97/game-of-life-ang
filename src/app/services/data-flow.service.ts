import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataFlowService {

  public isStarted$ = new Subject<boolean>();
  public cleared$ = new Subject<boolean>();
  public speed$ = new Subject<number>();
  public isChangedSpeed$ = new Subject<boolean>();
  public cellSize$ = new Subject<number>();
  //flow for generation counter
  public iterationCounter$ = new Subject<number>();


  //flow for start function (from board to board menu)
  public _toggleStart(start: boolean): void {
    this.isStarted$.next(start);
  }

  public _reset(reset: boolean): void {
    this.cleared$.next(reset);
  }

  public _provideSpeed(speed: number): void {
    this.speed$.next(speed);
  }

  public _provideChangedSpeed(isChanged: boolean): void {
    this.isChangedSpeed$.next(isChanged);
  }

  public _provideCellSize(size: number): void {
    this.cellSize$.next(size);
  }

  public _provideIterationCounter(count: number): void {
    this.iterationCounter$.next(count);
  }
}
