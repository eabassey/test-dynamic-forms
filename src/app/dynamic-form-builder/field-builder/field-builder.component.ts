import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Validators, FormGroup } from '@angular/forms';
import { Field } from 'src/app/app.component';
import {map, tap} from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'field-builder',
  templateUrl: 'field-builder.component.html'
})
export class FieldBuilderComponent implements OnInit, OnChanges {
  @Input() field:Field;
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
  isHidden$: Observable<boolean>;
  isDisabled$: Observable<boolean>;
  
  constructor() { }
  
  ngOnInit() {
    const validators = this.field.validators.map(val => this.handleValidator(val));
    this.form.controls[this.field.name].setValidators(validators);
    this.isHidden$ = this.form.valueChanges.pipe(map(val => this.field.hidden || this.isHiddenWhen()), tap(console.log));
    this.isDisabled$ = this.form.valueChanges.pipe(map(val => this.field.disabled || this.isDisabledWhen()), tap(console.log));

  }

  ngOnChanges() {
  }


  isHiddenWhen() {
    if (!!this.field.hiddenWhen) {
     return this.field.hiddenWhen.map(cond => {
        const fieldControl = this.form.controls[cond.field];
        switch (cond.operator) {
          case 'is': {
            if (cond.value === 'valid') {
             return fieldControl.valid ? true : false;
            } else if (cond.value === 'invalid') {
              return fieldControl.invalid ? true : false;
            }
            return false;
          }
          case 'equals': {
            return fieldControl.value === cond.value ? true : false;
          }
          case 'contains': {
            return fieldControl.value.includes(cond.value) ? true : false;
          }

        }
      }).includes(true);
    }

  }

  isDisabledWhen() {
    if (!!this.field.disableWhen) {
     return this.field.disableWhen.map(cond => {
        const fieldControl = this.form.controls[cond.field];
        switch (cond.operator) {
          case 'is': {
            if (cond.value === 'valid') {
             return fieldControl.valid ? true : false;
            } else if (cond.value === 'invalid') {
              return fieldControl.invalid ? true : false;
            }
            return false;
          }
          case 'equals': {
            return fieldControl.value === cond.value ? true : false;
          }
          case 'contains': {
            return fieldControl.value.includes(cond.value) ? true : false;
          }

        }
      }).includes(true);
    }

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
