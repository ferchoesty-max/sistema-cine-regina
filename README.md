# Cine Regina - Sistema de Informacion

Este proyecto es una simulacion funcional y prototipo de sistema de informacion para la empresa Cine Regina (Caso 20). Se desarrollo para la materia de Sistemas de Informacion en la Universidad de Guanajuato (DICIS, Salamanca).

La idea principal fue integrar la parte del Front-End con el Back-End para ver como interactuan los datos entre la pantalla del usuario y el servidor.

## Modulos del sistema

- Taquilla y seleccion de asientos: permite elegir las butacas de forma visual en la sala (tipo mapa de cine), calculando el costo total y registrando el boleto en el servidor.
- Dulceria express: formulario para pedir combos o alimentos y mandar la orden a cocina para su preparacion.
- Reporte de incidencias: modulo para registrar problemas tecnicos en salas (proyeccion, sonido o clima) y darle seguimiento.

## Estructura del proyecto

- frontend/: contiene la interfaz hecha con HTML, CSS y JavaScript vanilla (usando Fetch para comunicarse con el servidor).
- backend/: servidor en Python usando Flask (app.py) para correrlo de forma local en la computadora.
- netlify/: funciones serverless para que el sistema tambien pueda responder peticiones en la nube sin necesidad de tener un servidor prendido.

## Como correrlo en local

1. Dar doble clic al archivo `run_sistema.bat` (o abrir terminal y poner `python backend/app.py`).
2. Abrir en el navegador la direccion: http://localhost:5000

## Deploy en linea

El sistema tambien esta montado en Netlify para poder probarlo directamente desde el navegador:
https://cine-regina.netlify.app
