import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';

import { AlojamientoService } from '../../../service/alojamiento.service';
import { Alojamiento } from '../../../models/alojamiento.model';

import { FormularioAlojamientoComponent } from '../formulario-alojamiento/formulario-alojamiento.component';

import Swal from 'sweetalert2';

import { NgxSpinnerService } from 'ngx-spinner';

import { RoleId } from '../../../shared/types/Roles.types';
import { Permission } from '../../../shared/types/permissions.types';
import { JwtService } from '../../../service/jwt.service';

@Component({
  selector: 'app-listado-alojamiento',
  templateUrl: './listado-alojamiento.component.html',
  styleUrl: './listado-alojamiento.component.scss',
})
export class ListadoAlojamientoComponent implements OnInit, OnDestroy {
  public alojamientos: Alojamiento[] = [];
  refAloj: Observable<any>;
  subs: Subscription[] = [];
  public isLoaded = false;
  public dataSource: Alojamiento[] = [];
  displayedColumns: string[] = [
    'id',
    'nombre',
    'descripcion',
    'tiempo_estadia',
  ];
  success = false;
  roleIds = RoleId;
  permissions = new Permission();

  constructor(
    private _alojamientoService: AlojamientoService,
    private dialog: MatDialog,
    private spinnerService: NgxSpinnerService,
    private jwtService: JwtService
  ) {
    this.refAloj = this._alojamientoService.getList();
  }

  ngOnInit(): void {
    this.spinnerService.show();
    this.handleAlojRef();
    this.addActionsColumn();
  }

  ngOnDestroy(): void {
    this._alojamientoService.list = [];
    this.subs.map((sub) => sub.unsubscribe());
  }

  removeAccommodation(id: number): any {
    Swal.fire({
      title: '¿Esta seguro de eliminar este dato?',
      text: '¡No se podra recuperar este dato luego de ser eliminado!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this._alojamientoService.deleteAccommodation(id).subscribe((data) => {
          this.success = true;
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
    });
  }

  openDialog(tipo: string, id?: number): void {
    if (tipo === 'c') {
      this.dialog.open(FormularioAlojamientoComponent, {
        data: { type: tipo },
      });
    } else {
      const alojam = this.alojamientos.find((d) => d.id === id);
      this.dialog.open(FormularioAlojamientoComponent, {
        data: { type: tipo, alojam },
      });
    }
  }

  hasRole(roleId: number) {
    return this.jwtService.hasRole(roleId);
  }

  hasPermission(permissionId: number) {
    return this.jwtService.hasPermission(permissionId);
  }

  private handleAlojRef(): void {
    this.refAloj.subscribe((data) => {
      this.isLoaded = data !== null;
      this.alojamientos = data || [];
      this.dataSource = [...this.alojamientos];

      if (this.isLoaded) {
        this.spinnerService.hide();
      }
    });
  }

  hasUserPermissions(permissionIds: number[]) {
    return this.jwtService.hasPermissions(permissionIds);
  }

  addActionsColumn() {
    const permissionsIds = [
      this.permissions.Alojamiento.Update,
      this.permissions.Alojamiento.Delete,
    ];

    const hasPermissions = this.jwtService.hasPermissions(permissionsIds);
    if (hasPermissions) {
      this.displayedColumns.push('actions');
    }
  }
}
