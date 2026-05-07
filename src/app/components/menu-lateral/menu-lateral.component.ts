import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableroService } from '../../services/tablero.service';
import { Tablero } from '../../models/kanban.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu-lateral',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-lateral.component.html',
  styleUrl: './menu-lateral.component.scss'
})
export class MenuLateralComponent implements OnInit, OnDestroy {
  tableros: Tablero[] = [];
  idTableroActual: string | null = null;
  private suscripciones = new Subscription();

  constructor(private tableroService: TableroService, private router: Router) {}

  ngOnInit(): void {
    this.suscripciones.add(this.tableroService.obtenerTableros$().subscribe(tableros => {
      this.tableros = tableros;
    }));
    this.suscripciones.add(this.tableroService.obtenerTableroActual$().subscribe(actual => {
      this.idTableroActual = actual ? actual.id : null;
    }));
  }

  ngOnDestroy(): void {
    this.suscripciones.unsubscribe();
  }

  seleccionarTablero(id: string): void {
    this.tableroService.establecerTableroActual(id);
    if (this.router.url !== '/tablero') {
      this.router.navigate(['/tablero']);
    }
  }
}
