export class Usuario {
  constructor(
    public id: string,
    public nombre: string,
    public apellidos: string,
    public email: string
  ) { }
}

export class Tarea {
  constructor(
    public id: string,
    public titulo: string,
    public descripcion: string,
    public estimacionHoras: number,
    public usuarioAsignadoId: string
  ) { }
}

export class Columna {
  constructor(
    public id: string,
    public nombre: string,
    public tareas: Tarea[] = []
  ) { }
}

export class Tablero {
  constructor(
    public id: string,
    public nombre: string,
    public descripcion: string,
    public colorFondo: string,
    public columnas: Columna[] = []
  ) { }
}
