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
  editando = false;

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.usuarios = this.usuarioService.obtenerUsuarios();
  }

  alEnviar(evento: Event): void {
    evento.preventDefault();
    this.mensajeError = '';

    if (this.editando) {
      // Si estamos editando, actualizamos el usuario
      const usuarioActualizado = new Usuario(this.id, this.nombre, this.apellidos, this.email);
      this.usuarioService.actualizarUsuario(usuarioActualizado);
      this.limpiarFormulario();
      this.usuarios = this.usuarioService.obtenerUsuarios();
    } else {
      if (this.usuarioService.existeId(this.id)) {
        this.mensajeError = `Error: El ID '${this.id}' ya está registrado.`;
        return;
      }

      if (this.usuarioService.existeEmail(this.email)) {
        this.mensajeError = `Error: El Email '${this.email}' ya está registrado.`;
        return;
      }

      // Si es válido, añadir usuario
      const nuevoUsuario = new Usuario(this.id, this.nombre, this.apellidos, this.email);
      this.usuarioService.anadirUsuario(nuevoUsuario);
      this.limpiarFormulario();
      this.usuarios = this.usuarioService.obtenerUsuarios();
    }
  }

  cargarUsuarioParaEditar(usuario: Usuario): void {
    this.id = usuario.id;
    this.nombre = usuario.nombre;
    this.apellidos = usuario.apellidos;
    this.email = usuario.email;
    this.editando = true;
    this.mensajeError = '';
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
    this.editando = false;
  }
}
