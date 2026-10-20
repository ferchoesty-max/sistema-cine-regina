"""
Conexión de Cine Regina con la base de datos SQLite.

Este módulo es el puente previsto entre el back-end de Flask y el archivo
database/cine_regina.db. Todavía no sustituye a los datos en memoria de
backend/app.py; la integración completa corresponde a la siguiente etapa.

Uso:
    from db import consultar, ejecutar

    peliculas = consultar("SELECT * FROM peliculas WHERE activa = 1")
    folio = ejecutar("INSERT INTO clientes (nombre, correo) VALUES (?, ?)",
                     ("Ana", "ana@ugto.mx"))
"""

import os
import sqlite3

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.abspath(os.path.join(BASE_DIR, "..", "database", "cine_regina.db"))


def conectar():
    """Abre una conexión con las llaves foráneas activas."""
    conexion = sqlite3.connect(DB_PATH)
    conexion.row_factory = sqlite3.Row
    conexion.execute("PRAGMA foreign_keys = ON")
    return conexion


def consultar(sql, parametros=()):
    """Devuelve una lista de diccionarios con el resultado de la consulta."""
    conexion = conectar()
    try:
        filas = conexion.execute(sql, parametros).fetchall()
        return [dict(fila) for fila in filas]
    finally:
        conexion.close()


def ejecutar(sql, parametros=()):
    """Ejecuta una sentencia de escritura y devuelve el id generado."""
    conexion = conectar()
    try:
        cursor = conexion.execute(sql, parametros)
        conexion.commit()
        return cursor.lastrowid
    finally:
        conexion.close()
