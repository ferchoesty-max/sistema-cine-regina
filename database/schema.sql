-- ============================================================================
-- Cine Regina - Sistema de Información
-- Actividad: Diseño e implementación inicial de una base de datos
-- Autor: Fernando Daniel Tolentino Uribe
-- Motor: SQLite 3 (ver justificación en el documento técnico)
-- Ejecución: python database/verificar_bd.py
-- ============================================================================

PRAGMA foreign_keys = ON;

-- Se eliminan primero las tablas dependientes para permitir reejecutar el script.
DROP VIEW  IF EXISTS vista_ocupacion_funciones;
DROP TABLE IF EXISTS boleto_asiento;
DROP TABLE IF EXISTS boletos;
DROP TABLE IF EXISTS orden_detalle;
DROP TABLE IF EXISTS ordenes_dulceria;
DROP TABLE IF EXISTS incidencias;
DROP TABLE IF EXISTS funciones;
DROP TABLE IF EXISTS asientos;
DROP TABLE IF EXISTS producto_insumo;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS insumos;
DROP TABLE IF EXISTS peliculas;
DROP TABLE IF EXISTS salas;
DROP TABLE IF EXISTS clientes;

-- ----------------------------------------------------------------------------
-- 1. salas
-- ----------------------------------------------------------------------------
CREATE TABLE salas (
    id_sala     INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre      TEXT    NOT NULL UNIQUE,
    tipo        TEXT    NOT NULL DEFAULT 'Estándar'
                CHECK (tipo IN ('Estándar', 'VIP', 'Láser')),
    filas       INTEGER NOT NULL CHECK (filas > 0),
    columnas    INTEGER NOT NULL CHECK (columnas > 0),
    activa      INTEGER NOT NULL DEFAULT 1 CHECK (activa IN (0, 1))
);

-- ----------------------------------------------------------------------------
-- 2. asientos
-- ----------------------------------------------------------------------------
CREATE TABLE asientos (
    id_asiento  INTEGER PRIMARY KEY AUTOINCREMENT,
    id_sala     INTEGER NOT NULL,
    fila        TEXT    NOT NULL CHECK (length(fila) = 1),
    numero      INTEGER NOT NULL CHECK (numero > 0),
    codigo      TEXT    NOT NULL,
    FOREIGN KEY (id_sala) REFERENCES salas (id_sala)
        ON UPDATE CASCADE ON DELETE CASCADE,
    UNIQUE (id_sala, codigo),
    UNIQUE (id_sala, fila, numero)
);

-- ----------------------------------------------------------------------------
-- 3. peliculas
-- ----------------------------------------------------------------------------
CREATE TABLE peliculas (
    id_pelicula     INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo          TEXT    NOT NULL,
    genero          TEXT,
    duracion_min    INTEGER NOT NULL CHECK (duracion_min > 0),
    clasificacion   TEXT    NOT NULL
                    CHECK (clasificacion IN ('AA', 'A', 'B', 'B15', 'C', 'D')),
    sinopsis        TEXT,
    activa          INTEGER NOT NULL DEFAULT 1 CHECK (activa IN (0, 1)),
    UNIQUE (titulo)
);

-- ----------------------------------------------------------------------------
-- 4. funciones
-- ----------------------------------------------------------------------------
CREATE TABLE funciones (
    id_funcion  INTEGER PRIMARY KEY AUTOINCREMENT,
    id_pelicula INTEGER NOT NULL,
    id_sala     INTEGER NOT NULL,
    fecha       TEXT    NOT NULL
                CHECK (fecha GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'),
    hora        TEXT    NOT NULL
                CHECK (hora GLOB '[0-9][0-9]:[0-9][0-9]'),
    precio      REAL    NOT NULL CHECK (precio > 0),
    formato     TEXT    NOT NULL DEFAULT '2D',
    estado      TEXT    NOT NULL DEFAULT 'Programada'
                CHECK (estado IN ('Programada', 'En curso', 'Finalizada', 'Cancelada')),
    FOREIGN KEY (id_pelicula) REFERENCES peliculas (id_pelicula)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_sala) REFERENCES salas (id_sala)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    UNIQUE (id_sala, fecha, hora)
);

-- ----------------------------------------------------------------------------
-- 5. clientes
-- ----------------------------------------------------------------------------
CREATE TABLE clientes (
    id_cliente  INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre      TEXT    NOT NULL CHECK (length(trim(nombre)) > 0),
    correo      TEXT    UNIQUE
                CHECK (correo IS NULL OR correo LIKE '%_@_%._%'),
    telefono    TEXT,
    creado_en   TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- ----------------------------------------------------------------------------
-- 6. boletos
-- ----------------------------------------------------------------------------
CREATE TABLE boletos (
    id_boleto   INTEGER PRIMARY KEY AUTOINCREMENT,
    folio       TEXT    NOT NULL UNIQUE,
    id_cliente  INTEGER NOT NULL,
    id_funcion  INTEGER NOT NULL,
    cantidad    INTEGER NOT NULL CHECK (cantidad > 0),
    total       REAL    NOT NULL CHECK (total >= 0),
    estado      TEXT    NOT NULL DEFAULT 'Pagado'
                CHECK (estado IN ('Pagado', 'Cancelado', 'Reembolsado')),
    comprado_en TEXT    NOT NULL DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (id_cliente) REFERENCES clientes (id_cliente)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_funcion) REFERENCES funciones (id_funcion)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ----------------------------------------------------------------------------
-- 7. boleto_asiento  (resuelve la relación N:M entre boletos y asientos)
-- ----------------------------------------------------------------------------
CREATE TABLE boleto_asiento (
    id_boleto   INTEGER NOT NULL,
    id_asiento  INTEGER NOT NULL,
    PRIMARY KEY (id_boleto, id_asiento),
    FOREIGN KEY (id_boleto) REFERENCES boletos (id_boleto)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_asiento) REFERENCES asientos (id_asiento)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Un asiento solo puede venderse una vez por función.
CREATE TRIGGER trg_asiento_unico_por_funcion
BEFORE INSERT ON boleto_asiento
WHEN EXISTS (
    SELECT 1
    FROM boleto_asiento AS ba
    JOIN boletos AS b  ON b.id_boleto  = ba.id_boleto
    JOIN boletos AS bn ON bn.id_boleto = NEW.id_boleto
    WHERE ba.id_asiento = NEW.id_asiento
      AND b.id_funcion  = bn.id_funcion
      AND b.estado <> 'Cancelado'
)
BEGIN
    SELECT RAISE(ABORT, 'El asiento ya está ocupado para esta función');
END;

-- El asiento debe pertenecer a la sala donde se proyecta la función.
CREATE TRIGGER trg_asiento_sala_correcta
BEFORE INSERT ON boleto_asiento
WHEN (
    SELECT s.id_sala
    FROM asientos AS a
    JOIN salas AS s ON s.id_sala = a.id_sala
    WHERE a.id_asiento = NEW.id_asiento
) <> (
    SELECT f.id_sala
    FROM boletos AS b
    JOIN funciones AS f ON f.id_funcion = b.id_funcion
    WHERE b.id_boleto = NEW.id_boleto
)
BEGIN
    SELECT RAISE(ABORT, 'El asiento no pertenece a la sala de la función');
END;

-- ----------------------------------------------------------------------------
-- 8. productos (catálogo de dulcería)
-- ----------------------------------------------------------------------------
CREATE TABLE productos (
    id_producto INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre      TEXT    NOT NULL UNIQUE,
    descripcion TEXT,
    categoria   TEXT    NOT NULL
                CHECK (categoria IN ('Combo', 'Palomitas', 'Bebida', 'Snack')),
    precio      REAL    NOT NULL CHECK (precio > 0),
    stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    activo      INTEGER NOT NULL DEFAULT 1 CHECK (activo IN (0, 1))
);

-- ----------------------------------------------------------------------------
-- 9. insumos (materia prima que consume la dulcería)
-- ----------------------------------------------------------------------------
CREATE TABLE insumos (
    id_insumo       INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre          TEXT    NOT NULL UNIQUE,
    unidad          TEXT    NOT NULL
                    CHECK (unidad IN ('kg', 'litros', 'piezas', 'bolsas')),
    stock_actual    REAL    NOT NULL DEFAULT 0 CHECK (stock_actual >= 0),
    stock_minimo    REAL    NOT NULL DEFAULT 0 CHECK (stock_minimo >= 0),
    CHECK (stock_actual >= 0)
);

-- ----------------------------------------------------------------------------
-- 10. producto_insumo  (receta: qué insumos consume cada producto)
-- ----------------------------------------------------------------------------
CREATE TABLE producto_insumo (
    id_producto INTEGER NOT NULL,
    id_insumo   INTEGER NOT NULL,
    cantidad    REAL    NOT NULL CHECK (cantidad > 0),
    PRIMARY KEY (id_producto, id_insumo),
    FOREIGN KEY (id_producto) REFERENCES productos (id_producto)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_insumo) REFERENCES insumos (id_insumo)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ----------------------------------------------------------------------------
-- 11. ordenes_dulceria
-- ----------------------------------------------------------------------------
CREATE TABLE ordenes_dulceria (
    id_orden         INTEGER PRIMARY KEY AUTOINCREMENT,
    folio            TEXT    NOT NULL UNIQUE,
    id_cliente       INTEGER,
    estado           TEXT    NOT NULL DEFAULT 'En preparación'
                     CHECK (estado IN ('En preparación', 'Lista', 'Entregada', 'Cancelada')),
    hora_recoleccion TEXT,
    total            REAL    NOT NULL DEFAULT 0 CHECK (total >= 0),
    creada_en        TEXT    NOT NULL DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (id_cliente) REFERENCES clientes (id_cliente)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- 12. orden_detalle
-- ----------------------------------------------------------------------------
CREATE TABLE orden_detalle (
    id_detalle      INTEGER PRIMARY KEY AUTOINCREMENT,
    id_orden        INTEGER NOT NULL,
    id_producto     INTEGER NOT NULL,
    cantidad        INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario REAL    NOT NULL CHECK (precio_unitario >= 0),
    subtotal        REAL    NOT NULL CHECK (subtotal >= 0),
    FOREIGN KEY (id_orden) REFERENCES ordenes_dulceria (id_orden)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos (id_producto)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    UNIQUE (id_orden, id_producto)
);

-- ----------------------------------------------------------------------------
-- 13. incidencias
-- ----------------------------------------------------------------------------
CREATE TABLE incidencias (
    id_incidencia  INTEGER PRIMARY KEY AUTOINCREMENT,
    folio          TEXT    NOT NULL UNIQUE,
    id_sala        INTEGER NOT NULL,
    id_funcion     INTEGER,
    categoria      TEXT    NOT NULL
                   CHECK (categoria IN ('Proyección', 'Audio', 'Clima', 'Butaca', 'Iluminación', 'Otro')),
    descripcion    TEXT    NOT NULL CHECK (length(trim(descripcion)) > 0),
    prioridad      TEXT    NOT NULL DEFAULT 'Media'
                   CHECK (prioridad IN ('Baja', 'Media', 'Alta', 'Urgente')),
    estado         TEXT    NOT NULL DEFAULT 'Pendiente'
                   CHECK (estado IN ('Pendiente', 'En proceso', 'Resuelto', 'Cancelado')),
    reportada_en   TEXT    NOT NULL DEFAULT (datetime('now', 'localtime')),
    resuelta_en    TEXT,
    notas_tecnico  TEXT,
    FOREIGN KEY (id_sala) REFERENCES salas (id_sala)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_funcion) REFERENCES funciones (id_funcion)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CHECK (resuelta_en IS NULL OR resuelta_en >= reportada_en)
);

-- ----------------------------------------------------------------------------
-- Índices para consultas frecuentes del back-end
-- ----------------------------------------------------------------------------
CREATE INDEX idx_funciones_fecha     ON funciones (fecha, hora);
CREATE INDEX idx_funciones_pelicula  ON funciones (id_pelicula);
CREATE INDEX idx_boletos_funcion     ON boletos (id_funcion);
CREATE INDEX idx_boletos_cliente     ON boletos (id_cliente);
CREATE INDEX idx_ordenes_cliente     ON ordenes_dulceria (id_cliente);
CREATE INDEX idx_incidencias_estado  ON incidencias (estado, prioridad);
CREATE INDEX idx_incidencias_sala    ON incidencias (id_sala);

-- ----------------------------------------------------------------------------
-- Vista de apoyo para el tablero de ocupación
-- ----------------------------------------------------------------------------
CREATE VIEW vista_ocupacion_funciones AS
SELECT
    f.id_funcion,
    p.titulo                                   AS pelicula,
    s.nombre                                   AS sala,
    f.fecha,
    f.hora,
    (s.filas * s.columnas)                     AS aforo,
    COUNT(ba.id_asiento)                       AS asientos_vendidos,
    ROUND(COUNT(ba.id_asiento) * 100.0 /
          (s.filas * s.columnas), 1)           AS porcentaje_ocupacion
FROM funciones AS f
JOIN peliculas AS p ON p.id_pelicula = f.id_pelicula
JOIN salas     AS s ON s.id_sala     = f.id_sala
LEFT JOIN boletos AS b
       ON b.id_funcion = f.id_funcion AND b.estado = 'Pagado'
LEFT JOIN boleto_asiento AS ba
       ON ba.id_boleto = b.id_boleto
GROUP BY f.id_funcion, p.titulo, s.nombre, f.fecha, f.hora, s.filas, s.columnas;
