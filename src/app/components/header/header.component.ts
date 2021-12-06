import { DataFlowService } from '../../services/data-flow.service';
import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, DoCheck , OnDestroy{
  iterationCounter: number = 0

  constructor(private dataFlowService: DataFlowService) { }

  ngOnInit(): void {
  }

  ngDoCheck() {
    this.dataFlowService.iterationCounter$.subscribe((count) => this.iterationCounter = count)
  }

  ngOnDestroy() {
    this.dataFlowService.iterationCounter$.unsubscribe()
  }

}
