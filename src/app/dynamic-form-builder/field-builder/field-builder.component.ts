import { Component, Input, OnInit } from '@angular/core';
import { Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'field-builder',
  templateUrl: 'field-builder.component.html'
})
export class FieldBuilderComponent implements OnInit {
  @Input() field:any;
  @Input() form:FormGroup;
  errorMessages = {
    required: '',
    minLength: '',
    maxLength: ''
  };

  get isValid() { return this.form.controls[this.field.name].valid; }
  get isDirty() { return this.form.controls[this.field.name].dirty; }
  get fieldErrors() { return this.form.controls[this.field.name].errors; }
  get showRequiredSign() { return this.field.validators.map(val => val.type).some(type => type === 'required')}

  constructor() { }

  ngOnInit() {
    const validators = this.field.validators.map(val => this.handleValidator(val));
    this.form.controls[this.field.name].setValidators(validators);
  }



  handleValidator(validator) {
    switch (validator.type) {
      case 'required': {
        this.errorMessages.required = validator.errorMessage;
        return Validators.required;
      }
      case 'minLength': {
        this.errorMessages.minLength = validator.errorMessage;
        return Validators.minLength(validator.value);
      }
      case 'maxLength': {
        this.errorMessages.maxLength = validator.errorMessage;
        return Validators.maxLength(validator.value);
      }
    }
  }

}
