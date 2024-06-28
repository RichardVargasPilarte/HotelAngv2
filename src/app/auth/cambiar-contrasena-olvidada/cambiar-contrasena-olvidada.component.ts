import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

import Swal from 'sweetalert2';

import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { ReestablecerPasswordService } from '../../service/reestablecer-password.service';

@Component({
  selector: 'app-cambiar-contrasena-olvidada',
  templateUrl: './cambiar-contrasena-olvidada.component.html',
  styleUrl: './cambiar-contrasena-olvidada.component.scss',
})
export class CambiarContrasenaOlvidadaComponent implements OnInit {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  token!: string;
  resetSuccessful = false;

  public form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private reestablecerContrasenaService: ReestablecerPasswordService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.token = params.get('token') ?? '';
    });

    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group(
      {
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        confirmPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
      },
      {
        validators: this.MustMatch('password', 'confirmPassword'),
      }
    );
  }

  resetUserPassword() {
    const { password } = this.form.value;

    this.reestablecerContrasenaService
      .resetPassword(this.token, password)
      .subscribe({
        next: (res) => {
          this.resetSuccessful = true;

          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'La contrseña a sido cambiada correctamente',
            showConfirmButton: false,
            timer: 2500,
          });

          this.navigateToLogin();
        },
        error: (error: any) => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title:
              'A ocurrido un error al momento de cambiar la contraseña, vuelva a intententar lo nuevamente',
            showConfirmButton: false,
            timer: 2500,
          });
        },
      });
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

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
