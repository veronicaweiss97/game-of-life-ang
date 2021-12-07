import { DataFlowService } from '../../services/data-flow.service';
import { Component, DoCheck, OnInit } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-welcome-form',
  templateUrl: './welcome-form.component.html',
  styleUrls: ['./welcome-form.component.css']
})
export class WelcomeFormComponent implements OnInit, DoCheck {

  public formData: {width: number, height: number, figure: string} = {
    width: 600,
    height: 400,
    figure: 'default'
  }

  public radioInputs: {}[] = [
    {
      formData: {
      width: 600,
      height: 400,
      figure: 'firstFigure'
      },
      image: '../../../assets/img/firstFigure.png',
      value: 'firstFigure'
    },
    {
      formData: {
        width: 600,
        height: 400,
        figure: 'secondFigure'
      },
      image: '../../../assets/img/secondFigure.png',
      value: 'secondFigure'
    },
    {
      formData: {
        width: 600,
        height: 400,
        figure: 'thirdFigure'
      },
      image: '../../../assets/img/thirdFigure.png',
      value: 'thirdFigure'
    },
    {
      formData: {
        width: 600,
        height: 400,
        figure: 'default'
      },
      image: '../../../assets/img/4.png',
      value: 'default'
    },
  ]
  //formControls
  public widthControl = new FormControl('', [Validators.required, Validators.min(400), Validators.max(900)])
  public heightControl = new FormControl('', [Validators.required, Validators.min(200), Validators.max(500)])

  constructor(private dataFlowService: DataFlowService) { }

  ngOnInit(): void {

  }
  public onSubmit() {
    localStorage.setItem('formData', JSON.stringify(this.formData))
  }

  ngDoCheck(): void {
    this.dataFlowService.formData$.subscribe((data) => {
      this.formData.figure = data.figure
    })
  }
}
