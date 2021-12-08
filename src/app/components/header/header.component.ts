import { Subscription } from 'rxjs';
import { DataFlowService } from '../../services/data-flow.service';
import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, DoCheck , OnDestroy{
  public iterationCounter: number = 0;

  private iterationCounterSubscription: Subscription = new Subscription()
  constructor(private dataFlowService: DataFlowService) { }

  ngOnInit(): void {
  }

  ngDoCheck(): void {
    this.iterationCounterSubscription = this.dataFlowService.iterationCounter$.subscribe((count) => this.iterationCounter = count);
  }

  ngOnDestroy(): void {
    this.iterationCounterSubscription.unsubscribe();
  }

}
