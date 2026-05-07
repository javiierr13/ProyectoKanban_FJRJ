import { Routes } from '@angular/router';
import { TableroComponent } from './components/tablero/tablero.component';
import { GestionUsuariosComponent } from './components/gestion-usuarios/gestion-usuarios.component';

export const routes: Routes = [
  { path: '', redirectTo: 'tablero', pathMatch: 'full' },
  { path: 'tablero', component: TableroComponent },
  { path: 'usuarios', component: GestionUsuariosComponent },
  { path: '**', redirectTo: 'tablero' }
];
