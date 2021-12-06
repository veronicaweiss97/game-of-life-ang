import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  public formData$ = new Subject<any>()

  constructor() { }

  public _provideFormData(data: any): void {
    this.formData$.next(data)
  }
}
