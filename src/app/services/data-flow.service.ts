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
  //for radio inputs in form (inital view)
  public formData$ = new Subject<{ width: number; height: number; figure: string;}>();
  public radioImage$ = new Subject<string>();
  public radioValue$ = new Subject<string>();

  //flow for start function (from board to board menu)
  public toggleStart(start: boolean): void {
    this.isStarted$.next(start);
  }

  public reset(reset: boolean): void {
    this.cleared$.next(reset);
  }

  public provideSpeed(speed: number): void {
    this.speed$.next(speed);
  }

  public provideChangedSpeed(isChanged: boolean): void {
    this.isChangedSpeed$.next(isChanged);
  }

  public provideCellSize(size: number): void {
    this.cellSize$.next(size);
  }
  //flow for generation counter
  public provideIterationCounter(count: number): void {
    this.iterationCounter$.next(count);
  }
   //for radio inputs in form (inital view)
   public provideFormData(data: {width: number; height: number; figure: string;}): void {
    this.formData$.next(data)
   }
   public provideRadioImage(image: string) {
     this.radioImage$.next(image)
   }
   public provideRadioValue(value: string) {
     this.radioValue$.next(value)
   }
}
