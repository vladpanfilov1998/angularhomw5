import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Router} from "@angular/router";

import {AuthService} from "../../services";
import {regex} from "../../constants";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formRegister: FormGroup;
  userNameError: string;

  constructor(private authService: AuthService, private router: Router) {
    this._createForm();
  }

  ngOnInit(): void {
  }

  register(): void {
    const value = this.formRegister.getRawValue();
    delete value.confirmPassword;
    this.authService.register(value).subscribe({
      next: () => this.router.navigate(['login']),
      error: e => this.userNameError = e.errors.username[0]
    })

  }

  private _createForm(): void {
    this.formRegister = new FormGroup({
      username: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern(regex.username)
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern(regex.password),
      ]),
      confirmPassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern(regex.password),
      ]),
    }, [this._checkPassword])
  }

  private _checkPassword(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')
    const confirmPassword = form.get('confirmPassword')
    return password?.value === confirmPassword?.value ? null : {notSame: true}
  }
}
