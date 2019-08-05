import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

interface Field {
  type: string;
  name: string;
  label: string;
  value?: any;
  options?: {key: string, label: string}[];
  placeholder?: string;
  validators?: FieldValidator[];

}

interface FieldValidator {
  type: 'required' | 'minLength' | 'maxLength' | 'range';
  value: boolean | number | { min: number; max: number};
  errorMessage: string;
}



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public form: FormGroup;
  unsubcribe: any

  public fields: Field[] = [
    {
      type: 'text',
      name: 'firstName',
      label: 'First Name',
      value: '',
      validators: [
        {type: 'required', value: true, errorMessage: 'First name always is required' },
      { type: 'minLength', value: 3, errorMessage: 'First name has to be more than 3'},
      { type: 'maxLength', value: 7, errorMessage: 'This is very necessary....'}
    ]
    },
    {
      type: 'text',
      name: 'lastName',
      label: 'Last Name',
      value: '',
      validators: []
    },
    {
      type: 'text',
      name: 'email',
      label: 'Email',
      value: '',
      validators: []
    },

    {
      type: 'file',
      name: 'picture',
      label: 'Picture',
      validators: []
      // onUpload: this.onUpload.bind(this)
    },
    {
      type: 'dropdown',
      name: 'country',
      label: 'Country',
      value: 'in',
      validators: [],
      options: [
        { key: 'in', label: 'India' },
        { key: 'us', label: 'USA' }
      ]
    },
    {
      type: 'radio',
      name: 'country',
      label: 'Country',
      value: 'in',
      validators: [],
      options: [
        { key: 'm', label: 'Male' },
        { key: 'f', label: 'Female' }
      ]
    },
    {
      type: 'checkbox',
      name: 'hobby',
      label: 'Hobby',
      validators: [],
      options: [
        { key: 'f', label: 'Fishing' },
        { key: 'c', label: 'Cooking' }
      ]
    }
  ];

  constructor() {
    this.form = new FormGroup({
      fields: new FormControl(JSON.stringify(this.fields))
    })
    this.unsubcribe = this.form.valueChanges.subscribe((update) => {
      console.log(update);
      this.fields = JSON.parse(update.fields);
    });
  }

  onUpload(e) {
    console.log(e);

  }

  getFields() {
    return this.fields;
  }

  ngDestroy() {
    this.unsubcribe();
  }
}
