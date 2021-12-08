import { DataFlowService } from '../../services/data-flow.service';
import { Component, DoCheck, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import radio from './data/radio-input-data.json';
import { Router } from '@angular/router';

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
  public radioInputs: any = JSON.parse(JSON.stringify(radio));

  //formControls
  public widthControl = new FormControl('', [Validators.required, Validators.min(400), Validators.max(900)]);
  public heightControl = new FormControl('', [Validators.required, Validators.min(200), Validators.max(500)]);

  //for responsive canvas
  public windowWidth: number = document.documentElement.scrollWidth;
  public isMobile: boolean = false;

  constructor(private dataFlowService: DataFlowService, private router: Router) { }

  ngOnInit(): void {
    this.windowWidth <= 550 ? (this.isMobile = true) : (this.isMobile = false);
    this.doMobile();
  }

  ngDoCheck(): void {
    this.dataFlowService.formData$.subscribe((data) => {
      this.formData.figure = data.figure;
    })
  }

  public doMobile(): void {
    this.windowWidth = document.documentElement.clientWidth;
    if (this.windowWidth <= 550 && this.isMobile) {
      this.isMobile = false;
      this.formData.width = 300;
      this.formData.height = 300;

      this.widthControl = new FormControl('', [
        Validators.required,
        Validators.min(200),
        Validators.max(300)
      ]);

      this.heightControl = new FormControl('', [
        Validators.required,
        Validators.min(200),
        Validators.max(300)
      ]);
    }
    if (this.windowWidth >= 550 && !this.isMobile) {
      this.isMobile = true;
      this.formData.width = 600;
      this.formData.height = 400;

      this.widthControl = new FormControl('', [
        Validators.required,
        Validators.min(400),
        Validators.max(900)
      ]);

      this.heightControl = new FormControl('', [
        Validators.required,
        Validators.min(200),
        Validators.max(500)
      ]);
    }
  }

  //data pass with Router
  public goToBoard(): void {
    this.router.navigate(['/game-of-life'], {state: {data: this.formData}});
}
}
