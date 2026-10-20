# Base de datos de Cine Regina

Primera versión funcional del modelo de datos del sistema, implementada en
SQLite 3. El diseño cubre los tres módulos del prototipo: taquilla y butacas,
dulcería y reportes de incidencias en sala.

## Archivos

| Archivo | Contenido |
|:---|:---|
| `schema.sql` | Creación de las 13 tablas, llaves, restricciones, índices, disparadores y la vista `vista_ocupacion_funciones`. |
| `seed.sql` | Datos de prueba: 3 salas, 120 butacas, 3 películas, 6 funciones, clientes, boletos, productos, insumos, órdenes e incidencias. |
| `verificar_bd.py` | Borra y reconstruye `cine_regina.db`, imprime la estructura y prueba las restricciones. |
| `cine_regina.db` | Archivo generado. No se versiona en Git. |
| `verificacion_salida.txt` | Salida del script anterior, usada como evidencia. |

## Cómo regenerar la base

```powershell
python database/verificar_bd.py
```

El script crea el archivo `database/cine_regina.db` desde cero. No requiere
instalar un servidor de bases de datos ni dependencias externas, porque usa el
módulo `sqlite3` de la biblioteca estándar de Python.

## Uso desde el back-end

`backend/db.py` expone dos funciones:

```python
from db import consultar, ejecutar

cartelera = consultar("""
    SELECT p.titulo, f.hora, s.nombre AS sala, f.precio
    FROM funciones AS f
    JOIN peliculas AS p ON p.id_pelicula = f.id_pelicula
    JOIN salas AS s ON s.id_sala = f.id_sala
    WHERE f.fecha = ? AND f.estado = 'Programada'
""", ("2026-10-24",))
```

## Nota sobre el motor

Se eligió SQLite porque el proyecto es un prototipo académico que debe correr
en cualquier computadora sin instalar un servidor. El esquema usa tipos y
restricciones estándar, de modo que puede migrarse a MySQL o SQL Server
cambiando la sintaxis de `AUTOINCREMENT` y de los `CHECK` con `GLOB`.
