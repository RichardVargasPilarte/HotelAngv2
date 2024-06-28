import { Component, Inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ClienteService } from '../../../service/cliente.service';
import { Cliente, IClientResponse } from '../../../models/cliente.model';

interface DialogData {
  type: string;
  client?: Cliente | IClientResponse;
}

@Component({
  selector: 'app-formulario-cliente',
  templateUrl: './formulario-cliente.component.html',
  styleUrl: './formulario-cliente.component.scss',
})
export class FormularioClienteComponent {
  public clientes = new Cliente();
  public edit!: boolean;
  subs: Subscription[] = [];
  public selected = '0';
  public form!: FormGroup;

  TipoDocumento: string[] = ['Cedula', 'Pasaporte'];

  constructor(
    private clienteServicio: ClienteService,
    public dialogRef: MatDialogRef<FormularioClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  createForm(id?: string): void {
    if (this.data.type === 'c') {
      this.form = this.fb.group({
        id: new FormControl(-1),
        nombre: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
        apellido: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
        telefono: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        tipo_identificacion: new FormControl('', [Validators.required]),
        num_identificacion: new FormControl('', [
          Validators.required,
          Validators.minLength(16),
        ]),
        email: new FormControl('', [Validators.email]),
        eliminado: new FormControl('NO'),
      });
    } else {
      const cliente: IClientResponse = this.data.client as IClientResponse;
      this.form = this.fb.group({
        id: cliente.id,
        nombre: new FormControl(cliente.nombre, [
          Validators.required,
          Validators.minLength(3),
        ]),
        apellido: new FormControl(cliente.apellido, [
          Validators.required,
          Validators.minLength(5),
        ]),
        telefono: new FormControl(cliente.telefono, [
          Validators.required,
          Validators.minLength(9),
        ]),
        tipo_identificacion: new FormControl(cliente.tipo_identificacion, [
          Validators.required,
          Validators.minLength(9),
        ]),
        num_identificacion: new FormControl(cliente.num_identificacion, [
          Validators.required,
          Validators.minLength(16),
        ]),
        email: new FormControl(cliente.email, [Validators.email]),
        eliminado: new FormControl('NO'),
      });
    }
  }

  saveCustomer(): void {
    let client = new Cliente();
    client = Object.assign(client, this.form.value);
    this.subs.push(
      this.clienteServicio.addCustomer(client).subscribe({
        next: () => {
          this.dialogRef.close();
        },
        error: (error: any) => console.log('Hubo un error' + error),
      })
    );
  }

  updateClient(): void {
    let client = new Cliente();
    client = Object.assign(client, this.form.value);
    this.subs.push(
      this.clienteServicio.updateClient(client.id!, client).subscribe({
        next: () => {
          this.dialogRef.close();
          (error: any) => console.log('Hubo un error' + error);
        },
      })
    );
  }

  get Form(): any {
    return this.form.controls;
  }
}
