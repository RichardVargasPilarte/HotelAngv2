import { Component, OnInit } from '@angular/core';

import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';

import { ChangePassword } from '../../models/usuario.model';

import { JwtService } from '../../service/jwt.service';
import JwtCustomInterface from '../../models/jwtInterface';

@Component({
  selector: 'app-cambio-contrasena',
  templateUrl: './cambio-contrasena.component.html',
  styleUrl: './cambio-contrasena.component.scss',
})
export class CambioContrasenaComponent implements OnInit {
  public form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CambioContrasenaComponent>,
    public jwtService: JwtService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm(id?: string): void {
    const user = this.jwtService.getDecodedToken() as JwtCustomInterface;
    this.form = this.fb.group(
      {
        id: new FormControl(user.user_id),
        old_password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        new_password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        confirmPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
      },
      {
        validators: this.MustMatch('new_password', 'confirmPassword'),
      }
    );
  }

  changePassword(): void {
    let userPassword = new ChangePassword();
    userPassword = Object.assign(userPassword, this.form.value);
    this.jwtService.logout();
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['MustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ MustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
