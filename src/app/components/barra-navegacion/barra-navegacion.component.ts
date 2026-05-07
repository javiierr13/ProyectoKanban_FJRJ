import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TableroService } from '../../services/tablero.service';
import { Tablero } from '../../models/kanban.model';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-barra-navegacion',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './barra-navegacion.component.html',
  styleUrl: './barra-navegacion.component.scss'
})
export class BarraNavegacionComponent implements OnInit, OnDestroy {
  tableros: Tablero[] = [];
  mostrarModalNuevoTablero = false;
  nombreNuevoTablero = '';
  descripcionNuevoTablero = '';
  colorNuevoTablero = '#050505';
  desplegableAbierto = false;
  private suscripcionTableros: Subscription | null = null;

  constructor(private tableroService: TableroService, private router: Router) {}

  ngOnInit(): void {
    this.suscripcionTableros = this.tableroService.obtenerTableros$().subscribe(tableros => {
      this.tableros = tableros;
    });
    
    // Cerrar desplegable al hacer clic fuera
    document.addEventListener('click', (evento) => {
      const objetivo = evento.target as HTMLElement;
      if (!objetivo.closest('.dropdown')) {
        this.desplegableAbierto = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.suscripcionTableros) {
      this.suscripcionTableros.unsubscribe();
    }
  }

  establecerTableroActual(id: string): void {
    this.tableroService.establecerTableroActual(id);
    this.desplegableAbierto = false;
    if (this.router.url !== '/tablero') {
      this.router.navigate(['/tablero']);
    }
  }

  alternarDesplegable(): void {
    this.desplegableAbierto = !this.desplegableAbierto;
  }

  abrirModalNuevoTablero(): void {
    this.mostrarModalNuevoTablero = true;
  }

  cerrarModalNuevoTablero(): void {
    this.mostrarModalNuevoTablero = false;
    this.nombreNuevoTablero = '';
    this.descripcionNuevoTablero = '';
    this.colorNuevoTablero = '#050505';
  }

  crearTablero(): void {
    if (this.nombreNuevoTablero) {
      this.tableroService.anadirTablero(
        this.nombreNuevoTablero, 
        this.descripcionNuevoTablero, 
        this.colorNuevoTablero
      );
      this.tableros = this.tableroService.obtenerTableros();
      const nuevoTablero = this.tableros[this.tableros.length - 1];
      this.establecerTableroActual(nuevoTablero.id);
      this.cerrarModalNuevoTablero();
    }
  }
}
