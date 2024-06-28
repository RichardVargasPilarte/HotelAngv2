import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListadoAlojamientoComponent } from './alojamiento/listado-alojamiento/listado-alojamiento.component';
import { FormularioAlojamientoComponent } from './alojamiento/formulario-alojamiento/formulario-alojamiento.component';
import { ListadoHabitacionComponent } from './habitacion/listado-habitacion/listado-habitacion.component';
import { FormularioHabitacionComponent } from './habitacion/formulario-habitacion/formulario-habitacion.component';
import { ListadoUsuarioComponent } from './usuario/listado-usuario/listado-usuario.component';
import { FormularioUsuarioComponent } from './usuario/formulario-usuario/formulario-usuario.component';
import { ActualizarUsuarioComponent } from './usuario/actualizar-usuario/actualizar-usuario.component';
import { ListadoClienteComponent } from './cliente/listado-cliente/listado-cliente.component';
import { FormularioClienteComponent } from './cliente/formulario-cliente/formulario-cliente.component';
import { ListadoReservaComponent } from './reserva/listado-reserva/listado-reserva.component';
import { FormularioReservaComponent } from './reserva/formulario-reserva/formulario-reserva.component';



@NgModule({
  declarations: [
    ListadoAlojamientoComponent,
    FormularioAlojamientoComponent,
    ListadoHabitacionComponent,
    FormularioHabitacionComponent,
    ListadoUsuarioComponent,
    FormularioUsuarioComponent,
    ActualizarUsuarioComponent,
    ListadoClienteComponent,
    FormularioClienteComponent,
    ListadoReservaComponent,
    FormularioReservaComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ComponentsModule { }
