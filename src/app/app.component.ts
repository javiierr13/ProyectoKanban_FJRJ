import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BarraNavegacionComponent } from './components/barra-navegacion/barra-navegacion.component';
import { MenuLateralComponent } from './components/menu-lateral/menu-lateral.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BarraNavegacionComponent, MenuLateralComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected readonly titulo = signal('proyecto-kanban');
}
