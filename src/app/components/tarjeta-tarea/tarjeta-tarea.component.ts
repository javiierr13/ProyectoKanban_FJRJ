import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tarea, Usuario } from '../../models/kanban.model';
import { UsuarioService } from '../../services/usuario.service';
import { TableroService } from '../../services/tablero.service';

@Component({
  selector: 'app-tarjeta-tarea',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tarjeta-tarea.component.html',
  styleUrl: './tarjeta-tarea.component.scss'
})
export class TarjetaTareaComponent implements OnInit {
  @Input() tarea!: Tarea;
  @Input() idColumna!: string;
  
  usuarioAsignado: Usuario | undefined;

  constructor(
    private usuarioService: UsuarioService,
    private tableroService: TableroService
  ) {}

  ngOnInit(): void {
    this.usuarioAsignado = this.usuarioService.obtenerUsuarios().find(u => u.id === this.tarea.usuarioAsignadoId);
  }

  public alEmpezarArrastre(evento: DragEvent): void {
    // Almacenamos la tarea que se está arrastrando en el servicio
    this.tableroService.establecerTareaArrastrada(this.tarea.id, this.idColumna);
    
    if (evento.dataTransfer) {
      evento.dataTransfer.effectAllowed = 'move';
    }
    (evento.currentTarget as HTMLElement).classList.add('dragging');
  }

  public alTerminarArrastre(evento: DragEvent): void {
    // REQUISITO: Al terminar, liberamos la tarea
    this.tableroService.limpiarTareaArrastrada();
    (evento.currentTarget as HTMLElement).classList.remove('dragging');
  }
}
