import { FormDataService } from './../../services/form-data.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-welcome-form',
  templateUrl: './welcome-form.component.html',
  styleUrls: ['./welcome-form.component.css']
})
export class WelcomeFormComponent implements OnInit {

  public formData: any = {width: 600, height: 400, figure: 'thirdFigure'}
  //formControls
  public widthControl = new FormControl('', [Validators.required, Validators.min(400), Validators.max(900)])
  public heightControl = new FormControl('', [Validators.required, Validators.min(200), Validators.max(500)])
  constructor(private formDataService: FormDataService) { }

  ngOnInit(): void {
  }
  public onSubmit() {
    localStorage.setItem('formData', JSON.stringify(this.formData))
    this.formDataService.provideFormData(this.formData)
  }


}
