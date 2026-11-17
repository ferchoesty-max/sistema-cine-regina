# Cine Regina SI (Sistema de Información Integral)

Sistema de Información web completo y ejecutable desarrollado para la materia **Sistemas de Información** en la Universidad de Guanajuato (Campus Irapuato, Salamanca, DICIS), aplicando el **Caso 20: Empresa basada en datos**.

El sistema integra las cinco unidades del curso: flujo e información de valor (Unidad 1), clasificación TPS/MIS/DSS (Unidad 2), arquitectura cliente servidor de tres capas (Unidad 3), base de datos relacional normalizada en SQLite con 14 tablas (Unidad 4) y desarrollo ágil bajo Scrumban y prácticas XP (Unidad 5).

## Módulos del Sistema

1. **Cartelera y Taquilla VIP**: carrusel de estrenos, carrete de fechas, modal de tráilers en YouTube, mapa interactivo de butacas por función, emisión de boleto digital con folio único (`CR-TK-XXX`) e historial de boletos con búsqueda y cancelación que libera asientos en SQLite.
2. **Dulcería Express**: catálogo visual de 12 combos, snacks y bebidas; registro de órdenes para cocina (`CR-DL-XXX`) con descuento automático de inventario de ingredientes (`insumos`) usando la tabla de recetas `producto_insumo`, actualización de estado y eliminación.
3. **Reporte de Sala**: 8 categorías técnicas operativas, registro de fallas por sala y prioridad (`CR-INC-XXX`), bitácora con avance de estado hasta resolución y eliminación de reportes.
4. **Panel Gerencial y Base de Datos SQLite (MIS / DSS)**: indicadores en tiempo real (ingresos de taquilla y dulcería, boletos pagados, comandas e incidencias), monitor del motor SQLite con el conteo vivo de las 14 tablas, consulta a la vista analítica `vista_ocupacion_funciones` con sugerencias comerciales y resurtido directo de insumos en bodega.

## Roles de Acceso y Control de Permisos

Al abrir la aplicación web aparece el selector de acceso (`Cliente` vs `Personal / Gerencia`), respaldado por la tabla `usuarios` (contraseñas con hash SHA-256) y tokens HMAC-SHA256 verificados en Flask y Netlify:

- **Cliente / Invitado** (sin contraseña): consulta cartelera y compra boletos/dulcería, reporta fallas en su sala y solo ve sus propios folios de sesión o búsquedas por folio exacto. El panel gerencial y los botones internos de cocina quedan ocultos.
- **Staff Operativo** (`usuario: staff`, `contraseña: staff2026`): atiende taquilla, cola completa de dulcería y bitácora de incidencias con botones de avance de estado y cancelación/eliminación.
- **Gerente** (`usuario: gerente`, `contraseña: regina2026`): acceso completo, incluyendo la pestaña `Panel Gerencial y BD` y el resurtido de bodega (`insumos`).

## Estructura del Proyecto

- `frontend/`: interfaz SPA en HTML5, CSS3 y JavaScript nativo con Fetch API (`index.html`, `css/style.css`, `js/app.js`, `img/logo.png`).
- `backend/`: servidor Flask en Python (`app.py`), módulo conector a SQLite (`db.py`) y dependencias (`requirements.txt`).
- `database/`: esquema relacional (`schema.sql`), datos semilla (`seed.sql`), script automatizado de reconstrucción y pruebas (`verificar_bd.py`), archivo de base de datos (`cine_regina.db`) y evidencia de verificación (`verificacion_salida.txt`).
- `netlify/`: función serverless (`functions/api.mjs`) y `netlify.toml` para demostración en la nube.
- `run_sistema.bat`: lanzador rápido de un clic en Windows.

## Requisitos e Instalación

1. Tener instalado **Python 3.10 o superior**.
2. Instalar Flask (única dependencia externa):
   ```powershell
   pip install -r backend/requirements.txt
   ```

## Cómo Reconstruir y Verificar la Base de Datos

Para generar desde cero `database/cine_regina.db` con sus 14 tablas, llaves foráneas, disparadores y la vista `vista_ocupacion_funciones`, además de correr las 4 pruebas de integridad:

```powershell
python database/verificar_bd.py
```

Al arrancar el servidor web, `backend/app.py` verifica automáticamente que exista la base de datos y sincroniza las salas VIP, funciones del carrete y catálogo de productos sin perder tus registros.

## Cómo Ejecutar el Sistema en Local

- **Opción rápida (Windows)**: dar doble clic en `run_sistema.bat`.
- **Desde terminal**:
  ```powershell
  python backend/app.py
  ```
- Abrir en el navegador web: `http://localhost:5000`

## Despliegue en Línea

- **Demo en Netlify**: https://cine-regina.netlify.app
- **Repositorio en GitHub**: https://github.com/ferchoesty-max/sistema-cine-regina
