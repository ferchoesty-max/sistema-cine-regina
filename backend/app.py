import os
import json
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "frontend"))

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")

# imagenes por link ligero para dulceria (12 opciones) e incidencias (8 opciones)
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
    "Refresco": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80"
}

IMAGENES_INCIDENCIAS = {
    "Proyección": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80",
    "Audio": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=500&q=80",
    "Clima": "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=500&q=80",
    "Butacas": "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=500&q=80",
    "Limpieza": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=500&q=80",
    "Iluminación": "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=500&q=80",
    "Servicio": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80",
    "Accesos": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=500&q=80"
}

FECHAS_CARRETE = [
    {"fecha": "2026-11-04", "etiqueta": "HOY", "dia_semana": "Mié", "dia_num": "04 Nov"},
    {"fecha": "2026-11-05", "etiqueta": "MAÑANA", "dia_semana": "Jue", "dia_num": "05 Nov"},
    {"fecha": "2026-11-06", "etiqueta": "VIERNES", "dia_semana": "Vie", "dia_num": "06 Nov"},
    {"fecha": "2026-11-07", "etiqueta": "SÁBADO", "dia_semana": "Sáb", "dia_num": "07 Nov"},
    {"fecha": "2026-11-08", "etiqueta": "DOMINGO", "dia_semana": "Dom", "dia_num": "08 Nov"},
    {"fecha": "2026-11-09", "etiqueta": "LUNES", "dia_semana": "Lun", "dia_num": "09 Nov"}
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
        "asientos_semilla": ["B3", "B4", "C4", "C5"]
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
        "asientos_semilla": ["A4", "A5", "D2", "D3"]
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
        "asientos_semilla": ["C2", "C3", "E5", "E6"]
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
        "asientos_semilla": ["B5", "B6", "C6"]
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
        "asientos_semilla": ["A1", "A2", "D4"]
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
        "asientos_semilla": ["C3", "C4", "D5", "D6"]
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
        "asientos_semilla": ["B1", "B2", "E3"]
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
        "asientos_semilla": ["C7", "C8", "D7"]
    }
]


def construir_catalogo_inicial():
    peliculas = []
    asientos_por_funcion = {}
    patrones_extra = [
        ["A3", "A4"],
        ["B6", "B7"],
        ["D1", "D2"],
        ["E4", "E5"]
    ]

    for p in PELICULAS_BASE:
        funciones_peli = []
        for idx_f, f_obj in enumerate(FECHAS_CARRETE):
            fecha_str = f_obj["fecha"]
            for idx_h, hora_str in enumerate(p["horarios_base"]):
                fid = f"F-{p['id']}-{fecha_str.replace('-', '')}-{hora_str.replace(':', '')}"
                ocupados = list(p["asientos_semilla"]) if idx_h == 0 else list(patrones_extra[(p["id"] + idx_f + idx_h) % len(patrones_extra)])
                asientos_por_funcion[fid] = ocupados
                funciones_peli.append({
                    "id_funcion": fid,
                    "fecha": fecha_str,
                    "dia_etiqueta": f"{f_obj['etiqueta']} ({f_obj['dia_num']})",
                    "hora": hora_str,
                    "sala": p["sala"],
                    "precio": p["precio"],
                    "formato": p["formato"]
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
            "funciones": funciones_peli
        })

    return peliculas, asientos_por_funcion


PELICULAS_INIT, ASIENTOS_FUNCION_INIT = construir_catalogo_inicial()

db = {
    "fechas": FECHAS_CARRETE,
    "peliculas": PELICULAS_INIT,
    "asientos_ocupados": ASIENTOS_FUNCION_INIT,
    "boletos": [
        {
            "folio": "CR-TK-101",
            "cliente": "Luis Mendoza",
            "pelicula": "La Venganza del Charro Negro",
            "fecha": "2026-11-04",
            "horario": "14:30",
            "sala": "Sala 1 Regina VIP",
            "cantidad": 2,
            "asientos": "C4, C5",
            "total": 290.0,
            "hora": "13:50"
        },
        {
            "folio": "CR-TK-102",
            "cliente": "Valeria Sánchez",
            "pelicula": "Clayface",
            "fecha": "2026-11-04",
            "horario": "18:00",
            "sala": "Sala 2 Regina VIP",
            "cantidad": 2,
            "asientos": "B6, B7",
            "total": 290.0,
            "hora": "16:15"
        }
    ],
    "dulceria": [
        {
            "folio": "CR-DL-201",
            "cliente": "Sofía Martínez",
            "combo": "Combo Pareja (Palomitas + 2 Refrescos)",
            "cantidad": 1,
            "total": 185.0,
            "estado": "En preparación",
            "imagen": IMAGENES_DULCERIA["Pareja"]
        },
        {
            "folio": "CR-DL-202",
            "cliente": "Diego Hernández",
            "combo": "Combo Regina VIP (Palomitas Caramelo + Nachos + 2 Refrescos)",
            "cantidad": 1,
            "total": 240.0,
            "estado": "Listo para entrega",
            "imagen": IMAGENES_DULCERIA["VIP"]
        }
    ],
    "incidencias": [
        {
            "id": "INC-01",
            "sala": "Sala 3 Regina VIP",
            "categoria": "Clima",
            "problema": "Aire acondicionado muy frío en filas D y E",
            "prioridad": "Alta",
            "estado": "Resuelto",
            "imagen": IMAGENES_INCIDENCIAS["Clima"]
        },
        {
            "id": "INC-02",
            "sala": "Sala 1 Regina VIP",
            "categoria": "Audio",
            "problema": "Bocina lateral izquierda vibra en frecuencias graves",
            "prioridad": "Media",
            "estado": "Pendiente",
            "imagen": IMAGENES_INCIDENCIAS["Audio"]
        }
    ]
}


def obtener_precio_dulceria(combo):
    c = combo.lower()
    if "familiar" in c or "mega" in c:
        return 310.0
    if "vip" in c:
        return 240.0
    if "pareja" in c:
        return 185.0
    if "pizza" in c:
        return 135.0
    if "boneless" in c:
        return 125.0
    if "individual" in c:
        return 120.0
    if "crepa" in c:
        return 95.0
    if "nachos" in c:
        return 85.0
    if "frappe" in c or "frappé" in c:
        return 80.0
    if "icee" in c:
        return 75.0
    if "hot dog" in c:
        return 65.0
    return 60.0


def obtener_imagen_dulceria(combo):
    for clave, url in IMAGENES_DULCERIA.items():
        if clave.lower() in combo.lower():
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


@app.route("/")
def index():
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(FRONTEND_DIR, path)


@app.route("/api/cartelera", methods=["GET"])
def get_cartelera():
    return jsonify({
        "status": "ok",
        "fechas": db["fechas"],
        "peliculas": db["peliculas"],
        "asientos_ocupados": db["asientos_ocupados"]
    })


@app.route("/api/boletos", methods=["GET"])
def get_boletos():
    return jsonify({"status": "ok", "boletos": db["boletos"]})


@app.route("/api/boletos/reservar", methods=["POST"])
def reservar_boleto():
    data = request.get_json() or {}
    peli_id = int(data.get("pelicula_id", 1))
    funcion_id = data.get("funcion_id", "").strip()
    fecha = data.get("fecha", "2026-11-04").strip()
    horario = data.get("horario", "").strip()
    cliente = data.get("cliente", "").strip() or "Cliente Mostrador"
    cantidad = int(data.get("cantidad", 1))
    asientos_str = data.get("asientos", "").strip() or "General"

    pelicula = next((p for p in db["peliculas"] if p["id"] == peli_id), db["peliculas"][0])

    # localizar funcion especifica si se envio funcion_id
    funcion_obj = None
    if funcion_id:
        funcion_obj = next((f for f in pelicula["funciones"] if f["id_funcion"] == funcion_id), None)
    if not funcion_obj and horario:
        funcion_obj = next((f for f in pelicula["funciones"] if f["fecha"] == fecha and f["hora"] == horario), None)
    if not funcion_obj:
        funcion_obj = pelicula["funciones"][0]
        funcion_id = funcion_obj["id_funcion"]

    # guardar asientos ocupados especificamente para esta funcion_id
    lista_nuevos = [a.strip() for a in asientos_str.split(",") if a.strip()]
    ocupados_actuales = set(db["asientos_ocupados"].get(funcion_id, []))
    for a in lista_nuevos:
        ocupados_actuales.add(a)
    db["asientos_ocupados"][funcion_id] = sorted(list(ocupados_actuales))

    total = cantidad * funcion_obj["precio"]
    folio = f"CR-TK-{len(db['boletos']) + 101}"

    nuevo_boleto = {
        "folio": folio,
        "cliente": cliente,
        "pelicula": pelicula["titulo"],
        "funcion_id": funcion_id,
        "fecha": funcion_obj["fecha"],
        "horario": funcion_obj["hora"],
        "sala": funcion_obj["sala"],
        "cantidad": cantidad,
        "asientos": asientos_str,
        "total": total,
        "hora": datetime.now().strftime("%H:%M:%S")
    }

    db["boletos"].insert(0, nuevo_boleto)

    return jsonify({
        "status": "ok",
        "mensaje": f"Boleto registrado exitosamente con folio {folio}",
        "boleto": nuevo_boleto,
        "asientos_ocupados_funcion": db["asientos_ocupados"][funcion_id]
    }), 201


@app.route("/api/dulceria", methods=["GET"])
def get_dulceria():
    return jsonify({"status": "ok", "ordenes": db["dulceria"]})


@app.route("/api/dulceria/ordenar", methods=["POST"])
def ordenar_dulceria():
    data = request.get_json() or {}
    cliente = data.get("cliente", "").strip() or "Cliente Dulcería"
    combo = data.get("combo", "Combo Pareja (Palomitas + 2 Refrescos)")
    cantidad = int(data.get("cantidad", 1))
    precio_unitario = float(data.get("precio_unitario") or obtener_precio_dulceria(combo))
    total = cantidad * precio_unitario
    folio = f"CR-DL-{len(db['dulceria']) + 201}"
    imagen = data.get("imagen") or obtener_imagen_dulceria(combo)

    nueva_orden = {
        "folio": folio,
        "cliente": cliente,
        "combo": combo,
        "cantidad": cantidad,
        "total": total,
        "estado": "En preparación",
        "imagen": imagen
    }

    db["dulceria"].insert(0, nueva_orden)

    return jsonify({
        "status": "ok",
        "mensaje": f"Orden enviada a cocina con folio {folio}",
        "orden": nueva_orden
    }), 201


@app.route("/api/incidencias", methods=["GET"])
def get_incidencias():
    return jsonify({"status": "ok", "incidencias": db["incidencias"]})


@app.route("/api/incidencias/reportar", methods=["POST"])
def reportar_incidencia():
    data = request.get_json() or {}
    sala = data.get("sala", "Sala 1 Regina VIP")
    categoria = data.get("categoria", "Proyección")
    problema = data.get("problema", "").strip()
    prioridad = data.get("prioridad", "Media")

    if not problema:
        return jsonify({"status": "error", "mensaje": "Falta escribir el problema"}), 400

    imagen = data.get("imagen") or obtener_imagen_incidencia(categoria, problema)

    nueva_incidencia = {
        "id": f"INC-0{len(db['incidencias']) + 1}",
        "sala": sala,
        "categoria": categoria,
        "problema": problema,
        "prioridad": prioridad,
        "estado": "Pendiente",
        "imagen": imagen
    }

    db["incidencias"].insert(0, nueva_incidencia)

    return jsonify({
        "status": "ok",
        "mensaje": "Reporte registrado y enviado a mantenimiento",
        "incidencia": nueva_incidencia
    }), 201


if __name__ == "__main__":
    print("Iniciando servidor de Cine Regina en http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
