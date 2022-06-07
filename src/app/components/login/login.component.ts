import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

import {AuthService} from "../../services";
import {regex} from "../../constants";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  userNameError: string;

  constructor(private authService: AuthService, private router: Router) {
    this._createForm();
  }

  ngOnInit(): void {
  }

  login(): void {
    this.authService.login(this.formLogin.getRawValue()).subscribe({
        next: value => {
          this.authService.setToken(value);
          this.router.navigate(['cars'])
        },
        error: error => {
          this.userNameError = error.errors.username[0];
        }
      }
    )
  }

  private _createForm(): void {
    this.formLogin = new FormGroup({
      username: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern(regex.username),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern(regex.password),
      ]),
    })
  }
}
