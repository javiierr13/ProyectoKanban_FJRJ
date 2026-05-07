import { Injectable } from '@angular/core';
import { Tablero, Columna, Tarea } from '../models/kanban.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableroService {
  private tableros: Tablero[] = [];
  private idTableroActual: string | null = null;
  private tareaArrastrada: { idTarea: string, idColumnaOrigen: string } | null = null;

  private tablerosSubject = new BehaviorSubject<Tablero[]>([]);
  private tableroActualSubject = new BehaviorSubject<Tablero | null>(null);


  constructor() {
    this.inicializarTableroPorDefecto();
  }

  private inicializarTableroPorDefecto(): void {
    this.anadirTablero(
      'Proyecto Principal',
      'Tablero por defecto para empezar a trabajar',
      '#050505'
    );
  }

  public obtenerTableros$(): Observable<Tablero[]> {
    return this.tablerosSubject.asObservable();
  }

  public obtenerTableros(): Tablero[] {
    return this.tableros;
  }

  public obtenerTableroActual$(): Observable<Tablero | null> {
    return this.tableroActualSubject.asObservable();
  }

  // Obtiene el tablero que el usuario está visualizando actualmente.
  public obtenerTableroActual(): Tablero | null {
    if (!this.idTableroActual && this.tableros.length > 0) {
      this.idTableroActual = this.tableros[0].id;
    }
    const tablero = this.tableros.find(b => b.id === this.idTableroActual) || null;
    this.tableroActualSubject.next(tablero);
    return tablero;
  }

  public establecerTableroActual(id: string): void {
    this.idTableroActual = id;
    this.obtenerTableroActual(); // Actualiza el subject
  }

  // Crea un nuevo tablero con las columnas iniciales por defecto.
  public anadirTablero(nombre: string, descripcion: string, colorFondo: string): void {
    const id = Date.now().toString();
    const nuevoTablero = new Tablero(id, nombre, descripcion, colorFondo, [
      new Columna('todo', 'Por hacer'),
      new Columna('in-progress', 'En proceso'),
      new Columna('done', 'Realizado')
    ]);
    this.tableros.push(nuevoTablero);
    this.tablerosSubject.next([...this.tableros]);
    if (!this.idTableroActual) {
      this.establecerTableroActual(id);
    }
  }

  // Añade una columna a un tablero específico con un maximo de 5 columnas
  public anadirColumna(idTablero: string, nombre: string): void {
    const tablero = this.tableros.find(b => b.id === idTablero);
    if (tablero && tablero.columnas.length < 5) {
      const id = Date.now().toString();
      tablero.columnas.push(new Columna(id, nombre));
      this.tableroActualSubject.next({ ...tablero } as Tablero);
    }
  }

  public anadirTarea(idTablero: string, idColumna: string, tarea: Tarea): void {
    const tablero = this.tableros.find(b => b.id === idTablero);
    if (tablero) {
      const columna = tablero.columnas.find(c => c.id === idColumna);
      if (columna) {
        columna.tareas.push(tarea);
        this.tableroActualSubject.next({ ...tablero } as Tablero);
      }
    }
  }

  public moverTarea(idTablero: string, idTarea: string, idColumnaOrigen: string, idColumnaDestino: string): void {
    const tablero = this.tableros.find(b => b.id === idTablero);
    if (!tablero) return;

    const columnaOrigen = tablero.columnas.find(c => c.id === idColumnaOrigen);
    const columnaDestino = tablero.columnas.find(c => c.id === idColumnaDestino);

    if (columnaOrigen && columnaDestino) {
      const indiceTarea = columnaOrigen.tareas.findIndex(t => t.id === idTarea);
      if (indiceTarea !== -1) {
        const [tarea] = columnaOrigen.tareas.splice(indiceTarea, 1);
        columnaDestino.tareas.push(tarea);
        this.tableroActualSubject.next({ ...tablero } as Tablero);
      }
    }
  }

  // Almacena temporalmente la tarea que se está arrastrando.
  public establecerTareaArrastrada(idTarea: string, idColumnaOrigen: string): void {
    this.tareaArrastrada = { idTarea, idColumnaOrigen };
  }

  // Limpia la referencia de la tarea que se estaba arrastrando.
  public limpiarTareaArrastrada(): void {
    this.tareaArrastrada = null;
  }

  // Obtiene los datos de la tarea que se está arrastrando actualmente.
  public obtenerTareaArrastrada() {
    return this.tareaArrastrada;
  }
}
