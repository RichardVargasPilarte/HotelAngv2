import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';

import { UsuarioService } from '../../../service/usuario.service';
import { CreateUser, Usuario } from '../../../models/usuario.model';
import { GruposService } from '../../../service/grupos.service';
import { Grupos } from '../../../models/grupo.model';

interface DialogData {
  type: string;
  user?: Usuario;
}

@Component({
  selector: 'app-formulario-usuario',
  templateUrl: './formulario-usuario.component.html',
  styleUrl: './formulario-usuario.component.scss',
})
export class FormularioUsuarioComponent implements OnInit, OnDestroy {
  public usuarios: Usuario = new Usuario();
  public gruposCargados: Grupos[] = [];
  subs: Subscription[] = [];
  public form!: FormGroup;
  public refGrupos: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private usuarioServicio: UsuarioService,
    private grupoServicio: GruposService,
    public dialogRef: MatDialogRef<FormularioUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.gruposCargados = this.grupoServicio.list;
    this.refGrupos = this.grupoServicio.getList();
  }

  ngOnInit(): void {
    this.subs.push(
      this.refGrupos.subscribe(
        (groups_name) => (this.gruposCargados = groups_name)
      )
    );
    this.createForm();
  }

  ngOnDestroy() {
    this.gruposCargados = [];
    this.subs.map((sub) => sub.unsubscribe());
  }

  createForm(id?: string): void {
    if (this.data.type === 'c') {
      this.form = this.fb.group(
        {
          id: new FormControl(0),
          first_name: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
          ]),
          last_name: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
          ]),
          password: new FormControl('', [
            Validators.required,
            Validators.minLength(8),
          ]),
          confirmPassword: new FormControl('', [
            Validators.required,
            Validators.minLength(8),
          ]),
          username: new FormControl('', [
            Validators.required,
            Validators.minLength(5),
          ]),
          email: new FormControl('', [Validators.required, Validators.email]),
          direccion: new FormControl('', [
            Validators.required,
            Validators.minLength(10),
          ]),
          groups: new FormControl('', Validators.required),
          telefono: new FormControl('', Validators.required),
          eliminado: new FormControl('NO'),
        },
        {
          validators: this.MustMatch('password', 'confirmPassword'),
        }
      );
    }
  }

  saveUser(): void {
    let user = new CreateUser();
    user = Object.assign(user, this.form.value);
    this.subs.push(
      this.usuarioServicio.addUsers(user).subscribe({
        next: () => {
          this.dialogRef.close();
        },
        error: (error: unknown) => console.error(error),
      })
    );
  }

  get Form(): any {
    return this.form.controls;
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
