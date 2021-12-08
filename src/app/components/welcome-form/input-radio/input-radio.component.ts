import { DataFlowService } from '../../../services/data-flow.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-input-radio',
  templateUrl: './input-radio.component.html',
  styleUrls: ['./input-radio.component.css']
})
export class InputRadioComponent implements OnInit {

  @Input() input: any

  constructor(private dataFlowService: DataFlowService) { }

  ngOnInit(): void {
  }

  public selected(data: { width: number; height: number; figure: string;}): void {
    this.dataFlowService.provideFormData(data);
  }

}
