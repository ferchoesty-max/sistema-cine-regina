-- ============================================================================
-- Cine Regina - Datos de prueba
-- Se ejecuta después de schema.sql. Los identificadores se fijan de forma
-- explícita para que las relaciones del ejemplo sean predecibles.
-- ============================================================================

PRAGMA foreign_keys = ON;

-- ----------------------------------------------------------------------------
-- Salas y butacas (5 filas x 8 columnas = 40 asientos por sala)
-- ----------------------------------------------------------------------------
INSERT INTO salas (id_sala, nombre, tipo, filas, columnas, activa) VALUES
    (1, 'Sala 1 (Láser 4K)', 'Láser',    5, 8, 1),
    (2, 'Sala 2 (VIP)',      'VIP',      5, 8, 1),
    (3, 'Sala 3 (Estándar)', 'Estándar', 5, 8, 1);

WITH letras(fila) AS (
    SELECT 'A' UNION ALL SELECT 'B' UNION ALL SELECT 'C'
    UNION ALL SELECT 'D' UNION ALL SELECT 'E'
),
numeros(numero) AS (
    SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8
)
INSERT INTO asientos (id_sala, fila, numero, codigo)
SELECT s.id_sala, l.fila, n.numero, l.fila || n.numero
FROM salas AS s
CROSS JOIN letras AS l
CROSS JOIN numeros AS n;

-- ----------------------------------------------------------------------------
-- Cartelera y funciones
-- ----------------------------------------------------------------------------
INSERT INTO peliculas (id_pelicula, titulo, genero, duracion_min, clasificacion, sinopsis, activa) VALUES
    (1, 'Dune: Parte Dos', 'Ciencia Ficción / Aventura', 166, 'B15',
        'Paul Atreides se une a Chani y los Fremen mientras busca venganza contra los conspiradores que destruyeron a su familia.', 1),
    (2, 'IntensaMente 2', 'Animación / Familiar', 96, 'A',
        'Riley entra a la adolescencia y el cuartel central se demuele para hacer espacio a nuevas emociones.', 1),
    (3, 'Oppenheimer', 'Drama / Histórico', 180, 'B15',
        'La historia del físico J. Robert Oppenheimer y su papel en el Proyecto Manhattan.', 1);

INSERT INTO funciones (id_funcion, id_pelicula, id_sala, fecha, hora, precio, formato, estado) VALUES
    (1, 1, 1, '2026-10-24', '16:00',  95.0, '2D Láser',    'Programada'),
    (2, 1, 1, '2026-10-24', '19:30',  95.0, '2D Láser',    'Programada'),
    (3, 2, 2, '2026-10-24', '15:00', 140.0, 'VIP 2D',      'Programada'),
    (4, 2, 2, '2026-10-24', '17:30', 140.0, 'VIP 2D',      'Programada'),
    (5, 3, 3, '2026-10-24', '18:00',  80.0, '2D Estándar', 'Programada'),
    (6, 3, 3, '2026-10-24', '21:30',  80.0, '2D Estándar', 'Programada');

-- ----------------------------------------------------------------------------
-- Clientes
-- ----------------------------------------------------------------------------
INSERT INTO clientes (id_cliente, nombre, correo, telefono, creado_en) VALUES
    (1, 'Luis Mendoza',      'luis.men@ugto.mx',   '4641112233', '2026-10-15 10:12:00'),
    (2, 'Sofía Martínez',    'sofia.mtz@ugto.mx',  '4642223344', '2026-10-16 12:40:00'),
    (3, 'Valeria Sánchez',   'valeria.sn@ugto.mx', '4643334455', '2026-10-17 09:05:00'),
    (4, 'Cliente Mostrador', NULL,                 NULL,         '2026-10-01 00:00:00');

-- ----------------------------------------------------------------------------
-- Boletos de ejemplo y sus butacas
-- ----------------------------------------------------------------------------
INSERT INTO boletos (id_boleto, folio, id_cliente, id_funcion, cantidad, total, estado, comprado_en) VALUES
    (1, 'CR-TK-1001', 1, 1, 2, 190.0, 'Pagado',    '2026-10-18 15:20:00'),
    (2, 'CR-TK-1002', 3, 3, 2, 280.0, 'Pagado',    '2026-10-19 11:05:00'),
    (3, 'CR-TK-1003', 2, 5, 1,  80.0, 'Cancelado', '2026-10-19 12:15:00');

INSERT INTO boleto_asiento (id_boleto, id_asiento)
SELECT 1, id_asiento FROM asientos WHERE id_sala = 1 AND codigo IN ('C4', 'C5');

INSERT INTO boleto_asiento (id_boleto, id_asiento)
SELECT 2, id_asiento FROM asientos WHERE id_sala = 2 AND codigo IN ('B2', 'B3');

INSERT INTO boleto_asiento (id_boleto, id_asiento)
SELECT 3, id_asiento FROM asientos WHERE id_sala = 3 AND codigo = 'D5';

-- ----------------------------------------------------------------------------
-- Dulcería: insumos, productos y recetas
-- ----------------------------------------------------------------------------
INSERT INTO insumos (id_insumo, nombre, unidad, stock_actual, stock_minimo) VALUES
    (1, 'Maíz palomero premium', 'kg',     48.50, 15.00),
    (2, 'Jarabes concentrados',  'litros', 120.00, 30.00),
    (3, 'Vasos y contenedores',  'piezas', 310.00, 50.00),
    (4, 'Queso cheddar caliente','litros',  14.50,  5.00),
    (5, 'Totopos de maíz',       'bolsas',  38.00, 10.00),
    (6, 'Pan artesanal',         'piezas',  35.00, 10.00),
    (7, 'Salchichas de res',     'piezas',  60.00, 15.00);

INSERT INTO productos (id_producto, nombre, descripcion, categoria, precio, stock, activo) VALUES
    (1, 'Combo Pareja Clásico',
        '1 Palomitas grandes de mantequilla + 2 refrescos medianos', 'Combo', 185.0, 45, 1),
    (2, 'Combo Regina VIP',
        '1 Palomitas gourmet de caramelo + nachos con queso extra + 2 refrescos grandes', 'Combo', 240.0, 30, 1),
    (3, 'Palomitas Medianas Saladas',
        'Porción individual de palomitas recién reventadas con sal de grano', 'Palomitas', 75.0, 60, 1),
    (4, 'Refresco Grande (940 ml)',
        'Refresco de máquina bien frío', 'Bebida', 60.0, 80, 1),
    (5, 'Hot Dog Tradicional',
        'Salchicha de res con pan caliente, jalapeños y aderezos', 'Snack', 65.0, 25, 1),
    (6, 'Combo Individual',
        '1 Palomitas medianas + 1 refresco mediano', 'Combo', 120.0, 50, 1);

INSERT INTO producto_insumo (id_producto, id_insumo, cantidad) VALUES
    (1, 1, 0.40), (1, 2, 1.20), (1, 3, 2.00),
    (2, 1, 0.40), (2, 2, 1.60), (2, 3, 2.00), (2, 4, 0.30), (2, 5, 1.00),
    (3, 1, 0.25), (3, 3, 1.00),
    (4, 2, 0.94), (4, 3, 1.00),
    (5, 6, 1.00), (5, 7, 1.00),
    (6, 1, 0.25), (6, 2, 0.60), (6, 3, 2.00);

-- ----------------------------------------------------------------------------
-- Órdenes de dulcería
-- ----------------------------------------------------------------------------
INSERT INTO ordenes_dulceria (id_orden, folio, id_cliente, estado, hora_recoleccion, total, creada_en) VALUES
    (1, 'CR-DL-1001', 3, 'Lista',           '15:50', 185.0, '2026-10-19 15:35:10'),
    (2, 'CR-DL-1002', 4, 'En preparación',  '18:10', 135.0, '2026-10-19 17:58:44');

INSERT INTO orden_detalle (id_orden, id_producto, cantidad, precio_unitario, subtotal) VALUES
    (1, 1, 1, 185.0, 185.0),
    (2, 4, 1,  60.0,  60.0),
    (2, 3, 1,  75.0,  75.0);

-- ----------------------------------------------------------------------------
-- Incidencias
-- ----------------------------------------------------------------------------
INSERT INTO incidencias
    (id_incidencia, folio, id_sala, id_funcion, categoria, descripcion, prioridad,
     estado, reportada_en, resuelta_en, notas_tecnico)
VALUES
    (1, 'CR-INC-501', 3, 6, 'Clima',
        'El aire acondicionado está congelando la fila D y E, temperatura muy baja.',
        'Alta', 'Resuelto', '2026-10-18 21:40:00', '2026-10-18 21:52:00',
        'Termostato ajustado de 17 a 22 grados por el técnico Carlos.'),
    (2, 'CR-INC-502', 1, 1, 'Audio',
        'La bocina lateral izquierda trasera vibra en los sonidos graves.',
        'Media', 'Pendiente', '2026-10-19 16:05:00', NULL, NULL);
