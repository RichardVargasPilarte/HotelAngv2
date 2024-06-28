import { Component, OnInit } from '@angular/core';
import { JwtService } from './service/jwt.service';
import { WebsocketService } from './service/websocket.service';

import { AlojamientoService } from './service/alojamiento.service';
import { HabitacionService } from './service/habitacion.service';
import { ReservaService } from './service/reserva.service';
import { ClienteService } from './service/cliente.service';
import { UsuarioService } from './service/usuario.service';
import { GruposService } from './service/grupos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Hotel';

  public verified = false;

  constructor(
    private JwtService: JwtService,
    private ws: WebsocketService,
    private readonly clienteService: ClienteService,
    private readonly alojamientoService: AlojamientoService,
    private readonly habitacionService: HabitacionService,
    private readonly reservaService: ReservaService,
    private readonly usuarioService: UsuarioService,
    private readonly grupoService: GruposService
  ) {}

  ngOnInit(): void {
    this.token();
  }

  verificar(): boolean {
    const aux = this.JwtService.loggedIn;
    const aux2 = this.JwtService.isAuthenticated();
    return aux && aux2;
  }

  token(): void {
    if (this.JwtService.Token) {
      this.JwtService.tokenVerify().subscribe({
        next: () => {
          if (this.JwtService.isAuthenticated() && this.JwtService.loggedIn) {
            this.ws.setsock();
            this.loadData();
          }
        },
        error: () => this.JwtService.logout(),
      });
    } else {
      console.log('No hay token');
    }
  }

  async loadData() {
    try {
      await Promise.all([
        this.grupoService.getGroupsAsynchronous(),
        this.alojamientoService.getAccommodationsAsynchronous(),
        this.clienteService.getClientsAsynchronous(),
        this.habitacionService.getRoomsAsynchronous(),
        this.reservaService.getAsynchronousReservations(),
        this.usuarioService.getAsynchronousUsers(),
      ]);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }
  }
}
