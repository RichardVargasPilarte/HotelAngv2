import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { Habitacion } from '../../../models/habitacion.model';

import { HabitacionService } from '../../../service/habitacion.service';

import { Alojamiento } from '../../../models/alojamiento.model';

import { AlojamientoService } from '../../../service/alojamiento.service';

import { FormularioHabitacionComponent } from '../formulario-habitacion/formulario-habitacion.component';

import { NgxSpinnerService } from 'ngx-spinner';
import Swal, { SweetAlertResult } from 'sweetalert2';

import { JwtService } from '../../../service/jwt.service';
import { RoleId } from '../../../shared/types/Roles.types';
import { Permission } from '../../../shared/types/permissions.types';

@Component({
  selector: 'app-listado-habitacion',
  templateUrl: './listado-habitacion.component.html',
  styleUrl: './listado-habitacion.component.scss',
})
export class ListadoHabitacionComponent implements OnInit, OnDestroy {
  public habitaciones: Habitacion[] = [];
  public alojamientos: Alojamiento[] = [];
  public subs: Subscription[] = [];
  sub: Subscription | undefined;
  public isLoaded = false;
  public dataSource: Habitacion[] = [];
  refHabitacion!: Observable<any[] | null>;
  refAlojamiento!: Observable<any[] | null>;
  private isHabitacionesLoaded = false;
  private isAlojamientosLoaded = false;
  socket!: WebSocket;

  displayedColumns: string[] = [
    'id',
    'nombre',
    'nombre_alojamiento',
    'numero_personas',
    'precio',
    'estado',
  ];

  roleIds = RoleId;
  permissions = new Permission();

  constructor(
    private habitacionservice: HabitacionService,
    private alojamiento$: AlojamientoService,
    private dialog: MatDialog,
    private spinnerService: NgxSpinnerService,
    private jwtService: JwtService,
    private cdRef: ChangeDetectorRef
  ) {
    this.refHabitacion = this.habitacionservice.getList();
    this.refAlojamiento = this.alojamiento$.getList();
  }

  ngOnInit(): void {
    this.spinnerService.show();
    this.handleAlojamientoRef();
    this.handleHabitacionRef();
    this.addActionColumn();
  }

  ngOnDestroy(): void {
    this.habitacionservice.list = [];
    if (this.sub !== undefined) {
      this.sub.unsubscribe();
    }
  }

  async removeRoom(id: number): Promise<void> {
    const result: SweetAlertResult = await Swal.fire({
      title: '¿Esta seguro de eliminar este dato?',
      text: '¡No se podra recuperar este dato luego de ser eliminado!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    });
    if (result.isConfirmed) {
      this.habitacionservice.deleteRoom(id).subscribe((data) => {
        Swal.fire('Eliminado!', 'El dato ha sido eliminado.', 'success');
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      (error: string) =>
        console.log('Hubo un fallo al momento de eliminar el dato' + error);
      Swal.fire(
        'Cancelado',
        'El dato no fue eliminado y esta seguro :)',
        'error'
      );
    }
  }

  openDialog(tipo: string, id?: number): void {
    if (tipo === 'c') {
      this.dialog.open(FormularioHabitacionComponent, {
        data: { type: tipo },
      });
    } else {
      const habitac = this.habitaciones.find((d) => d.id === id);
      this.dialog.open(FormularioHabitacionComponent, {
        data: { type: tipo, hab: habitac },
      });
    }
  }

  hasRole(roleId: number) {
    return this.jwtService.hasRole(roleId);
  }

  hasPermission(permissionId: number) {
    return this.jwtService.hasPermission(permissionId);
  }

  private handleAlojamientoRef(): void {
    this.refAlojamiento.subscribe((data) => {
      this.isAlojamientosLoaded = data !== null;
      this.alojamientos = data || [];
      this.checkBothLoaded();
    });
  }

  private handleHabitacionRef(): void {
    this.refHabitacion.subscribe((data) => {
      this.isHabitacionesLoaded = data !== null;
      this.habitaciones = data || [];
      this.dataSource = this.habitaciones;
      this.cdRef.detectChanges();
      this.checkBothLoaded();
    });
  }

  private checkBothLoaded(): void {
    if (this.isAlojamientosLoaded && this.isHabitacionesLoaded) {
      this.spinnerService.hide();
      this.isLoaded = true;
    }
  }

  hasUserPermissions(permissionIds: number[]) {
    return this.jwtService.hasPermissions(permissionIds);
  }

  addActionColumn() {
    const persmissionIds = [
      this.permissions.Habitacion.Update,
      this.permissions.Habitacion.Delete,
    ];

    const hasPermission = this.hasUserPermissions(persmissionIds);
    if (hasPermission) {
      this.displayedColumns.push('actions');
    }
  }
}
