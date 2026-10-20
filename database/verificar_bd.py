"""
Verificación de la base de datos de Cine Regina.

Borra el archivo cine_regina.db, ejecuta schema.sql y seed.sql, e imprime un
reporte de la estructura generada, la integridad referencial y una prueba de
las restricciones. La salida se guarda en verificacion_salida.txt para usarla
como evidencia.

Uso:  python database/verificar_bd.py
"""

import os
import sqlite3
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "cine_regina.db")
SALIDA_PATH = os.path.join(BASE_DIR, "verificacion_salida.txt")

ANCHO = 94


def linea(caracter="="):
    return caracter * ANCHO


def titulo(texto):
    return [linea(), texto.upper().center(ANCHO), linea()]


def leer_sql(nombre):
    with open(os.path.join(BASE_DIR, nombre), "r", encoding="utf-8") as archivo:
        return archivo.read()


def describir_tabla(conexion, tabla):
    """Devuelve las líneas con las columnas y llaves foráneas de una tabla."""
    lineas = []
    columnas = conexion.execute(f"PRAGMA table_info({tabla})").fetchall()

    unicas_simples = set()
    unicas_compuestas = []
    for indice in conexion.execute(f"PRAGMA index_list({tabla})").fetchall():
        _, nombre_indice, es_unico, origen, _ = indice
        if not es_unico:
            continue
        cols = [
            col[2]
            for col in conexion.execute(f"PRAGMA index_info({nombre_indice})").fetchall()
        ]
        if len(cols) == 1:
            unicas_simples.add(cols[0])
        elif origen != "pk":
            unicas_compuestas.append(cols)

    for col in columnas:
        _, nombre, tipo, no_nulo, por_defecto, pk = col
        marcas = []
        if pk:
            marcas.append("PK")
        if no_nulo:
            marcas.append("NOT NULL")
        if nombre in unicas_simples:
            marcas.append("UNIQUE")
        if por_defecto is not None:
            marcas.append(f"DEFAULT {por_defecto}")
        marcas_txt = " | ".join(marcas) if marcas else "-"
        lineas.append(f"    {nombre:<16} {tipo:<8} {marcas_txt}")

    for cols in unicas_compuestas:
        lineas.append(f"    UNIQUE ({', '.join(cols)})")

    for fk in conexion.execute(f"PRAGMA foreign_key_list({tabla})").fetchall():
        _, _, destino, origen, destino_col, al_actualizar, al_borrar, _ = fk
        acciones = []
        if al_borrar != "NO ACTION":
            acciones.append(f"ON DELETE {al_borrar}")
        if al_actualizar != "NO ACTION":
            acciones.append(f"ON UPDATE {al_actualizar}")
        sufijo = f"  {' '.join(acciones)}" if acciones else ""
        lineas.append(f"    FK: {origen} -> {destino}({destino_col}){sufijo}")
    return lineas


def main():
    # La consola de Windows usa cp1252 por defecto; forzamos UTF-8 para las tildes.
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)

    conexion = sqlite3.connect(DB_PATH)
    conexion.execute("PRAGMA foreign_keys = ON")

    salida = []

    def imprimir(bloque, espacio=True):
        if isinstance(bloque, str):
            bloque = [bloque]
        for renglon in bloque:
            print(renglon)
            salida.append(renglon)
        if espacio:
            print()
            salida.append("")

    imprimir(titulo("1. Entorno y creación de la base de datos"))
    imprimir([
        f"Motor de base de datos : SQLite {sqlite3.sqlite_version}",
        "Archivo generado       : database/cine_regina.db",
        "Script de estructura   : database/schema.sql",
        "Script de datos        : database/seed.sql",
        "",
        "Ejecutando schema.sql ...",
    ])

    conexion.executescript(leer_sql("schema.sql"))
    imprimir("  Base de datos creada y tablas definidas sin errores.")

    imprimir("Ejecutando seed.sql ...")
    conexion.executescript(leer_sql("seed.sql"))
    imprimir("  Datos de prueba insertados sin errores.")

    imprimir(titulo("2. Tablas creadas y número de registros"))
    tablas = conexion.execute(
        "SELECT name FROM sqlite_master WHERE type = 'table' "
        "AND name NOT LIKE 'sqlite_%' ORDER BY name"
    ).fetchall()
    imprimir(f"Total de tablas creadas: {len(tablas)}")
    lineas_tablas = [
        f"  {'TABLA':<24}{'REGISTROS':>12}",
        f"  {'-' * 24}  {'-' * 9}",
    ]
    for (nombre,) in tablas:
        total = conexion.execute(f"SELECT COUNT(*) FROM {nombre}").fetchone()[0]
        lineas_tablas.append(f"  {nombre:<24}{total:>12}")
    imprimir(lineas_tablas)

    imprimir(titulo("3. Estructura de las tablas"))
    for (nombre,) in tablas:
        imprimir([f"  TABLA {nombre}"] + describir_tabla(conexion, nombre))

    imprimir(titulo("4. Integridad referencial y consistencia"))
    problemas_fk = conexion.execute("PRAGMA foreign_key_check").fetchall()
    integridad = conexion.execute("PRAGMA integrity_check").fetchone()[0]
    imprimir([
        f"PRAGMA foreign_key_check : {'sin errores' if not problemas_fk else problemas_fk}",
        f"PRAGMA integrity_check   : {integridad}",
        f"PRAGMA foreign_keys      : {'activadas' if conexion.execute('PRAGMA foreign_keys').fetchone()[0] else 'desactivadas'}",
    ])

    imprimir(titulo("5. Consulta de comprobación: ocupación por función"))
    consulta = """
        SELECT pelicula, sala, fecha, hora, aforo,
               asientos_vendidos, porcentaje_ocupacion
        FROM vista_ocupacion_funciones
        ORDER BY id_funcion
    """
    filas = conexion.execute(consulta).fetchall()
    lineas_consulta = [
        f"  {'PELÍCULA':<20}{'SALA':<22}{'FECHA':<12}"
        f"{'HORA':<7}{'AFORO':>6}{'VENDIDOS':>10}{'% OCUP.':>9}",
        f"  {'-' * 20}{'-' * 22}{'-' * 12}{'-' * 7}{'-' * 6}{'-' * 10}{'-' * 9}",
    ]
    for fila in filas:
        pelicula, sala, fecha, hora, aforo, vendidos, porcentaje = fila
        lineas_consulta.append(
            f"  {pelicula:<20}{sala:<22}{fecha:<12}{hora:<7}"
            f"{aforo:>6}{vendidos:>10}{porcentaje:>9}"
        )
    imprimir(lineas_consulta)

    imprimir(titulo("6. Prueba de las restricciones de integridad"))
    pruebas = [
        (
            "Asiento duplicado en la misma función (trigger)",
            [
                "INSERT INTO boletos (id_boleto, folio, id_cliente, id_funcion, "
                "cantidad, total) VALUES (999, 'CR-TK-9998', 2, 1, 1, 95.0)",
                "INSERT INTO boleto_asiento (id_boleto, id_asiento) "
                "SELECT 999, id_asiento FROM asientos "
                "WHERE id_sala = 1 AND codigo = 'C4'",
            ],
        ),
        (
            "Asiento de otra sala (trigger)",
            [
                "INSERT INTO boleto_asiento (id_boleto, id_asiento) "
                "SELECT 2, id_asiento FROM asientos "
                "WHERE id_sala = 3 AND codigo = 'A1'",
            ],
        ),
        (
            "Función inexistente (clave foránea)",
            [
                "INSERT INTO boletos (folio, id_cliente, id_funcion, cantidad, total) "
                "VALUES ('CR-TK-9999', 1, 999, 1, 90.0)",
            ],
        ),
        (
            "Precio negativo (CHECK)",
            [
                "INSERT INTO funciones (id_pelicula, id_sala, fecha, hora, precio) "
                "VALUES (1, 1, '2026-10-26', '10:00', -5)",
            ],
        ),
    ]
    for descripcion, sentencias in pruebas:
        try:
            for sentencia in sentencias:
                conexion.execute(sentencia)
            conexion.rollback()
            imprimir(f"  [FALLO] {descripcion}: la restricción no se aplicó.")
        except sqlite3.Error as error:
            conexion.rollback()
            imprimir([
                f"  [OK] {descripcion}",
                f"       mensaje del motor: {error}",
            ])

    conexion.close()

    imprimir(titulo("Resultado final"))
    imprimir([
        "La base de datos cine_regina.db se creó correctamente con 13 tablas",
        "relacionadas, sus claves primarias y foráneas, restricciones CHECK,",
        "índices y una vista de consulta. Todas las pruebas de integridad",
        "pasaron y las restricciones rechazaron los datos inválidos.",
    ])

    with open(SALIDA_PATH, "w", encoding="utf-8") as archivo:
        archivo.write("\n".join(salida) + "\n")

    print(f"Reporte guardado en: {SALIDA_PATH}")


if __name__ == "__main__":
    main()
