# Cine Regina — Sistema de Información

Prototipo inicial y simulación funcional del sistema de información para **Cine Regina** (Caso 20).
Desarrollado para la materia de **Sistemas de Información** (Universidad de Guanajuato, DICIS).

## 🚀 Módulos del Sistema

1. **Taquilla y Boletos**: Selección visual de butacas tipo Cinépolis (estado disponible, ocupado y seleccionado), registro de boletos y cálculo de totales en Back-End.
2. **Dulcería Express**: Envío y monitoreo de comandas de combos y botanas a cocina vía POST.
3. **Reporte de Sala**: Levantamiento y seguimiento técnico de incidencias en proyector, audio o clima.

## 🛠️ Arquitectura

- **Front-End**: HTML5, CSS3 limpio y Vanilla JavaScript con Fetch API.
- **Back-End Local**: Python 3 con Flask (`backend/app.py`).
- **Despliegue Cloud (Netlify)**: Arquitectura Serverless Functions (`netlify/functions/api.mjs`) compatible con las mismas rutas REST `/api/*`.

## 💻 Ejecución Local

1. Dar doble clic en `run_sistema.bat` o ejecutar:
   ```bash
   python backend/app.py
   ```
2. Abrir en el navegador: [http://localhost:5000](http://localhost:5000)

## 🌐 Despliegue en Netlify

El proyecto cuenta con configuración en `netlify.toml` y función serverless para responder a todas las peticiones dinámicas de la API directamente en la nube.
