import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableroService } from '../../services/tablero.service';
import { Tablero, Tarea } from '../../models/kanban.model';
import { ColumnaComponent } from '../columna/columna.component';
import { FormsModule } from '@angular/forms';
import { FormularioTareaComponent } from '../formulario-tarea/formulario-tarea.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tablero',
  standalone: true,
  imports: [CommonModule, ColumnaComponent, FormsModule, FormularioTareaComponent],
  templateUrl: './tablero.component.html',
  styleUrl: './tablero.component.scss'
})
export class TableroComponent implements OnInit, OnDestroy {
  public tablero: Tablero | null = null;
  public mostrarAnadirColumna = false;
  public mostrarFormularioTarea = false;
  public nombreNuevaColumna = '';
  public idColumnaDestino: string | null = null;
  private suscripcionTablero: Subscription | null = null;

  constructor(private tableroService: TableroService) {}

  // Inicializa el componente cargando el tablero actual desde el servicio.
  ngOnInit(): void {
    this.suscripcionTablero = this.tableroService.obtenerTableroActual$().subscribe(tablero => {
      this.tablero = tablero;
    });
    // Dispara la carga inicial
    this.tableroService.obtenerTableroActual();
  }

  ngOnDestroy(): void {
    if (this.suscripcionTablero) {
      this.suscripcionTablero.unsubscribe();
    }
  }

  // Añade una nueva columna al tablero actual.
  public anadirColumna(): void {
    if (this.tablero && this.nombreNuevaColumna) {
      this.tableroService.anadirColumna(this.tablero.id, this.nombreNuevaColumna);
      this.nombreNuevaColumna = '';
      this.mostrarAnadirColumna = false;
      this.tablero = this.tableroService.obtenerTableroActual();
    }
  }

  // Alterna la visibilidad del formulario para añadir columnas.
  public alternarAnadirColumna(): void {
    this.mostrarAnadirColumna = !this.mostrarAnadirColumna;
  }

  // Abre el formulario para crear una nueva tarea.
  // @param idColumna ID de la columna destino (opcional).
  public abrirFormularioTarea(idColumna?: string): void {
    this.idColumnaDestino = idColumna || (this.tablero?.columnas[0].id || null);
    this.mostrarFormularioTarea = true;
  }

  // Cierra el formulario de tareas.
  public cerrarFormularioTarea(): void {
    this.mostrarFormularioTarea = false;
    this.idColumnaDestino = null;
  }

  // Maneja el evento de creación de una tarea y la añade al servicio.
  // @param tarea Objeto de la tarea creada.
  public alCrearTarea(tarea: Tarea): void {
    if (this.tablero && this.idColumnaDestino) {
      this.tableroService.anadirTarea(this.tablero.id, this.idColumnaDestino, tarea);
      this.cerrarFormularioTarea();
    }
  }
}
