import { Injectable } from '@angular/core';
import { Usuario } from '../models/kanban.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarios: Usuario[] = [
    new Usuario('1', 'Admin', 'User', 'admin@example.com'),
    new Usuario('2', 'Juan', 'Galocha', 'juan@galocha.com')
  ];

  constructor() { }

  obtenerUsuarios(): Usuario[] {
    return this.usuarios;
  }

  anadirUsuario(usuario: Usuario): void {
    this.usuarios.push(usuario);
  }

  actualizarUsuario(usuarioActualizado: Usuario): void {
    const indice = this.usuarios.findIndex(u => u.id === usuarioActualizado.id);
    if (indice !== -1) {
      this.usuarios[indice] = usuarioActualizado;
    }
  }

  eliminarUsuario(id: string): void {
    this.usuarios = this.usuarios.filter(u => u.id !== id);
  }

  existeId(id: string): boolean {
    return this.usuarios.some(u => u.id === id);
  }

  existeEmail(email: string): boolean {
    return this.usuarios.some(u => u.email === email);
  }
}
