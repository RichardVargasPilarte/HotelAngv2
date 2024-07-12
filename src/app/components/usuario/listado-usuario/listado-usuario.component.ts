import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { UsuarioService } from '../../../service/usuario.service';
import { GruposService } from '../../../service/grupos.service';
import { Usuario } from '../../../models/usuario.model';
import { Grupos } from '../../../models/grupo.model';

import { FormularioUsuarioComponent } from '../formulario-usuario/formulario-usuario.component';
import { ActualizarUsuarioComponent } from '../actualizar-usuario/actualizar-usuario.component';

import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { RoleId } from '../../../shared/types/Roles.types';
import { Permission } from '../../../shared/types/permissions.types';
import { JwtService } from '../../../service/jwt.service';

@Component({
  selector: 'app-listado-usuario',
  templateUrl: './listado-usuario.component.html',
  styleUrl: './listado-usuario.component.scss',
})
export class ListadoUsuarioComponent implements OnInit, OnDestroy {
  public usuarios: Usuario[] = [];
  public grupos: Grupos[] = [];
  public subs: Subscription[] = [];
  sub: Subscription | undefined;
  public isLoaded = false;
  public dataSource: Usuario[] = [];
  refUsuarios!: Observable<any[] | null>;
  refGrupos!: Observable<any[] | null>;
  displayedColumns: string[] = [
    'id',
    'first_name',
    'last_name',
    'username',
    'groups',
  ];

  roleIds = RoleId;
  permissions = new Permission();

  constructor(
    private usuariosServicio: UsuarioService,
    private grupos$: GruposService,
    public dialog: MatDialog,
    private spinnerService: NgxSpinnerService,
    private jwtService: JwtService,
    private cdRef: ChangeDetectorRef
  ) {
    this.refUsuarios = this.usuariosServicio.getList();
    this.refGrupos = this.grupos$.getList();
  }

  async ngOnInit(): Promise<void> {
    this.spinnerService.show();
    this.handleUsuariosRef();
    this.addActionsColumns();
  }

  private handleUsuariosRef(): void {
    this.refUsuarios.subscribe((data) => {
      this.isLoaded = data !== null;
      this.usuarios = data || [];
      this.dataSource = [...this.usuarios];
      this.cdRef.detectChanges();
      if (this.isLoaded) this.spinnerService.hide();
    });
  }

  ngOnDestroy(): void {
    this.usuariosServicio.list = [];
    if (this.sub !== undefined) {
      this.sub.unsubscribe();
    }
  }

  deleteUser(id: number): unknown {
    return Swal.fire({
      title: '¿Esta seguro de eliminar este dato?',
      text: '¡No se podra recuperar este dato luego de ser eliminado!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.spinnerService.show();
        this.usuariosServicio.deleteUser(id).subscribe({
          next: (data) => {
            Swal.fire('Eliminado!', 'El dato ha sido eliminado.', 'success');
            this.spinnerService.hide();
            console.log('Se elimino el usuario');
            (error: unknown) =>
              console.log(
                'Hubo un fallo al momento de eliminar el dato' + error
              );
          },
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
      this.dialog.open(FormularioUsuarioComponent, {
        data: { type: tipo },
      });
    } else if (tipo === 'u') {
      const users = this.usuarios.find((d) => d.id === id);
      this.dialog.open(ActualizarUsuarioComponent, {
        data: { type: tipo, user: users },
      });
    }
  }

  hasRole(roleId: number) {
    return this.jwtService.hasRole(roleId);
  }

  hasPermission(permissionId: number) {
    return this.jwtService.hasPermission(permissionId);
  }

  hasUserPermissions(permissionIds: number[]) {
    return this.jwtService.hasPermissions(permissionIds);
  }

  addActionsColumns() {
    const permissionIds = [
      this.permissions.Usuario.Update,
      this.permissions.Usuario.Delete,
    ];
    const hasPermission = this.hasUserPermissions(permissionIds);
    if (hasPermission) {
      this.displayedColumns.push('actions');
    }
  }
}
