import {Directive, forwardRef} from '@angular/core';
import {AbstractControl, FormControl, NG_VALIDATORS, ValidationErrors, Validators} from "@angular/forms";

@Directive({
  selector: '[passwordRepeat]',
  providers: [{provide: NG_VALIDATORS,useExisting: PasswordRepeatDirective, multi: true}]
})
export class PasswordRepeatDirective implements Validators {

  constructor() {

  }

  validate(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const passwordRepeat = control.get('passwordRepeat');

    if (password?.value !== passwordRepeat?.value) {
      passwordRepeat?.setErrors({passwordRepeat: true});
      return {passwordRepeat: true};
    }
    return null;

  }

}
