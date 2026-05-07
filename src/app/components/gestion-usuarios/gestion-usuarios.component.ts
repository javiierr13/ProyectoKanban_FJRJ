import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/kanban.model';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-usuarios.component.html',
  styleUrl: './gestion-usuarios.component.scss'
})
export class GestionUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  
  // Campos del formulario
  id = '';
  nombre = '';
  apellidos = '';
  email = '';

  mensajeError = '';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuarios = this.usuarioService.obtenerUsuarios();
  }

  alEnviar(evento: Event): void {
    evento.preventDefault();
    this.mensajeError = '';

    // Requisito 9: Validación usando preventDefault
    if (this.usuarioService.existeId(this.id)) {
      this.mensajeError = `Error: El ID '${this.id}' ya está registrado.`;
      evento.preventDefault();
      return;
    }

    if (this.usuarioService.existeEmail(this.email)) {
      this.mensajeError = `Error: El Email '${this.email}' ya está registrado.`;
      evento.preventDefault();
      return;
    }

    // Si es válido, añadir usuario
    const nuevoUsuario = new Usuario(this.id, this.nombre, this.apellidos, this.email);
    this.usuarioService.anadirUsuario(nuevoUsuario);
    this.limpiarFormulario();
    this.usuarios = this.usuarioService.obtenerUsuarios();
  }

  eliminarUsuario(id: string): void {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usuarioService.eliminarUsuario(id);
      this.usuarios = this.usuarioService.obtenerUsuarios();
    }
  }

  limpiarFormulario(): void {
    this.id = '';
    this.nombre = '';
    this.apellidos = '';
    this.email = '';
    this.mensajeError = '';
  }
}
