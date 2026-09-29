import os
import json
import uuid
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "frontend"))

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")

# datos en memoria pa probar rapido
db = {
    "peliculas": [
        {"id": 1, "titulo": "Dune: Parte Dos", "horario": "16:00", "sala": "Sala 1 (Láser)", "precio": 90.0},
        {"id": 2, "titulo": "IntensaMente 2", "horario": "17:30", "sala": "Sala 2 (VIP)", "precio": 120.0},
        {"id": 3, "titulo": "Oppenheimer", "horario": "19:00", "sala": "Sala 3 (Estándar)", "precio": 80.0}
    ],
    "boletos": [
        {
            "folio": "CR-TK-101",
            "cliente": "Luis Mendoza",
            "pelicula": "Dune: Parte Dos",
            "horario": "16:00",
            "sala": "Sala 1 (Láser)",
            "cantidad": 2,
            "asientos": "C4, C5",
            "total": 180.0,
            "hora": "15:30"
        }
    ],
    "dulceria": [
        {
            "folio": "CR-DL-201",
            "cliente": "Sofía Martínez",
            "combo": "Combo Pareja (Palomitas + 2 Refrescos)",
            "cantidad": 1,
            "total": 175.0,
            "estado": "En preparación"
        }
    ],
    "incidencias": [
        {
            "id": "INC-01",
            "sala": "Sala 3",
            "problema": "Aire acondicionado muy frío",
            "prioridad": "Alta",
            "estado": "Resuelto"
        }
    ]
}

@app.route("/")
def index():
    return send_from_directory(FRONTEND_DIR, "index.html")

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(FRONTEND_DIR, path)

@app.route("/api/cartelera", methods=["GET"])
def get_cartelera():
    return jsonify({"status": "ok", "peliculas": db["peliculas"]})

@app.route("/api/boletos", methods=["GET"])
def get_boletos():
    return jsonify({"status": "ok", "boletos": db["boletos"]})

@app.route("/api/boletos/reservar", methods=["POST"])
def reservar_boleto():
    data = request.get_json() or {}
    peli_id = int(data.get("pelicula_id", 1))
    cliente = data.get("cliente", "").strip() or "Cliente Mostrador"
    cantidad = int(data.get("cantidad", 1))
    asientos = data.get("asientos", "").strip() or "General"

    pelicula = next((p for p in db["peliculas"] if p["id"] == peli_id), db["peliculas"][0])
    total = cantidad * pelicula["precio"]
    folio = f"CR-TK-{len(db['boletos']) + 101}"

    # calculamos el total y guardamos
    nuevo_boleto = {
        "folio": folio,
        "cliente": cliente,
        "pelicula": pelicula["titulo"],
        "horario": pelicula["horario"],
        "sala": pelicula["sala"],
        "cantidad": cantidad,
        "asientos": asientos,
        "total": total,
        "hora": datetime.now().strftime("%H:%M:%S")
    }

    db["boletos"].insert(0, nuevo_boleto)

    return jsonify({
        "status": "ok",
        "mensaje": f"Boleto registrado exitosamente con folio {folio}",
        "boleto": nuevo_boleto
    }), 201

@app.route("/api/dulceria", methods=["GET"])
def get_dulceria():
    return jsonify({"status": "ok", "ordenes": db["dulceria"]})

@app.route("/api/dulceria/ordenar", methods=["POST"])
def ordenar_dulceria():
    data = request.get_json() or {}
    cliente = data.get("cliente", "").strip() or "Cliente Dulcería"
    combo = data.get("combo", "Combo Clásico")
    cantidad = int(data.get("cantidad", 1))
    precio_unitario = 175.0 if "Pareja" in combo else (120.0 if "Individual" in combo else 60.0)
    total = cantidad * precio_unitario
    folio = f"CR-DL-{len(db['dulceria']) + 201}"

    nueva_orden = {
        "folio": folio,
        "cliente": cliente,
        "combo": combo,
        "cantidad": cantidad,
        "total": total,
        "estado": "En preparación"
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
    sala = data.get("sala", "Sala 1")
    problema = data.get("problema", "").strip()
    prioridad = data.get("prioridad", "Media")

    if not problema:
        return jsonify({"status": "error", "mensaje": "Falta escribir el problema"}), 400

    nueva_incidencia = {
        "id": f"INC-0{len(db['incidencias']) + 1}",
        "sala": sala,
        "problema": problema,
        "prioridad": prioridad,
        "estado": "Pendiente"
    }

    db["incidencias"].insert(0, nueva_incidencia)

    return jsonify({
        "status": "ok",
        "mensaje": "Reporte registrado y enviado a supervisión",
        "incidencia": nueva_incidencia
    }), 201

if __name__ == "__main__":
    print("Iniciando servidor de Cine Regina en http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
