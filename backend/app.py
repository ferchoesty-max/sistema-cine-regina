import os
import sys
import json
import hmac
import base64
import hashlib
import sqlite3
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from db import DB_PATH, conectar, consultar

FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "frontend"))
DATABASE_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "database"))

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")

# Imagenes por link ligero para dulceria (12 opciones) e incidencias (8 opciones)
IMAGENES_DULCERIA = {
    "Pareja": "https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=500&q=80",
    "VIP": "https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=500&q=80",
    "Familiar": "https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?auto=format&fit=crop&w=500&q=80",
    "Individual": "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=500&q=80",
    "Nachos": "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=500&q=80",
    "Hot Dog": "https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=500&q=80",
    "Boneless": "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=500&q=80",
    "Pizza": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80",
    "Crepa": "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=500&q=80",
    "ICEE": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=500&q=80",
    "Frappe": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=80",
    "Refresco": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80",
    "Palomitas": "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=500&q=80",
}

IMAGENES_INCIDENCIAS = {
    "Proyección": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80",
    "Audio": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=500&q=80",
    "Clima": "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=500&q=80",
    "Butacas": "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=500&q=80",
    "Butaca": "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=500&q=80",
    "Limpieza": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=500&q=80",
    "Iluminación": "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=500&q=80",
    "Servicio": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80",
    "Accesos": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=500&q=80",
}

CATALOGO_PRODUCTOS_WEB = [
    ("Combo Pareja Clásico (Palomitas Grandes + 2 Refrescos)", "1 Palomitas grandes de mantequilla + 2 Refrescos grandes", "Combo", 185.0, [(1, 0.40), (2, 1.20), (3, 2.00)]),
    ("Combo Regina VIP (Palomitas Caramelo + Nachos + 2 Refrescos)", "Palomitas gourmet de caramelo + Nachos con queso + 2 Refrescos", "Combo", 240.0, [(1, 0.40), (2, 1.60), (3, 2.00), (4, 0.30), (5, 1.00)]),
    ("Combo Familiar Mega (2 Palomitas Jumbo + 4 Refrescos + 2 Hot Dogs)", "2 Palomitas jumbo + 4 Refrescos grandes + 2 Hot Dogs jumbo", "Combo", 310.0, [(1, 0.80), (2, 2.40), (3, 6.00), (6, 2.00), (7, 2.00)]),
    ("Combo Individual (Palomitas Medianas + Refresco)", "1 Palomitas medianas recién hechas + 1 Refresco mediano", "Combo", 120.0, [(1, 0.25), (2, 0.60), (3, 2.00)]),
    ("Nachos Especiales con Extra Queso Cheddar y Carne", "Totopos crujientes con queso cheddar caliente, carne y jalapeños", "Snack", 85.0, [(4, 0.35), (5, 1.00)]),
    ("Hot Dog Tradicional Jumbo con Tocino", "Salchicha de res envuelta en tocino con pan artesanal caliente", "Snack", 65.0, [(6, 1.00), (7, 1.00)]),
    ("Boneless Crispy BBQ / Búfalo con Papas Gajo", "Orden de boneless de pechuga bañados en salsa BBQ o Búfalo", "Snack", 125.0, [(3, 1.00)]),
    ("Pizza Individual Artesanal de Pepperoni", "Pizza recién horneada con queso mozzarella y pepperoni crujiente", "Snack", 135.0, [(3, 1.00), (4, 0.15)]),
    ("Crepa Dulce con Nutella y Fresas Frescas", "Crepa francesa rellena de avellana, fresas naturales y azúcar glass", "Snack", 95.0, [(3, 1.00)]),
    ("ICEE Grande Congelado (Cereza / Mora Azul)", "Bebida granizada congelada combinada de cereza roja y mora azul", "Bebida", 75.0, [(2, 0.80), (3, 1.00)]),
    ("Frappé Gourmet de Oreo y Caramelo", "Café frappé batido con galleta Oreo, crema batida y caramelo", "Bebida", 80.0, [(2, 0.50), (3, 1.00)]),
    ("Refresco Grande de Máquina (940 ml)", "Vaso grande de refresco bien frío con hielo al gusto", "Bebida", 60.0, [(2, 0.94), (3, 1.00)]),
]

FECHAS_CARRETE = [
    {"fecha": "2026-11-04", "etiqueta": "HOY", "dia_semana": "Mié", "dia_num": "04 Nov"},
    {"fecha": "2026-11-05", "etiqueta": "MAÑANA", "dia_semana": "Jue", "dia_num": "05 Nov"},
    {"fecha": "2026-11-06", "etiqueta": "VIERNES", "dia_semana": "Vie", "dia_num": "06 Nov"},
    {"fecha": "2026-11-07", "etiqueta": "SÁBADO", "dia_semana": "Sáb", "dia_num": "07 Nov"},
    {"fecha": "2026-11-08", "etiqueta": "DOMINGO", "dia_semana": "Dom", "dia_num": "08 Nov"},
    {"fecha": "2026-11-09", "etiqueta": "LUNES", "dia_semana": "Lun", "dia_num": "09 Nov"},
]

PELICULAS_BASE = [
    {
        "id": 1,
        "titulo": "La Venganza del Charro Negro",
        "sala": "Sala 1 Regina VIP",
        "precio": 145.0,
        "clasificacion": "B",
        "duracion": "98 min",
        "genero": "Animación / Misterio",
        "formato": "REGINA VIP · DOBLADA",
        "poster": "https://m.media-amazon.com/images/M/MV5BMmEwMjkwZGQtZDNhMC00NzY2LTkyNTktNzZjYmMxZTI5MDNlXkEyXkFqcGc@._V1_FMjpg_UX600_.jpg",
        "backdrop": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80",
        "trailer_id": "IzynsBv2Dnw",
        "sinopsis": "Leo San Juan y su equipo se enfrentan nuevamente al temible Charro Negro en una oscura batalla por las almas atrapadas en el inframundo.",
        "horarios_base": ["14:30", "17:00", "19:30", "22:00"],
        "asientos_semilla": ["B3", "B4"],
    },
    {
        "id": 2,
        "titulo": "Clayface",
        "sala": "Sala 2 Regina VIP",
        "precio": 145.0,
        "clasificacion": "B15",
        "duracion": "118 min",
        "genero": "Terror / Suspenso DC",
        "formato": "REGINA VIP · DOBLADA",
        "poster": "https://m.media-amazon.com/images/M/MV5BMjNlMjM4NTAtYjE5YS00ZGYyLWEyMTYtNjFlMmIxZDEzYjhhXkEyXkFqcGc@._V1_FMjpg_UX600_.jpg",
        "backdrop": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80",
        "trailer_id": "0D9f0xOPvHg",
        "sinopsis": "Un actor de cine en decadencia utiliza una sustancia experimental para mantenerse relevante, transformando su cuerpo en arcilla viviente.",
        "horarios_base": ["15:15", "18:00", "20:45", "23:10"],
        "asientos_semilla": ["A4", "A5", "D2", "D3"],
    },
    {
        "id": 3,
        "titulo": "Street Fighter",
        "sala": "Sala 3 Regina VIP",
        "precio": 145.0,
        "clasificacion": "B",
        "duracion": "124 min",
        "genero": "Acción / Artes Marciales",
        "formato": "REGINA VIP · DOBLADA",
        "poster": "https://m.media-amazon.com/images/M/MV5BYjhlN2EyNGUtY2U4YS00ZTQ3LTg0NTgtNGIxZmVhMDlmMjIyXkEyXkFqcGc@._V1_FMjpg_UX600_.jpg",
        "backdrop": "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1400&q=80",
        "trailer_id": "mzYHS4VIjgY",
        "sinopsis": "Los mejores peleadores del mundo son convocados al torneo definitivo mientras una organización criminal amenaza la paz global.",
        "horarios_base": ["14:00", "16:45", "19:15", "21:45"],
        "asientos_semilla": ["C2", "C3", "E5", "E6"],
    },
    {
        "id": 4,
        "titulo": "Godzilla Minus Zero",
        "sala": "Sala 4 Regina VIP",
        "precio": 145.0,
        "clasificacion": "B",
        "duracion": "132 min",
        "genero": "Ciencia Ficción / Kaiju",
        "formato": "REGINA VIP · ESPAÑOL",
        "poster": "https://m.media-amazon.com/images/M/MV5BYzY2OWFhMTgtODJhMi00NDIyLWIzNTQtYjc4MjE4YTBjYzllXkEyXkFqcGc@._V1_FMjpg_UX600_.jpg",
        "backdrop": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80",
        "trailer_id": "9IVAGWQdGQg",
        "sinopsis": "Ambientada en 1949, Japón intenta reconstruirse cuando el colosal monstruo despierta nuevamente desde las profundidades del océano.",
        "horarios_base": ["15:00", "17:45", "20:30", "23:00"],
        "asientos_semilla": ["B5", "B6", "C6"],
    },
    {
        "id": 5,
        "titulo": "Klara y el Sol",
        "sala": "Sala 5 Regina VIP",
        "precio": 145.0,
        "clasificacion": "A",
        "duracion": "115 min",
        "genero": "Ciencia Ficción / Drama",
        "formato": "REGINA VIP · ESPAÑOL",
        "poster": "https://m.media-amazon.com/images/M/MV5BNjQ1YzgwMTMtZDRhNC00MDE0LWFmODctM2ZlNjg5MmNiMDI1XkEyXkFqcGc@._V1_FMjpg_UX600_.jpg",
        "backdrop": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80",
        "trailer_id": "v-Gy7zfOqAg",
        "sinopsis": "Klara, una amiga artificial dotada de gran curiosidad, observa el mundo humano mientras espera ser elegida por una familia.",
        "horarios_base": ["13:45", "16:15", "18:45", "21:15"],
        "asientos_semilla": ["A1", "A2", "D4"],
    },
    {
        "id": 6,
        "titulo": "Los Juegos del Hambre: Amanecer en la Cosecha",
        "sala": "Sala 6 Regina VIP",
        "precio": 145.0,
        "clasificacion": "B15",
        "duracion": "146 min",
        "genero": "Acción / Distopía",
        "formato": "REGINA VIP · DOBLADA",
        "poster": "https://m.media-amazon.com/images/M/MV5BNjEzYTE2ODEtNzY5Zi00ZmVmLWEyYzEtYjdlZWU2NjcyYzMzXkEyXkFqcGc@._V1_FMjpg_UX600_.jpg",
        "backdrop": "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1400&q=80",
        "trailer_id": "UPpNu2Uc5KE",
        "sinopsis": "En el Quinto Vasallaje de los Veinticinco, el joven Haymitch Abernathy es seleccionado en el Distrito 12 para enfrentar el doble de tributos.",
        "horarios_base": ["14:15", "17:30", "20:15", "22:45"],
        "asientos_semilla": ["C3", "C4", "D5", "D6"],
    },
    {
        "id": 7,
        "titulo": "Verity: La Sombra de un Engaño",
        "sala": "Sala 1 Regina VIP",
        "precio": 145.0,
        "clasificacion": "B15",
        "duracion": "122 min",
        "genero": "Suspenso / Thriller",
        "formato": "REGINA VIP · DOBLADA",
        "poster": "https://m.media-amazon.com/images/M/MV5BZmE0OWRiNzktY2MwMy00YzQ5LWFkMzctNjI1ZWQ1NTRiZGM3XkEyXkFqcGc@._V1_FMjpg_UX600_.jpg",
        "backdrop": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80",
        "trailer_id": "JJPMGhSN4YQ",
        "sinopsis": "Una escritora contratada para terminar las novelas de la autora Verity Crawford descubre un manuscrito oculto con confesiones escalofriantes.",
        "horarios_base": ["15:30", "18:15", "21:00", "23:15"],
        "asientos_semilla": ["B1", "B2", "E3"],
    },
    {
        "id": 8,
        "titulo": "El Laberinto del Fauno (20 Aniversario)",
        "sala": "Sala 2 Regina VIP",
        "precio": 145.0,
        "clasificacion": "B15",
        "duracion": "118 min",
        "genero": "Fantasía Oscura / Drama",
        "formato": "REGINA VIP · ESPAÑOL",
        "poster": "https://m.media-amazon.com/images/M/MV5BOTc1NTAxMWItMWFlNy00MmU2LTkwMTMtNzMwOTg5OTQ5YTFiXkEyXkFqcGc@._V1_FMjpg_UX600_.jpg",
        "backdrop": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80",
        "trailer_id": "CW0BGBZe8vM",
        "sinopsis": "En la España de 1944, la joven Ofelia descubre un antiguo laberinto donde un fauno le revela que ella es la princesa de un reino mágico.",
        "horarios_base": ["16:00", "18:30", "21:15", "23:30"],
        "asientos_semilla": ["C7", "C8", "D7"],
    },
]

AUTH_SECRET = os.environ.get("CINE_SECRET", "cine-regina-dicis-2026").encode("utf-8")

TABLAS_MODELO = [
    "salas", "asientos", "peliculas", "funciones", "clientes",
    "boletos", "boleto_asiento", "productos", "insumos",
    "producto_insumo", "ordenes_dulceria", "orden_detalle", "incidencias",
    "usuarios"
]


def construir_catalogo_base():
    """Arma el catalogo de peliculas y semillas visuales de ocupacion."""
    peliculas = []
    asientos_base = {}
    patrones_extra = [["A3", "A4"], ["B6", "B7"], ["D1", "D2"], ["E4", "E5"]]

    for p in PELICULAS_BASE:
        funciones_peli = []
        for idx_f, f_obj in enumerate(FECHAS_CARRETE):
            fecha_str = f_obj["fecha"]
            for idx_h, hora_str in enumerate(p["horarios_base"]):
                fid = f"F-{p['id']}-{fecha_str.replace('-', '')}-{hora_str.replace(':', '')}"
                if idx_h == 0:
                    ocupados = list(p["asientos_semilla"])
                elif p["id"] == 2 and fecha_str == "2026-11-04" and hora_str == "18:00":
                    ocupados = ["D1", "D2"]
                else:
                    ocupados = list(patrones_extra[(p["id"] + idx_f + idx_h) % len(patrones_extra)])
                asientos_base[fid] = ocupados
                funciones_peli.append({
                    "id_funcion": fid,
                    "fecha": fecha_str,
                    "dia_etiqueta": f"{f_obj['etiqueta']} ({f_obj['dia_num']})",
                    "hora": hora_str,
                    "sala": p["sala"],
                    "precio": p["precio"],
                    "formato": p["formato"],
                })

        peliculas.append({
            "id": p["id"],
            "titulo": p["titulo"],
            "horario": p["horarios_base"][0],
            "sala": p["sala"],
            "precio": p["precio"],
            "clasificacion": p["clasificacion"],
            "duracion": p["duracion"],
            "genero": p["genero"],
            "formato": p["formato"],
            "poster": p["poster"],
            "backdrop": p["backdrop"],
            "trailer_id": p["trailer_id"],
            "sinopsis": p["sinopsis"],
            "funciones": funciones_peli,
        })

    return peliculas, asientos_base


PELICULAS_INIT, ASIENTOS_SEMILLA_INIT = construir_catalogo_base()


def _leer_sql(nombre_archivo):
    ruta = os.path.join(DATABASE_DIR, nombre_archivo)
    with open(ruta, "r", encoding="utf-8") as f:
        return f.read()


def _obtener_o_crear_cliente(conn, nombre):
    nombre_limpio = (nombre or "").strip() or "Cliente Mostrador"
    fila = conn.execute(
        "SELECT id_cliente FROM clientes WHERE lower(nombre) = lower(?)",
        (nombre_limpio,)
    ).fetchone()
    if fila:
        return fila["id_cliente"]
    cur = conn.execute("INSERT INTO clientes (nombre) VALUES (?)", (nombre_limpio,))
    return cur.lastrowid


def _generar_folio(conn, tabla, prefijo, numero_inicio):
    filas = conn.execute(f"SELECT folio FROM {tabla}").fetchall()
    existentes = {r["folio"] for r in filas}
    max_num = numero_inicio - 1
    for f in existentes:
        if f.startswith(prefijo):
            cola = f[len(prefijo):]
            if cola.isdigit():
                max_num = max(max_num, int(cola))
    candidato = max_num + 1
    while f"{prefijo}{candidato}" in existentes:
        candidato += 1
    return f"{prefijo}{candidato}"


def inicializar_bd_operativa():
    """Crea la BD si falta y sincroniza salas VIP, catalogo, funciones y productos."""
    os.makedirs(DATABASE_DIR, exist_ok=True)
    bd_nueva = not os.path.exists(DB_PATH)
    conn = conectar()
    try:
        if bd_nueva:
            conn.executescript(_leer_sql("schema.sql"))
            conn.executescript(_leer_sql("seed.sql"))

        with conn:
            # 1. Sincronizar las 6 salas VIP y sus 40 butacas (A1..E8)
            for num in range(1, 7):
                nombre_sala = f"Sala {num} Regina VIP"
                conn.execute(
                    "INSERT OR IGNORE INTO salas (nombre, tipo, filas, columnas, activa) VALUES (?, 'VIP', 5, 8, 1)",
                    (nombre_sala,)
                )
                id_sala = conn.execute("SELECT id_sala FROM salas WHERE nombre = ?", (nombre_sala,)).fetchone()["id_sala"]
                for letra in ("A", "B", "C", "D", "E"):
                    for col in range(1, 9):
                        conn.execute(
                            "INSERT OR IGNORE INTO asientos (id_sala, fila, numero, codigo) VALUES (?, ?, ?, ?)",
                            (id_sala, letra, col, f"{letra}{col}")
                        )

            # 2. Sincronizar peliculas y funciones del carrete
            for p in PELICULAS_BASE:
                duracion_num = int(str(p["duracion"]).split()[0])
                conn.execute(
                    """INSERT OR IGNORE INTO peliculas (titulo, genero, duracion_min, clasificacion, sinopsis, activa)
                       VALUES (?, ?, ?, ?, ?, 1)""",
                    (p["titulo"], p["genero"], duracion_num, p["clasificacion"], p["sinopsis"])
                )
                id_peli = conn.execute("SELECT id_pelicula FROM peliculas WHERE titulo = ?", (p["titulo"],)).fetchone()["id_pelicula"]
                id_sala = conn.execute("SELECT id_sala FROM salas WHERE nombre = ?", (p["sala"],)).fetchone()["id_sala"]

                for f_obj in FECHAS_CARRETE:
                    for hora_str in p["horarios_base"]:
                        conn.execute(
                            """INSERT OR IGNORE INTO funciones (id_pelicula, id_sala, fecha, hora, precio, formato, estado)
                               VALUES (?, ?, ?, ?, ?, ?, 'Programada')""",
                            (id_peli, id_sala, f_obj["fecha"], hora_str, p["precio"], p["formato"])
                        )

            # 3. Sincronizar los 12 productos de dulceria y sus recetas en producto_insumo
            for nombre_prod, desc, cat, precio, receta in CATALOGO_PRODUCTOS_WEB:
                conn.execute(
                    """INSERT OR IGNORE INTO productos (nombre, descripcion, categoria, precio, stock, activo)
                       VALUES (?, ?, ?, ?, 50, 1)""",
                    (nombre_prod, desc, cat, precio)
                )
                id_prod = conn.execute("SELECT id_producto FROM productos WHERE nombre = ?", (nombre_prod,)).fetchone()["id_producto"]
                for id_insumo, cant in receta:
                    conn.execute(
                        "INSERT OR IGNORE INTO producto_insumo (id_producto, id_insumo, cantidad) VALUES (?, ?, ?)",
                        (id_prod, id_insumo, cant)
                    )

            # 4. Boletos iniciales de cartelera actual (si aun no existen)
            ejemplos = [
                ("CR-TK-101", "Luis Mendoza", "La Venganza del Charro Negro", "2026-11-04", "14:30", ["C4", "C5"], 290.0),
                ("CR-TK-102", "Valeria Sánchez", "Clayface", "2026-11-04", "18:00", ["B6", "B7"], 290.0),
            ]
            for folio, cliente, titulo, fecha, hora, codigos, total in ejemplos:
                ya = conn.execute("SELECT 1 FROM boletos WHERE folio = ?", (folio,)).fetchone()
                if ya:
                    continue
                fn = conn.execute(
                    """SELECT f.id_funcion, f.id_sala
                       FROM funciones AS f
                       JOIN peliculas AS p ON p.id_pelicula = f.id_pelicula
                       WHERE p.titulo = ? AND f.fecha = ? AND f.hora = ?""",
                    (titulo, fecha, hora)
                ).fetchone()
                if not fn:
                    continue
                id_cli = _obtener_o_crear_cliente(conn, cliente)
                cur = conn.execute(
                    """INSERT INTO boletos (folio, id_cliente, id_funcion, cantidad, total, estado)
                       VALUES (?, ?, ?, ?, ?, 'Pagado')""",
                    (folio, id_cli, fn["id_funcion"], len(codigos), total)
                )
                id_bol = cur.lastrowid
                for cod in codigos:
                    asiento = conn.execute(
                        "SELECT id_asiento FROM asientos WHERE id_sala = ? AND codigo = ?",
                        (fn["id_sala"], cod)
                    ).fetchone()
                    if asiento:
                        conn.execute(
                            "INSERT OR IGNORE INTO boleto_asiento (id_boleto, id_asiento) VALUES (?, ?)",
                            (id_bol, asiento["id_asiento"])
                        )

            # 5. Garantizar tabla usuarios y cuentas iniciales con clave hash SHA-256
            conn.execute("""
                CREATE TABLE IF NOT EXISTS usuarios (
                    id_usuario    INTEGER PRIMARY KEY AUTOINCREMENT,
                    username      TEXT    NOT NULL UNIQUE CHECK (length(trim(username)) > 0),
                    password_hash TEXT    NOT NULL CHECK (length(password_hash) = 64),
                    nombre        TEXT    NOT NULL CHECK (length(trim(nombre)) > 0),
                    rol           TEXT    NOT NULL DEFAULT 'cliente'
                                  CHECK (rol IN ('cliente', 'staff', 'gerente')),
                    activo        INTEGER NOT NULL DEFAULT 1 CHECK (activo IN (0, 1)),
                    creado_en     TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
                )
            """)
            cuentas_seed = [
                ("gerente", "regina2026", "Fernando Tolentino (Gerente)", "gerente"),
                ("staff", "staff2026", "Carlos Ramírez (Staff)", "staff"),
                ("cliente", "cine2026", "Luis Mendoza (Cliente VIP)", "cliente"),
            ]
            for user, pwd, nombre, rol in cuentas_seed:
                conn.execute(
                    """INSERT OR IGNORE INTO usuarios (username, password_hash, nombre, rol, activo)
                       VALUES (?, ?, ?, ?, 1)""",
                    (user, _hash_password(pwd), nombre, rol)
                )
    finally:
        conn.close()


def _hash_password(password):
    return hashlib.sha256(f"regina:{password}".encode("utf-8")).hexdigest()


def _firmar_token(usuario):
    raw = json.dumps(usuario, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    b64 = base64.urlsafe_b64encode(raw).decode("ascii").rstrip("=")
    sig = hmac.new(AUTH_SECRET, b64.encode("ascii"), hashlib.sha256).hexdigest()
    return f"{b64}.{sig}"


def _verificar_token(token):
    if not token or "." not in token:
        return None
    b64, sig = token.rsplit(".", 1)
    esperado = hmac.new(AUTH_SECRET, b64.encode("ascii"), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(sig, esperado):
        return None
    try:
        padded = b64 + "=" * (-len(b64) % 4)
        data = json.loads(base64.urlsafe_b64decode(padded.encode("ascii")).decode("utf-8"))
        if data.get("rol") in ("cliente", "staff", "gerente"):
            return data
    except Exception:
        return None
    return None


def _usuario_actual():
    auth = request.headers.get("Authorization", "")
    token = auth[7:].strip() if auth.startswith("Bearer ") else request.headers.get("X-Cine-Token", "").strip()
    usuario = _verificar_token(token)
    if usuario:
        return usuario, True
    return {"username": "visitante", "nombre": "Cliente Visitante", "rol": "cliente"}, False


def obtener_imagen_dulceria(combo):
    c = (combo or "").lower()
    for clave, url in IMAGENES_DULCERIA.items():
        if clave.lower() in c:
            return url
    return IMAGENES_DULCERIA["Pareja"]


def obtener_imagen_incidencia(categoria, problema):
    texto = f"{categoria} {problema}".lower()
    if "audio" in texto or "bocina" in texto or "sonido" in texto:
        return IMAGENES_INCIDENCIAS["Audio"]
    if "clima" in texto or "aire" in texto or "frio" in texto or "frío" in texto:
        return IMAGENES_INCIDENCIAS["Clima"]
    if "butaca" in texto or "asiento" in texto or "reclinable" in texto:
        return IMAGENES_INCIDENCIAS["Butacas"]
    if "limpieza" in texto or "derrame" in texto or "basura" in texto:
        return IMAGENES_INCIDENCIAS["Limpieza"]
    if "iluminacion" in texto or "iluminación" in texto or "luz" in texto or "escalera" in texto:
        return IMAGENES_INCIDENCIAS["Iluminación"]
    if "servicio" in texto or "mesero" in texto or "pedido" in texto:
        return IMAGENES_INCIDENCIAS["Servicio"]
    if "acceso" in texto or "puerta" in texto or "qr" in texto:
        return IMAGENES_INCIDENCIAS["Accesos"]
    return IMAGENES_INCIDENCIAS["Proyección"]


def _obtener_asientos_ocupados_por_funcion():
    """Combina las semillas de sala con los asientos reales pagados en SQLite."""
    mapa = {fid: set(lista) for fid, lista in ASIENTOS_SEMILLA_INIT.items()}
    titulo_a_id = {p["titulo"]: p["id"] for p in PELICULAS_BASE}

    filas = consultar("""
        SELECT p.titulo, f.fecha, f.hora, a.codigo
        FROM boleto_asiento AS ba
        JOIN boletos AS b   ON b.id_boleto = ba.id_boleto
        JOIN funciones AS f ON f.id_funcion = b.id_funcion
        JOIN peliculas AS p ON p.id_pelicula = f.id_pelicula
        JOIN asientos AS a  ON a.id_asiento = ba.id_asiento
        WHERE b.estado = 'Pagado'
    """)
    for r in filas:
        pid = titulo_a_id.get(r["titulo"])
        if pid is None:
            continue
        fid = f"F-{pid}-{r['fecha'].replace('-', '')}-{r['hora'].replace(':', '')}"
        mapa.setdefault(fid, set()).add(r["codigo"])

    return {fid: sorted(list(s)) for fid, s in mapa.items()}


def _buscar_producto_sqlite(conn, combo_nombre):
    texto = (combo_nombre or "").strip()
    prod = conn.execute("SELECT * FROM productos WHERE lower(nombre) = lower(?)", (texto,)).fetchone()
    if prod:
        return prod
    todos = conn.execute("SELECT * FROM productos WHERE activo = 1").fetchall()
    lower_txt = texto.lower()
    for row in todos:
        if row["nombre"].lower() in lower_txt or lower_txt in row["nombre"].lower():
            return row
    for palabra in ("familiar", "vip", "pareja", "pizza", "boneless", "individual", "crepa", "nachos", "frappe", "frappé", "icee", "hot dog", "refresco"):
        if palabra in lower_txt:
            for row in todos:
                if palabra.replace("é", "e") in row["nombre"].lower().replace("é", "e"):
                    return row
    return todos[0] if todos else None


inicializar_bd_operativa()


@app.route("/")
def index():
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(FRONTEND_DIR, path)


@app.route("/api/auth/login", methods=["POST"])
def auth_login():
    data = request.get_json() or {}
    username = (data.get("username") or "").strip().lower()
    password = data.get("password") or ""
    if not username or not password:
        return jsonify({"status": "error", "mensaje": "Ingresa usuario y contraseña"}), 400

    conn = conectar()
    try:
        fila = conn.execute(
            "SELECT username, password_hash, nombre, rol FROM usuarios WHERE lower(username) = ? AND activo = 1",
            (username,)
        ).fetchone()
        if not fila or not hmac.compare_digest(fila["password_hash"], _hash_password(password)):
            return jsonify({"status": "error", "mensaje": "Usuario o contraseña incorrectos"}), 401

        usuario = {"username": fila["username"], "nombre": fila["nombre"], "rol": fila["rol"]}
        return jsonify({
            "status": "ok",
            "mensaje": f"Bienvenido, {fila['nombre']}",
            "token": _firmar_token(usuario),
            "usuario": usuario,
        })
    finally:
        conn.close()


@app.route("/api/auth/me", methods=["GET"])
def auth_me():
    usuario, autenticado = _usuario_actual()
    return jsonify({
        "status": "ok",
        "autenticado": autenticado,
        "usuario": usuario,
        "motor": f"SQLite {sqlite3.sqlite_version}",
        "total_tablas": len(TABLAS_MODELO),
    })


@app.route("/api/cartelera", methods=["GET"])
def get_cartelera():
    return jsonify({
        "status": "ok",
        "fechas": FECHAS_CARRETE,
        "peliculas": PELICULAS_INIT,
        "asientos_ocupados": _obtener_asientos_ocupados_por_funcion(),
    })


@app.route("/api/boletos", methods=["GET"])
def get_boletos():
    usuario, _ = _usuario_actual()
    folios_raw = (request.args.get("folios") or "").strip()
    folio_unico = (request.args.get("folio") or "").strip()

    where_sql = ""
    params = []
    if usuario["rol"] not in ("staff", "gerente"):
        lista_folios = [f.strip() for f in folios_raw.split(",") if f.strip()]
        if folio_unico and folio_unico not in lista_folios:
            lista_folios.append(folio_unico)
        if not lista_folios:
            return jsonify({"status": "ok", "boletos": [], "alcance": "cliente"})
        placeholders = ",".join("?" for _ in lista_folios)
        where_sql = f"WHERE b.folio IN ({placeholders})"
        params = lista_folios

    filas = consultar(f"""
        SELECT
            b.folio,
            c.nombre AS cliente,
            p.titulo AS pelicula,
            f.fecha,
            f.hora AS horario,
            s.nombre AS sala,
            b.cantidad,
            COALESCE(GROUP_CONCAT(a.codigo, ', '), 'Cancelado') AS asientos,
            b.total,
            b.estado,
            substr(b.comprado_en, 12, 8) AS hora
        FROM boletos AS b
        JOIN clientes AS c   ON c.id_cliente = b.id_cliente
        JOIN funciones AS f  ON f.id_funcion = b.id_funcion
        JOIN peliculas AS p  ON p.id_pelicula = f.id_pelicula
        JOIN salas AS s      ON s.id_sala = f.id_sala
        LEFT JOIN boleto_asiento AS ba ON ba.id_boleto = b.id_boleto
        LEFT JOIN asientos AS a        ON a.id_asiento = ba.id_asiento
        {where_sql}
        GROUP BY b.id_boleto
        ORDER BY b.id_boleto DESC
    """, tuple(params))
    return jsonify({"status": "ok", "boletos": filas, "alcance": usuario["rol"]})


@app.route("/api/boletos/reservar", methods=["POST"])
def reservar_boleto():
    data = request.get_json() or {}
    peli_id = int(data.get("pelicula_id", 1))
    funcion_id = (data.get("funcion_id") or "").strip()
    fecha = (data.get("fecha") or "2026-11-04").strip()
    horario = (data.get("horario") or "").strip()
    cliente = (data.get("cliente") or "").strip() or "Cliente Mostrador"
    asientos_str = (data.get("asientos") or "").strip()

    pelicula = next((p for p in PELICULAS_INIT if p["id"] == peli_id), PELICULAS_INIT[0])
    funcion_obj = None
    if funcion_id:
        funcion_obj = next((f for f in pelicula["funciones"] if f["id_funcion"] == funcion_id), None)
    if not funcion_obj and horario:
        funcion_obj = next((f for f in pelicula["funciones"] if f["fecha"] == fecha and f["hora"] == horario), None)
    if not funcion_obj:
        funcion_obj = pelicula["funciones"][0]
        funcion_id = funcion_obj["id_funcion"]

    lista_nuevos = [a.strip().upper() for a in asientos_str.split(",") if a.strip()]
    if not lista_nuevos:
        return jsonify({"status": "error", "mensaje": "Selecciona al menos un asiento"}), 400

    cantidad = len(lista_nuevos)
    ocupados_base = set(ASIENTOS_SEMILLA_INIT.get(funcion_id, []))
    for cod in lista_nuevos:
        if cod in ocupados_base:
            return jsonify({"status": "error", "mensaje": f"El asiento {cod} ya está ocupado en esta función"}), 409

    conn = conectar()
    try:
        fn_row = conn.execute(
            """SELECT f.id_funcion, f.id_sala, f.precio, f.fecha, f.hora, s.nombre AS sala
               FROM funciones AS f
               JOIN peliculas AS p ON p.id_pelicula = f.id_pelicula
               JOIN salas AS s     ON s.id_sala = f.id_sala
               WHERE p.titulo = ? AND f.fecha = ? AND f.hora = ?""",
            (pelicula["titulo"], funcion_obj["fecha"], funcion_obj["hora"])
        ).fetchone()

        if not fn_row:
            return jsonify({"status": "error", "mensaje": "Función no encontrada en base de datos"}), 404

        with conn:
            id_cliente = _obtener_o_crear_cliente(conn, cliente)
            folio = _generar_folio(conn, "boletos", "CR-TK-", 101)
            total = round(cantidad * float(fn_row["precio"]), 2)

            cur = conn.execute(
                """INSERT INTO boletos (folio, id_cliente, id_funcion, cantidad, total, estado)
                   VALUES (?, ?, ?, ?, ?, 'Pagado')""",
                (folio, id_cliente, fn_row["id_funcion"], cantidad, total)
            )
            id_boleto = cur.lastrowid

            for cod in lista_nuevos:
                asiento_row = conn.execute(
                    "SELECT id_asiento FROM asientos WHERE id_sala = ? AND codigo = ?",
                    (fn_row["id_sala"], cod)
                ).fetchone()
                if not asiento_row:
                    raise ValueError(f"El asiento {cod} no existe en {fn_row['sala']}")
                conn.execute(
                    "INSERT INTO boleto_asiento (id_boleto, id_asiento) VALUES (?, ?)",
                    (id_boleto, asiento_row["id_asiento"])
                )

        nuevo_boleto = {
            "folio": folio,
            "cliente": cliente,
            "pelicula": pelicula["titulo"],
            "funcion_id": funcion_id,
            "fecha": fn_row["fecha"],
            "horario": fn_row["hora"],
            "sala": fn_row["sala"],
            "cantidad": cantidad,
            "asientos": ", ".join(lista_nuevos),
            "total": total,
            "estado": "Pagado",
            "hora": datetime.now().strftime("%H:%M:%S"),
        }
        ocupados_funcion = _obtener_asientos_ocupados_por_funcion().get(funcion_id, [])
        return jsonify({
            "status": "ok",
            "mensaje": f"Boleto guardado en SQLite con folio {folio}",
            "boleto": nuevo_boleto,
            "asientos_ocupados_funcion": ocupados_funcion,
        }), 201
    except sqlite3.IntegrityError as err:
        return jsonify({"status": "error", "mensaje": str(err)}), 409
    except ValueError as err:
        return jsonify({"status": "error", "mensaje": str(err)}), 400
    finally:
        conn.close()


@app.route("/api/boletos/<folio>", methods=["DELETE"])
def cancelar_boleto(folio):
    conn = conectar()
    try:
        fila = conn.execute("SELECT id_boleto, estado FROM boletos WHERE folio = ?", (folio,)).fetchone()
        if not fila:
            return jsonify({"status": "error", "mensaje": f"No existe el folio {folio}"}), 404
        with conn:
            conn.execute("UPDATE boletos SET estado = 'Cancelado' WHERE id_boleto = ?", (fila["id_boleto"],))
            conn.execute("DELETE FROM boleto_asiento WHERE id_boleto = ?", (fila["id_boleto"],))
        return jsonify({
            "status": "ok",
            "mensaje": f"Boleto {folio} cancelado y asientos liberados en la sala"
        })
    finally:
        conn.close()


@app.route("/api/dulceria", methods=["GET"])
def get_dulceria():
    usuario, _ = _usuario_actual()
    folios_raw = (request.args.get("folios") or "").strip()

    where_sql = ""
    params = []
    if usuario["rol"] not in ("staff", "gerente"):
        lista_folios = [f.strip() for f in folios_raw.split(",") if f.strip()]
        if not lista_folios:
            return jsonify({"status": "ok", "ordenes": [], "alcance": "cliente"})
        placeholders = ",".join("?" for _ in lista_folios)
        where_sql = f"WHERE o.folio IN ({placeholders})"
        params = lista_folios

    filas = consultar(f"""
        SELECT
            o.folio,
            COALESCE(c.nombre, 'Cliente Dulcería') AS cliente,
            COALESCE(
                GROUP_CONCAT(
                    CASE WHEN od.cantidad > 1 THEN p.nombre || ' (x' || od.cantidad || ')' ELSE p.nombre END,
                    ', '
                ),
                'Pedido de dulcería'
            ) AS combo,
            COALESCE(SUM(od.cantidad), 1) AS cantidad,
            o.total,
            o.estado
        FROM ordenes_dulceria AS o
        LEFT JOIN clientes AS c      ON c.id_cliente = o.id_cliente
        LEFT JOIN orden_detalle AS od ON od.id_orden = o.id_orden
        LEFT JOIN productos AS p      ON p.id_producto = od.id_producto
        {where_sql}
        GROUP BY o.id_orden
        ORDER BY o.id_orden DESC
    """, tuple(params))
    for f in filas:
        f["imagen"] = obtener_imagen_dulceria(f["combo"])
    return jsonify({"status": "ok", "ordenes": filas, "alcance": usuario["rol"]})


@app.route("/api/dulceria/ordenar", methods=["POST"])
def ordenar_dulceria():
    data = request.get_json() or {}
    cliente = (data.get("cliente") or "").strip() or "Cliente Dulcería"
    combo = data.get("combo", "Combo Pareja Clásico (Palomitas Grandes + 2 Refrescos)")
    cantidad = max(1, int(data.get("cantidad", 1)))

    conn = conectar()
    try:
        prod = _buscar_producto_sqlite(conn, combo)
        if not prod:
            return jsonify({"status": "error", "mensaje": "Producto no encontrado en catálogo"}), 404

        precio_unitario = float(prod["precio"])
        total = round(cantidad * precio_unitario, 2)

        with conn:
            id_cliente = _obtener_o_crear_cliente(conn, cliente)
            folio = _generar_folio(conn, "ordenes_dulceria", "CR-DL-", 201)
            hora_rec = datetime.now().strftime("%H:%M")

            cur = conn.execute(
                """INSERT INTO ordenes_dulceria (folio, id_cliente, estado, hora_recoleccion, total)
                   VALUES (?, ?, 'En preparación', ?, ?)""",
                (folio, id_cliente, hora_rec, total)
            )
            id_orden = cur.lastrowid

            conn.execute(
                """INSERT INTO orden_detalle (id_orden, id_producto, cantidad, precio_unitario, subtotal)
                   VALUES (?, ?, ?, ?, ?)""",
                (id_orden, prod["id_producto"], cantidad, precio_unitario, total)
            )
            conn.execute(
                "UPDATE productos SET stock = MAX(0, stock - ?) WHERE id_producto = ?",
                (cantidad, prod["id_producto"])
            )

            receta = conn.execute(
                "SELECT id_insumo, cantidad FROM producto_insumo WHERE id_producto = ?",
                (prod["id_producto"],)
            ).fetchall()
            for ing in receta:
                consumo = float(ing["cantidad"]) * cantidad
                conn.execute(
                    "UPDATE insumos SET stock_actual = ROUND(MAX(0, stock_actual - ?), 2) WHERE id_insumo = ?",
                    (consumo, ing["id_insumo"])
                )

        nueva_orden = {
            "folio": folio,
            "cliente": cliente,
            "combo": prod["nombre"],
            "cantidad": cantidad,
            "total": total,
            "estado": "En preparación",
            "imagen": data.get("imagen") or obtener_imagen_dulceria(prod["nombre"]),
        }
        return jsonify({
            "status": "ok",
            "mensaje": f"Orden guardada en SQLite con folio {folio} e insumos descontados",
            "orden": nueva_orden,
        }), 201
    finally:
        conn.close()


@app.route("/api/dulceria/<folio>/estado", methods=["PUT"])
def actualizar_estado_dulceria(folio):
    usuario, _ = _usuario_actual()
    if usuario["rol"] not in ("staff", "gerente"):
        return jsonify({"status": "error", "mensaje": "Acceso restringido a personal o gerencia"}), 403
    data = request.get_json(silent=True) or {}
    conn = conectar()
    try:
        fila = conn.execute("SELECT id_orden, estado FROM ordenes_dulceria WHERE folio = ?", (folio,)).fetchone()
        if not fila:
            return jsonify({"status": "error", "mensaje": f"Orden {folio} no encontrada"}), 404

        siguiente = {
            "En preparación": "Listo para entrega",
            "Lista": "Entregada",
            "Listo para entrega": "Entregada",
            "Entregada": "En preparación",
            "Cancelada": "En preparación",
        }
        nuevo_estado = data.get("estado") or siguiente.get(fila["estado"], "Listo para entrega")

        with conn:
            conn.execute("UPDATE ordenes_dulceria SET estado = ? WHERE id_orden = ?", (nuevo_estado, fila["id_orden"]))

        return jsonify({
            "status": "ok",
            "mensaje": f"Orden {folio} actualizada a '{nuevo_estado}'",
            "estado": nuevo_estado,
        })
    finally:
        conn.close()


@app.route("/api/dulceria/<folio>", methods=["DELETE"])
def eliminar_orden_dulceria(folio):
    usuario, _ = _usuario_actual()
    if usuario["rol"] not in ("staff", "gerente"):
        return jsonify({"status": "error", "mensaje": "Acceso restringido a personal o gerencia"}), 403
    conn = conectar()
    try:
        fila = conn.execute("SELECT id_orden FROM ordenes_dulceria WHERE folio = ?", (folio,)).fetchone()
        if not fila:
            return jsonify({"status": "error", "mensaje": f"Orden {folio} no encontrada"}), 404
        with conn:
            conn.execute("DELETE FROM ordenes_dulceria WHERE id_orden = ?", (fila["id_orden"],))
        return jsonify({"status": "ok", "mensaje": f"Orden {folio} eliminada de SQLite"})
    finally:
        conn.close()


@app.route("/api/incidencias", methods=["GET"])
def get_incidencias():
    usuario, _ = _usuario_actual()
    folios_raw = (request.args.get("folios") or "").strip()

    where_sql = ""
    params = []
    if usuario["rol"] not in ("staff", "gerente"):
        lista_folios = [f.strip() for f in folios_raw.split(",") if f.strip()]
        if not lista_folios:
            return jsonify({"status": "ok", "incidencias": [], "alcance": "cliente"})
        placeholders = ",".join("?" for _ in lista_folios)
        where_sql = f"WHERE i.folio IN ({placeholders})"
        params = lista_folios

    filas = consultar(f"""
        SELECT
            i.folio AS id,
            i.folio,
            s.nombre AS sala,
            i.categoria,
            i.descripcion AS problema,
            i.prioridad,
            i.estado,
            i.reportada_en,
            i.resuelta_en,
            i.notas_tecnico
        FROM incidencias AS i
        JOIN salas AS s ON s.id_sala = i.id_sala
        {where_sql}
        ORDER BY i.id_incidencia DESC
    """, tuple(params))
    for f in filas:
        f["imagen"] = obtener_imagen_incidencia(f["categoria"], f["problema"])
    return jsonify({"status": "ok", "incidencias": filas, "alcance": usuario["rol"]})


@app.route("/api/incidencias/reportar", methods=["POST"])
def reportar_incidencia():
    data = request.get_json() or {}
    sala = data.get("sala", "Sala 1 Regina VIP")
    categoria = data.get("categoria", "Proyección")
    problema = (data.get("problema") or "").strip()
    prioridad = data.get("prioridad", "Media")

    if not problema:
        return jsonify({"status": "error", "mensaje": "Falta escribir el problema"}), 400

    conn = conectar()
    try:
        sala_row = conn.execute("SELECT id_sala, nombre FROM salas WHERE nombre = ?", (sala,)).fetchone()
        if not sala_row:
            sala_row = conn.execute("SELECT id_sala, nombre FROM salas ORDER BY id_sala LIMIT 1").fetchone()

        with conn:
            folio = _generar_folio(conn, "incidencias", "CR-INC-", 501)
            conn.execute(
                """INSERT INTO incidencias (folio, id_sala, categoria, descripcion, prioridad, estado)
                   VALUES (?, ?, ?, ?, ?, 'Pendiente')""",
                (folio, sala_row["id_sala"], categoria, problema, prioridad)
            )

        nueva = {
            "id": folio,
            "folio": folio,
            "sala": sala_row["nombre"],
            "categoria": categoria,
            "problema": problema,
            "prioridad": prioridad,
            "estado": "Pendiente",
            "imagen": data.get("imagen") or obtener_imagen_incidencia(categoria, problema),
        }
        return jsonify({
            "status": "ok",
            "mensaje": f"Reporte {folio} guardado en SQLite y enviado a mantenimiento",
            "incidencia": nueva,
        }), 201
    finally:
        conn.close()


@app.route("/api/incidencias/<folio>/estado", methods=["PUT"])
def actualizar_estado_incidencia(folio):
    usuario, _ = _usuario_actual()
    if usuario["rol"] not in ("staff", "gerente"):
        return jsonify({"status": "error", "mensaje": "Acceso restringido a personal o gerencia"}), 403
    data = request.get_json(silent=True) or {}
    conn = conectar()
    try:
        fila = conn.execute("SELECT id_incidencia, estado FROM incidencias WHERE folio = ?", (folio,)).fetchone()
        if not fila:
            return jsonify({"status": "error", "mensaje": f"Reporte {folio} no encontrado"}), 404

        siguiente = {
            "Pendiente": "En proceso",
            "En proceso": "Resuelto",
            "Resuelto": "Pendiente",
            "Cancelado": "Pendiente",
        }
        nuevo_estado = data.get("estado") or siguiente.get(fila["estado"], "Resuelto")
        notas = data.get("notas_tecnico") or ("Atendida y verificada en sala por soporte técnico." if nuevo_estado == "Resuelto" else None)

        with conn:
            if nuevo_estado == "Resuelto":
                conn.execute(
                    """UPDATE incidencias
                       SET estado = ?, resuelta_en = datetime('now', 'localtime'), notas_tecnico = COALESCE(?, notas_tecnico)
                       WHERE id_incidencia = ?""",
                    (nuevo_estado, notas, fila["id_incidencia"])
                )
            else:
                conn.execute(
                    "UPDATE incidencias SET estado = ?, resuelta_en = NULL WHERE id_incidencia = ?",
                    (nuevo_estado, fila["id_incidencia"])
                )

        return jsonify({
            "status": "ok",
            "mensaje": f"Incidencia {folio} actualizada a '{nuevo_estado}'",
            "estado": nuevo_estado,
        })
    finally:
        conn.close()


@app.route("/api/incidencias/<folio>", methods=["DELETE"])
def eliminar_incidencia(folio):
    usuario, _ = _usuario_actual()
    if usuario["rol"] not in ("staff", "gerente"):
        return jsonify({"status": "error", "mensaje": "Acceso restringido a personal o gerencia"}), 403
    conn = conectar()
    try:
        fila = conn.execute("SELECT id_incidencia FROM incidencias WHERE folio = ?", (folio,)).fetchone()
        if not fila:
            return jsonify({"status": "error", "mensaje": f"Reporte {folio} no encontrado"}), 404
        with conn:
            conn.execute("DELETE FROM incidencias WHERE id_incidencia = ?", (fila["id_incidencia"],))
        return jsonify({"status": "ok", "mensaje": f"Reporte {folio} eliminado de SQLite"})
    finally:
        conn.close()


@app.route("/api/dashboard", methods=["GET"])
def get_dashboard():
    usuario, _ = _usuario_actual()
    if usuario["rol"] != "gerente":
        return jsonify({"status": "error", "mensaje": "Panel Gerencial exclusivo para cuenta de Gerente"}), 403
    conn = conectar()
    try:
        fk_on = bool(conn.execute("PRAGMA foreign_keys").fetchone()[0])
        integridad = conn.execute("PRAGMA integrity_check").fetchone()[0]

        ing_taq = float(conn.execute("SELECT COALESCE(SUM(total), 0) FROM boletos WHERE estado = 'Pagado'").fetchone()[0])
        ing_dul = float(conn.execute("SELECT COALESCE(SUM(total), 0) FROM ordenes_dulceria WHERE estado <> 'Cancelada'").fetchone()[0])
        bol_activos = int(conn.execute("SELECT COUNT(*) FROM boletos WHERE estado = 'Pagado'").fetchone()[0])
        butacas_vend = int(conn.execute("SELECT COALESCE(SUM(cantidad), 0) FROM boletos WHERE estado = 'Pagado'").fetchone()[0])
        ord_activas = int(conn.execute("SELECT COUNT(*) FROM ordenes_dulceria WHERE estado <> 'Cancelada'").fetchone()[0])
        inc_pend = int(conn.execute("SELECT COUNT(*) FROM incidencias WHERE estado IN ('Pendiente', 'En proceso')").fetchone()[0])
        inc_res = int(conn.execute("SELECT COUNT(*) FROM incidencias WHERE estado = 'Resuelto'").fetchone()[0])

        conteo_tablas = []
        for tabla in TABLAS_MODELO:
            total = int(conn.execute(f"SELECT COUNT(*) FROM {tabla}").fetchone()[0])
            conteo_tablas.append({"tabla": tabla, "registros": total})

        ocupacion = [
            dict(r) for r in conn.execute("""
                SELECT id_funcion, pelicula, sala, fecha, hora, aforo, asientos_vendidos, porcentaje_ocupacion
                FROM vista_ocupacion_funciones
                ORDER BY asientos_vendidos DESC, fecha DESC, hora ASC
                LIMIT 12
            """).fetchall()
        ]

        insumos = [
            dict(r) for r in conn.execute(
                "SELECT id_insumo, nombre, unidad, stock_actual, stock_minimo FROM insumos ORDER BY id_insumo"
            ).fetchall()
        ]

        return jsonify({
            "status": "ok",
            "motor": f"SQLite {sqlite3.sqlite_version}",
            "archivo": "database/cine_regina.db",
            "foreign_keys": fk_on,
            "integridad": integridad,
            "kpis": {
                "ingresos_taquilla": round(ing_taq, 2),
                "ingresos_dulceria": round(ing_dul, 2),
                "ingresos_totales": round(ing_taq + ing_dul, 2),
                "boletos_activos": bol_activos,
                "butacas_vendidas": butacas_vend,
                "ordenes_activas": ord_activas,
                "incidencias_pendientes": inc_pend,
                "incidencias_resueltas": inc_res,
            },
            "conteo_tablas": conteo_tablas,
            "ocupacion_funciones": ocupacion,
            "insumos": insumos,
        })
    finally:
        conn.close()


@app.route("/api/insumos/resurtir", methods=["POST"])
def resurtir_insumo():
    usuario, _ = _usuario_actual()
    if usuario["rol"] != "gerente":
        return jsonify({"status": "error", "mensaje": "Solo Gerencia puede resurtir inventario en bodega"}), 403
    data = request.get_json(silent=True) or {}
    id_insumo = data.get("id_insumo")
    cantidad = float(data.get("cantidad", 20.0))

    conn = conectar()
    try:
        with conn:
            if id_insumo is None or str(id_insumo) == "all":
                conn.execute("UPDATE insumos SET stock_actual = ROUND(stock_actual + ?, 2)", (cantidad,))
                msg = f"Se resurtieron +{cantidad:.0f} unidades a todos los insumos en bodega"
            else:
                conn.execute(
                    "UPDATE insumos SET stock_actual = ROUND(stock_actual + ?, 2) WHERE id_insumo = ?",
                    (cantidad, int(id_insumo))
                )
                msg = f"Insumo #{id_insumo} resurtido con +{cantidad:.0f} unidades en SQLite"
        insumos = [
            dict(r) for r in conn.execute(
                "SELECT id_insumo, nombre, unidad, stock_actual, stock_minimo FROM insumos ORDER BY id_insumo"
            ).fetchall()
        ]
        return jsonify({"status": "ok", "mensaje": msg, "insumos": insumos})
    finally:
        conn.close()


if __name__ == "__main__":
    print(f"Base de datos SQLite lista en: {DB_PATH}")
    print("Iniciando servidor de Cine Regina en http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
