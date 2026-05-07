import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Columna, Tarea } from '../../models/kanban.model';
import { TarjetaTareaComponent } from '../tarjeta-tarea/tarjeta-tarea.component';
import { TableroService } from '../../services/tablero.service';

@Component({
  selector: 'app-columna',
  standalone: true,
  imports: [CommonModule, TarjetaTareaComponent],
  templateUrl: './columna.component.html',
  styleUrl: './columna.component.scss'
})
export class ColumnaComponent {
  @Input() columna!: Columna;
  @Input() idTablero!: string;
  @Output() anadirTareaSolicitada = new EventEmitter<string>();

  constructor(private tableroService: TableroService) {}

  alArrastrarSobre(evento: DragEvent): void {
    evento.preventDefault();
    if (evento.dataTransfer) {
      evento.dataTransfer.dropEffect = 'move';
    }
    (evento.currentTarget as HTMLElement).classList.add('drag-over');
  }

  alSalirDeArrastre(evento: DragEvent): void {
    (evento.currentTarget as HTMLElement).classList.remove('drag-over');
  }

  public alSoltar(evento: DragEvent): void {
    evento.preventDefault(); // REQUISITO: Prevenir comportamiento por defecto
    (evento.currentTarget as HTMLElement).classList.remove('drag-over');
    
    // Obtenemos los datos de la tarea desde el servicio
    const datosArrastre = this.tableroService.obtenerTareaArrastrada();

    if (datosArrastre && datosArrastre.idColumnaOrigen !== this.columna.id) {
      this.tableroService.moverTarea(this.idTablero, datosArrastre.idTarea, datosArrastre.idColumnaOrigen, this.columna.id);
      this.tableroService.limpiarTareaArrastrada();
    }
  }

  abrirFormularioTarea(): void {
    this.anadirTareaSolicitada.emit(this.columna.id);
  }
}
