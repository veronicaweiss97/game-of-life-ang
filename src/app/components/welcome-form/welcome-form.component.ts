import { FormDataService } from './../../services/form-data.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-welcome-form',
  templateUrl: './welcome-form.component.html',
  styleUrls: ['./welcome-form.component.css']
})
export class WelcomeFormComponent implements OnInit {
  public formData: any = {width: 600, height: 400, figure: 'thirdFigure'}
  constructor(private formDataService: FormDataService) { }

  ngOnInit(): void {
  }
  public _onSubmit() {
    localStorage.setItem('formData', JSON.stringify(this.formData))
    this.formDataService._provideFormData(this.formData)
  }


}
