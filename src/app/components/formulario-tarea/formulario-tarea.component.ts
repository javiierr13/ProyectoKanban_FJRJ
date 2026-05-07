import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tarea, Usuario } from '../../models/kanban.model';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-formulario-tarea',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario-tarea.component.html',
  styleUrl: './formulario-tarea.component.scss'
})
export class FormularioTareaComponent implements OnInit {
  @Output() creada = new EventEmitter<Tarea>();
  @Output() cerrada = new EventEmitter<void>();

  usuarios: Usuario[] = [];
  
  titulo = '';
  descripcion = '';
  estimacionHoras = 1;
  idUsuarioAsignado = '';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuarios = this.usuarioService.obtenerUsuarios();
    if (this.usuarios.length > 0) {
      this.idUsuarioAsignado = this.usuarios[0].id;
    }
  }

  alEnviar(): void {
    if (this.titulo && this.descripcion && this.idUsuarioAsignado) {
      const nuevaTarea = new Tarea(
        Date.now().toString(),
        this.titulo,
        this.descripcion,
        this.estimacionHoras,
        this.idUsuarioAsignado
      );
      this.creada.emit(nuevaTarea);
    }
  }

  cancelar(): void {
    this.cerrada.emit();
  }
}
