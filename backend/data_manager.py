import os
import json
import uuid
from datetime import datetime

DATA_FILE = os.path.join(os.path.dirname(__file__), "data.json")

INITIAL_DATA = {
    "movies": [
        {
            "id": 1,
            "title": "Dune: Parte Dos",
            "genre": "Ciencia Ficción / Aventura",
            "duration": "166 min",
            "rating": "B15",
            "synopsis": "Paul Atreides se une a Chani y los Fremen mientras busca venganza contra los conspiradores que destruyeron a su familia.",
            "showtimes": [
                {"id": "st-101", "room": "Sala 1 (Láser 4K)", "time": "16:00", "price": 95.0, "format": "2D Láser"},
                {"id": "st-102", "room": "Sala 1 (Láser 4K)", "time": "19:30", "price": 95.0, "format": "2D Láser"}
            ]
        },
        {
            "id": 2,
            "title": "IntensaMente 2",
            "genre": "Animación / Familiar",
            "duration": "96 min",
            "rating": "A",
            "synopsis": "Riley entra a la adolescencia y el cuartel central experimenta una repentina demolición para hacer espacio a nuevas emociones.",
            "showtimes": [
                {"id": "st-201", "room": "Sala 2 (VIP)", "time": "15:00", "price": 140.0, "format": "VIP 2D"},
                {"id": "st-202", "room": "Sala 2 (VIP)", "time": "17:30", "price": 140.0, "format": "VIP 2D"}
            ]
        },
        {
            "id": 3,
            "title": "Oppenheimer",
            "genre": "Drama / Histórico",
            "duration": "180 min",
            "rating": "B15",
            "synopsis": "La historia del físico J. Robert Oppenheimer y su rol en el Proyecto Manhattan que desarrolló la primera bomba atómica.",
            "showtimes": [
                {"id": "st-301", "room": "Sala 3 (Estándar)", "time": "18:00", "price": 80.0, "format": "2D Estándar"},
                {"id": "st-302", "room": "Sala 3 (Estándar)", "time": "21:30", "price": 80.0, "format": "2D Estándar"}
            ]
        }
    ],
    "occupied_seats": {
        "st-101": ["B3", "B4", "C4", "C5", "D4"],
        "st-102": ["A1", "A2", "C3"],
        "st-201": ["B2", "B3", "C2", "C3"],
        "st-202": ["A3", "A4"],
        "st-301": ["C4", "C5", "D5"],
        "st-302": ["B1", "B2"]
    },
    "concessions": [
        {
            "id": "c1",
            "name": "Combo Pareja Clásico",
            "description": "1 Palomitas grandes de mantequilla + 2 Refrescos medianos",
            "price": 185.0,
            "stock": 45,
            "ingredients": {"maiz_kg": 0.4, "refresco_litros": 1.2, "vasos": 2}
        },
        {
            "id": "c2",
            "name": "Combo Regina VIP",
            "description": "1 Palomitas Gourmet (Caramelo) + 1 Nachos con queso extra + 2 Refrescos grandes",
            "price": 240.0,
            "stock": 30,
            "ingredients": {"maiz_kg": 0.4, "queso_litros": 0.3, "nachos_bolsas": 1, "refresco_litros": 1.6, "vasos": 2}
        },
        {
            "id": "c3",
            "name": "Palomitas Medianas Saladas",
            "description": "Porción individual de palomitas recién reventadas con sal de grano",
            "price": 75.0,
            "stock": 60,
            "ingredients": {"maiz_kg": 0.25, "vasos": 1}
        },
        {
            "id": "c4",
            "name": "Refresco Grande (940ml)",
            "description": "Elección de refresco de máquina bien frío",
            "price": 60.0,
            "stock": 80,
            "ingredients": {"refresco_litros": 0.94, "vasos": 1}
        },
        {
            "id": "c5",
            "name": "Hot Dog Tradicional",
            "description": "Salchicha de res con pan caliente, jalapeños y aderezos",
            "price": 65.0,
            "stock": 25,
            "ingredients": {"pan_piezas": 1, "salchichas": 1}
        }
    ],
    "inventory": {
        "maiz_kg": {"current": 48.5, "min": 15.0, "unit": "kg", "name": "Maíz Palomero Premium"},
        "refresco_litros": {"current": 120.0, "min": 30.0, "unit": "litros", "name": "Jarabes Concentrados"},
        "vasos": {"current": 310, "min": 50, "unit": "piezas", "name": "Vasos y Contenedores"},
        "queso_litros": {"current": 14.5, "min": 5.0, "unit": "litros", "name": "Queso Cheddar Caliente"},
        "nachos_bolsas": {"current": 38, "min": 10, "unit": "bolsas", "name": "Totopos de Maíz"},
        "pan_piezas": {"current": 35, "min": 10, "unit": "piezas", "name": "Pan artesanal hot dog"}
    },
    "orders": [
        {
            "folio": "CR-DL-1001",
            "client_name": "Valeria Sánchez",
            "items": [{"name": "Combo Pareja Clásico", "quantity": 1, "subtotal": 185.0}],
            "total": 185.0,
            "status": "Listo para entrega",
            "pickup_time": "15:50",
            "timestamp": "2026-09-28 15:35:10"
        }
    ],
    "tickets": [
        {
            "folio": "CR-TK-8901",
            "client_name": "Luis Mendoza",
            "client_email": "luis.men@ugto.mx",
            "movie_title": "Dune: Parte Dos",
            "showtime": "16:00",
            "room": "Sala 1 (Láser 4K)",
            "seats": ["C4", "C5"],
            "total": 190.0,
            "timestamp": "2026-09-28 15:20:00",
            "qr_code": "CR-TK-8901-DUNE-C4-C5"
        }
    ],
    "incidents": [
        {
            "id": "CR-INC-501",
            "room": "Sala 3",
            "category": "Clima",
            "description": "El aire acondicionado está congelando a la fila D y E, temperatura muy baja.",
            "priority": "Alta",
            "status": "Resuelto",
            "reported_at": "2026-09-28 14:10:00",
            "resolved_at": "2026-09-28 14:18:22",
            "technician_notes": "Termostato ajustado de 17°C a 22°C por Técnico Carlos."
        },
        {
            "id": "CR-INC-502",
            "room": "Sala 1",
            "category": "Audio",
            "description": "Bocina lateral izquierda trasera presenta una pequeña vibración en sonidos graves.",
            "priority": "Media",
            "status": "Pendiente",
            "reported_at": "2026-09-28 15:40:15",
            "resolved_at": None,
            "technician_notes": ""
        }
    ]
}

class DataManager:
    def __init__(self):
        self._load()

    def _load(self):
        if not os.path.exists(DATA_FILE):
            self.data = json.loads(json.dumps(INITIAL_DATA))
            self._save()
        else:
            try:
                with open(DATA_FILE, "r", encoding="utf-8") as f:
                    self.data = json.load(f)
            except Exception:
                self.data = json.loads(json.dumps(INITIAL_DATA))
                self._save()

    def _save(self):
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(self.data, f, indent=2, ensure_ascii=False)

    def get_movies(self):
        return self.data["movies"]

    def get_showtime_seats(self, showtime_id):
        occupied = self.data["occupied_seats"].get(showtime_id, [])
        rows = ["A", "B", "C", "D", "E"]
        cols = 8
        seats = []
        for r in rows:
            for c in range(1, cols + 1):
                seat_code = f"{r}{c}"
                is_occupied = seat_code in occupied
                seats.append({
                    "code": seat_code,
                    "row": r,
                    "col": c,
                    "status": "ocupado" if is_occupied else "disponible"
                })
        return {
            "showtime_id": showtime_id,
            "total_seats": len(rows) * cols,
            "available_count": (len(rows) * cols) - len(occupied),
            "occupied_count": len(occupied),
            "seats": seats
        }

    def book_tickets(self, showtime_id, seats_requested, client_name, client_email):
        if not seats_requested:
            raise ValueError("Debe seleccionar al menos un asiento.")
        
        # Buscar película y función
        target_movie = None
        target_showtime = None
        for m in self.data["movies"]:
            for st in m["showtimes"]:
                if st["id"] == showtime_id:
                    target_movie = m
                    target_showtime = st
                    break
            if target_movie:
                break
        
        if not target_movie or not target_showtime:
            raise ValueError("Función no encontrada.")

        current_occupied = set(self.data["occupied_seats"].get(showtime_id, []))
        
        # Validar colisión de asientos
        for s in seats_requested:
            if s in current_occupied:
                raise ValueError(f"El asiento {s} ya ha sido apartado por otro usuario.")

        # Apartar asientos
        for s in seats_requested:
            current_occupied.add(s)
        self.data["occupied_seats"][showtime_id] = sorted(list(current_occupied))

        total_amount = len(seats_requested) * target_showtime["price"]
        folio = f"CR-TK-{uuid.uuid4().hex[:4].upper()}"
        ticket_record = {
            "folio": folio,
            "client_name": client_name.strip() or "Cliente Mostrador",
            "client_email": client_email.strip() or "cliente@cineregina.mx",
            "movie_title": target_movie["title"],
            "showtime": target_showtime["time"],
            "room": target_showtime["room"],
            "seats": seats_requested,
            "unit_price": target_showtime["price"],
            "total": total_amount,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "qr_code": f"{folio}-{showtime_id}-{'-'.join(seats_requested)}"
        }

        self.data["tickets"].insert(0, ticket_record)
        self._save()
        return ticket_record

    def get_concessions(self):
        return {
            "catalog": self.data["concessions"],
            "inventory": self.data["inventory"]
        }

    def order_concessions(self, client_name, items, pickup_time):
        if not items:
            raise ValueError("Debe incluir al menos un producto en el pedido.")

        total = 0.0
        processed_items = []

        # Validar e impactar inventario
        catalog_map = {c["id"]: c for c in self.data["concessions"]}
        for it in items:
            cid = it.get("id")
            qty = int(it.get("quantity", 1))
            if cid not in catalog_map:
                raise ValueError(f"Producto {cid} no existe en catálogo.")
            if qty <= 0:
                continue

            prod = catalog_map[cid]
            subtotal = prod["price"] * qty
            total += subtotal
            processed_items.append({
                "id": cid,
                "name": prod["name"],
                "quantity": qty,
                "subtotal": subtotal
            })

            # Descontar insumos del inventario interno
            for ing_key, ing_qty in prod.get("ingredients", {}).items():
                if ing_key in self.data["inventory"]:
                    needed = ing_qty * qty
                    self.data["inventory"][ing_key]["current"] = max(
                        0.0,
                        round(self.data["inventory"][ing_key]["current"] - needed, 2)
                    )

        folio = f"CR-DL-{uuid.uuid4().hex[:4].upper()}"
        order_record = {
            "folio": folio,
            "client_name": client_name.strip() or "Cliente Express",
            "items": processed_items,
            "total": round(total, 2),
            "status": "En preparación",
            "pickup_time": pickup_time or "Inmediato (10 min)",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        self.data["orders"].insert(0, order_record)
        self._save()
        return order_record

    def create_incident(self, room, category, description, priority="Media"):
        if not room or not description:
            raise ValueError("La sala y la descripción son obligatorias.")

        incident_id = f"CR-INC-{uuid.uuid4().hex[:3].upper()}"
        incident_record = {
            "id": incident_id,
            "room": room,
            "category": category,
            "description": description.strip(),
            "priority": priority,
            "status": "Pendiente",
            "reported_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "resolved_at": None,
            "technician_notes": ""
        }

        self.data["incidents"].insert(0, incident_record)
        self._save()
        return incident_record

    def resolve_incident(self, incident_id, technician_notes):
        found = False
        for inc in self.data["incidents"]:
            if inc["id"] == incident_id:
                inc["status"] = "Resuelto"
                inc["resolved_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                inc["technician_notes"] = technician_notes.strip() or "Incidencia atendida por el equipo técnico en sala."
                found = True
                break
        if not found:
            raise ValueError(f"Incidencia {incident_id} no localizada.")
        self._save()
        return inc

    def get_incidents(self):
        return self.data["incidents"]

    def get_dashboard_stats(self):
        total_tickets_revenue = sum(t["total"] for t in self.data["tickets"])
        total_concessions_revenue = sum(o["total"] for o in self.data["orders"])
        total_revenue = total_tickets_revenue + total_concessions_revenue
        total_tickets_sold = sum(len(t["seats"]) for t in self.data["tickets"])

        # Ocupación promedio
        total_capacity = 0
        total_occupied = 0
        for m in self.data["movies"]:
            for st in m["showtimes"]:
                total_capacity += 40 # 5x8
                total_occupied += len(self.data["occupied_seats"].get(st["id"], []))

        occupancy_rate = round((total_occupied / total_capacity * 100), 1) if total_capacity else 0

        pending_incidents = sum(1 for i in self.data["incidents"] if i["status"] == "Pendiente")

        # Alertas de inventario
        low_inventory_alerts = []
        for k, v in self.data["inventory"].items():
            if v["current"] <= v["min"]:
                low_inventory_alerts.append({
                    "key": k,
                    "name": v["name"],
                    "current": v["current"],
                    "min": v["min"],
                    "unit": v["unit"]
                })

        return {
            "total_revenue": round(total_revenue, 2),
            "tickets_revenue": round(total_tickets_revenue, 2),
            "concessions_revenue": round(total_concessions_revenue, 2),
            "total_tickets_sold": total_tickets_sold,
            "occupancy_rate": occupancy_rate,
            "pending_incidents_count": pending_incidents,
            "low_inventory_alerts": low_inventory_alerts,
            "recent_tickets": self.data["tickets"][:5],
            "recent_orders": self.data["orders"][:5],
            "inventory": self.data["inventory"]
        }
