const IMAGENES_DULCERIA = {
  Pareja: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=500&q=80",
  VIP: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=500&q=80",
  Familiar: "https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?auto=format&fit=crop&w=500&q=80",
  Individual: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=500&q=80",
  Nachos: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=500&q=80",
  "Hot Dog": "https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=500&q=80",
  Boneless: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=500&q=80",
  Pizza: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80",
  Crepa: "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=500&q=80",
  ICEE: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=500&q=80",
  Frappe: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=80",
  Refresco: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80"
};

const IMAGENES_INCIDENCIAS = {
  Proyección: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80",
  Audio: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=500&q=80",
  Clima: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=500&q=80",
  Butacas: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=500&q=80",
  Limpieza: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=500&q=80",
  Iluminación: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=500&q=80",
  Servicio: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80",
  Accesos: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=500&q=80"
};

const FECHAS_CARRETE = [
  { fecha: "2026-11-04", etiqueta: "HOY", dia_semana: "Mié", dia_num: "04 Nov" },
  { fecha: "2026-11-05", etiqueta: "MAÑANA", dia_semana: "Jue", dia_num: "05 Nov" },
  { fecha: "2026-11-06", etiqueta: "VIERNES", dia_semana: "Vie", dia_num: "06 Nov" },
  { fecha: "2026-11-07", etiqueta: "SÁBADO", dia_semana: "Sáb", dia_num: "07 Nov" },
  { fecha: "2026-11-08", etiqueta: "DOMINGO", dia_semana: "Dom", dia_num: "08 Nov" },
  { fecha: "2026-11-09", etiqueta: "LUNES", dia_semana: "Lun", dia_num: "09 Nov" }
];

const PELICULAS_BASE = [
  {
    id: 1,
    titulo: "La Venganza del Charro Negro",
    sala: "Sala 1 Regina VIP",
    precio: 145.0,
    clasificacion: "B",
    duracion: "98 min",
    genero: "Animación / Misterio",
    formato: "REGINA VIP · DOBLADA",
    poster: "https://m.media-amazon.com/images/M/MV5BMmEwMjkwZGQtZDNhMC00NzY2LTkyNTktNzZjYmMxZTI5MDNlXkEyXkFqcGc@._V1_FMjpg_UX600_.jpg",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80",
    trailer_id: "IzynsBv2Dnw",
    sinopsis: "Leo San Juan y su equipo se enfrentan nuevamente al temible Charro Negro en una oscura batalla por las almas atrapadas en el inframundo.",
    horarios_base: ["14:30", "17:00", "19:30", "22:00"],
    asientos_semilla: ["B3", "B4", "C4", "C5"]
  },
  {
    id: 2,
    titulo: "Clayface",
    sala: "Sala 2 Regina VIP",
    precio: 145.0,
    clasificacion: "B15",
    duracion: "118 min",
    genero: "Terror / Suspenso DC",
    formato: "REGINA VIP · DOBLADA",
    poster: "https://m.media-amazon.com/images/M/MV5BMjNlMjM4NTAtYjE5YS00ZGYyLWEyMTYtNjFlMmIxZDEzYjhhXkEyXkFqcGc@._V1_FMjpg_UX600_.jpg",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80",
    trailer_id: "0D9f0xOPvHg",
    sinopsis: "Un actor de cine en decadencia utiliza una sustancia experimental para mantenerse relevante, transformando su cuerpo en arcilla viviente.",
    horarios_base: ["15:15", "18:00", "20:45", "23:10"],
    asientos_semilla: ["A4", "A5", "D2", "D3"]
  },
  {
    id: 3,
    titulo: "Street Fighter",
    sala: "Sala 3 Regina VIP",
    precio: 145.0,
    clasificacion: "B",
    duracion: "124 min",
    genero: "Acción / Artes Marciales",
    formato: "REGINA VIP · DOBLADA",
    poster: "https://m.media-amazon.com/images/M/MV5BYjhlN2EyNGUtY2U4YS00ZTQ3LTg0NTgtNGIxZmVhMDlmMjIyXkEyXkFqcGc@._V1_FMjpg_UX600_.jpg",
    backdrop: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1400&q=80",
    trailer_id: "mzYHS4VIjgY",
    sinopsis: "Los mejores peleadores del mundo son convocados al torneo definitivo mientras una organización criminal amenaza la paz global.",
    horarios_base: ["14:00", "16:45", "19:15", "21:45"],
    asientos_semilla: ["C2", "C3", "E5", "E6"]
  },
  {
    id: 4,
    titulo: "Godzilla Minus Zero",
    sala: "Sala 4 Regina VIP",
    precio: 145.0,
    clasificacion: "B",
    duracion: "132 min",
    genero: "Ciencia Ficción / Kaiju",
    formato: "REGINA VIP · ESPAÑOL",
    poster: "https://m.media-amazon.com/images/M/MV5BYzY2OWFhMTgtODJhMi00NDIyLWIzNTQtYjc4MjE4YTBjYzllXkEyXkFqcGc@._V1_FMjpg_UX600_.jpg",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80",
    trailer_id: "9IVAGWQdGQg",
    sinopsis: "Ambientada en 1949, Japón intenta reconstruirse cuando el colosal monstruo despierta nuevamente desde las profundidades del océano.",
    horarios_base: ["15:00", "17:45", "20:30", "23:00"],
    asientos_semilla: ["B5", "B6", "C6"]
  },
  {
    id: 5,
    titulo: "Klara y el Sol",
    sala: "Sala 5 Regina VIP",
    precio: 145.0,
    clasificacion: "A",
    duracion: "115 min",
    genero: "Ciencia Ficción / Drama",
    formato: "REGINA VIP · ESPAÑOL",
    poster: "https://m.media-amazon.com/images/M/MV5BNjQ1YzgwMTMtZDRhNC00MDE0LWFmODctM2ZlNjg5MmNiMDI1XkEyXkFqcGc@._V1_FMjpg_UX600_.jpg",
    backdrop: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80",
    trailer_id: "v-Gy7zfOqAg",
    sinopsis: "Klara, una amiga artificial dotada de gran curiosidad, observa el mundo humano mientras espera ser elegida por una familia.",
    horarios_base: ["13:45", "16:15", "18:45", "21:15"],
    asientos_semilla: ["A1", "A2", "D4"]
  },
  {
    id: 6,
    titulo: "Los Juegos del Hambre: Amanecer en la Cosecha",
    sala: "Sala 6 Regina VIP",
    precio: 145.0,
    clasificacion: "B15",
    duracion: "146 min",
    genero: "Acción / Distopía",
    formato: "REGINA VIP · DOBLADA",
    poster: "https://m.media-amazon.com/images/M/MV5BNjEzYTE2ODEtNzY5Zi00ZmVmLWEyYzEtYjdlZWU2NjcyYzMzXkEyXkFqcGc@._V1_FMjpg_UX600_.jpg",
    backdrop: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1400&q=80",
    trailer_id: "UPpNu2Uc5KE",
    sinopsis: "En el Quinto Vasallaje de los Veinticinco, el joven Haymitch Abernathy es seleccionado en el Distrito 12 para enfrentar el doble de tributos.",
    horarios_base: ["14:15", "17:30", "20:15", "22:45"],
    asientos_semilla: ["C3", "C4", "D5", "D6"]
  },
  {
    id: 7,
    titulo: "Verity: La Sombra de un Engaño",
    sala: "Sala 1 Regina VIP",
    precio: 145.0,
    clasificacion: "B15",
    duracion: "122 min",
    genero: "Suspenso / Thriller",
    formato: "REGINA VIP · DOBLADA",
    poster: "https://m.media-amazon.com/images/M/MV5BZmE0OWRiNzktY2MwMy00YzQ5LWFkMzctNjI1ZWQ1NTRiZGM3XkEyXkFqcGc@._V1_FMjpg_UX600_.jpg",
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80",
    trailer_id: "JJPMGhSN4YQ",
    sinopsis: "Una escritora contratada para terminar las novelas de la autora Verity Crawford descubre un manuscrito oculto con confesiones escalofriantes.",
    horarios_base: ["15:30", "18:15", "21:00", "23:15"],
    asientos_semilla: ["B1", "B2", "E3"]
  },
  {
    id: 8,
    titulo: "El Laberinto del Fauno (20 Aniversario)",
    sala: "Sala 2 Regina VIP",
    precio: 145.0,
    clasificacion: "B15",
    duracion: "118 min",
    genero: "Fantasía Oscura / Drama",
    formato: "REGINA VIP · ESPAÑOL",
    poster: "https://m.media-amazon.com/images/M/MV5BOTc1NTAxMWItMWFlNy00MmU2LTkwMTMtNzMwOTg5OTQ5YTFiXkEyXkFqcGc@._V1_FMjpg_UX600_.jpg",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80",
    trailer_id: "CW0BGBZe8vM",
    sinopsis: "En la España de 1944, la joven Ofelia descubre un antiguo laberinto donde un fauno le revela que ella es la princesa de un reino mágico.",
    horarios_base: ["16:00", "18:30", "21:15", "23:30"],
    asientos_semilla: ["C7", "C8", "D7"]
  }
];

function construirCatalogoInicial() {
  const peliculas = [];
  const asientosPorFuncion = {};
  const patronesExtra = [
    ["A3", "A4"],
    ["B6", "B7"],
    ["D1", "D2"],
    ["E4", "E5"]
  ];

  for (const p of PELICULAS_BASE) {
    const funcionesPeli = [];
    FECHAS_CARRETE.forEach((fObj, idxF) => {
      const fechaStr = fObj.fecha;
      p.horarios_base.forEach((horaStr, idxH) => {
        const fid = `F-${p.id}-${fechaStr.replace(/-/g, '')}-${horaStr.replace(/:/g, '')}`;
        const ocupados = idxH === 0
          ? [...p.asientos_semilla]
          : [...patronesExtra[(p.id + idxF + idxH) % patronesExtra.length]];
        asientosPorFuncion[fid] = ocupados;
        funcionesPeli.push({
          id_funcion: fid,
          fecha: fechaStr,
          dia_etiqueta: `${fObj.etiqueta} (${fObj.dia_num})`,
          hora: horaStr,
          sala: p.sala,
          precio: p.precio,
          formato: p.formato
        });
      });
    });

    peliculas.push({
      id: p.id,
      titulo: p.titulo,
      horario: p.horarios_base[0],
      sala: p.sala,
      precio: p.precio,
      clasificacion: p.clasificacion,
      duracion: p.duracion,
      genero: p.genero,
      formato: p.formato,
      poster: p.poster,
      backdrop: p.backdrop,
      trailer_id: p.trailer_id,
      sinopsis: p.sinopsis,
      funciones: funcionesPeli
    });
  }

  return { peliculas, asientosPorFuncion };
}

const initData = construirCatalogoInicial();

const db = {
  fechas: FECHAS_CARRETE,
  peliculas: initData.peliculas,
  asientos_ocupados: initData.asientosPorFuncion,
  boletos: [
    {
      folio: "CR-TK-101",
      cliente: "Luis Mendoza",
      pelicula: "La Venganza del Charro Negro",
      fecha: "2026-11-04",
      horario: "14:30",
      sala: "Sala 1 Regina VIP",
      cantidad: 2,
      asientos: "C4, C5",
      total: 290.0,
      hora: "13:50"
    },
    {
      folio: "CR-TK-102",
      cliente: "Valeria Sánchez",
      pelicula: "Clayface",
      fecha: "2026-11-04",
      horario: "18:00",
      sala: "Sala 2 Regina VIP",
      cantidad: 2,
      asientos: "B6, B7",
      total: 290.0,
      hora: "16:15"
    }
  ],
  dulceria: [
    {
      folio: "CR-DL-201",
      cliente: "Sofía Martínez",
      combo: "Combo Pareja (Palomitas + 2 Refrescos)",
      cantidad: 1,
      total: 185.0,
      estado: "En preparación",
      imagen: IMAGENES_DULCERIA.Pareja
    },
    {
      folio: "CR-DL-202",
      cliente: "Diego Hernández",
      combo: "Combo Regina VIP (Palomitas Caramelo + Nachos + 2 Refrescos)",
      cantidad: 1,
      total: 240.0,
      estado: "Listo para entrega",
      imagen: IMAGENES_DULCERIA.VIP
    }
  ],
  incidencias: [
    {
      id: "INC-01",
      sala: "Sala 3 Regina VIP",
      categoria: "Clima",
      problema: "Aire acondicionado muy frío en filas D y E",
      prioridad: "Alta",
      estado: "Resuelto",
      imagen: IMAGENES_INCIDENCIAS.Clima
    },
    {
      id: "INC-02",
      sala: "Sala 1 Regina VIP",
      categoria: "Audio",
      problema: "Bocina lateral izquierda vibra en frecuencias graves",
      prioridad: "Media",
      estado: "Pendiente",
      imagen: IMAGENES_INCIDENCIAS.Audio
    }
  ]
};

function obtenerPrecioDulceria(combo) {
  const c = combo.toLowerCase();
  if (c.includes('familiar') || c.includes('mega')) return 310.0;
  if (c.includes('vip')) return 240.0;
  if (c.includes('pareja')) return 185.0;
  if (c.includes('pizza')) return 135.0;
  if (c.includes('boneless')) return 125.0;
  if (c.includes('individual')) return 120.0;
  if (c.includes('crepa')) return 95.0;
  if (c.includes('nachos')) return 85.0;
  if (c.includes('frappe') || c.includes('frappé')) return 80.0;
  if (c.includes('icee')) return 75.0;
  if (c.includes('hot dog')) return 65.0;
  return 60.0;
}

function obtenerImagenDulceria(combo) {
  const c = combo.toLowerCase();
  for (const [clave, url] of Object.entries(IMAGENES_DULCERIA)) {
    if (c.includes(clave.toLowerCase())) return url;
  }
  return IMAGENES_DULCERIA.Pareja;
}

function obtenerImagenIncidencia(categoria, problema) {
  const texto = `${categoria} ${problema}`.toLowerCase();
  if (texto.includes('audio') || texto.includes('bocina') || texto.includes('sonido')) return IMAGENES_INCIDENCIAS.Audio;
  if (texto.includes('clima') || texto.includes('aire') || texto.includes('frio') || texto.includes('frío')) return IMAGENES_INCIDENCIAS.Clima;
  if (texto.includes('butaca') || texto.includes('asiento') || texto.includes('reclinable')) return IMAGENES_INCIDENCIAS.Butacas;
  if (texto.includes('limpieza') || texto.includes('derrame')) return IMAGENES_INCIDENCIAS.Limpieza;
  if (texto.includes('iluminacion') || texto.includes('iluminación') || texto.includes('luz')) return IMAGENES_INCIDENCIAS.Iluminación;
  if (texto.includes('servicio') || texto.includes('mesero')) return IMAGENES_INCIDENCIAS.Servicio;
  if (texto.includes('acceso') || texto.includes('puerta') || texto.includes('qr')) return IMAGENES_INCIDENCIAS.Accesos;
  return IMAGENES_INCIDENCIAS.Proyección;
}

export default async (req, context) => {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/\.netlify\/functions\/api\/?/, '').replace(/^\/api\/?/, '');
  const method = req.method;

  if (method === 'GET' && path === 'cartelera') {
    return Response.json({
      status: 'ok',
      fechas: db.fechas,
      peliculas: db.peliculas,
      asientos_ocupados: db.asientos_ocupados
    });
  }

  if (method === 'GET' && path === 'boletos') {
    return Response.json({ status: 'ok', boletos: db.boletos });
  }

  if (method === 'POST' && path === 'boletos/reservar') {
    const data = await req.json().catch(() => ({}));
    const peliId = parseInt(data.pelicula_id || 1, 10);
    let funcionId = (data.funcion_id || '').trim();
    const fecha = (data.fecha || '2026-11-04').trim();
    const horario = (data.horario || '').trim();
    const cliente = (data.cliente || '').trim() || 'Cliente Mostrador';
    const cantidad = parseInt(data.cantidad || 1, 10);
    const asientos = (data.asientos || '').trim() || 'General';

    const pelicula = db.peliculas.find(p => p.id === peliId) || db.peliculas[0];
    let funcionObj = null;
    if (funcionId) {
      funcionObj = pelicula.funciones.find(f => f.id_funcion === funcionId);
    }
    if (!funcionObj && horario) {
      funcionObj = pelicula.funciones.find(f => f.fecha === fecha && f.hora === horario);
    }
    if (!funcionObj) {
      funcionObj = pelicula.funciones[0];
      funcionId = funcionObj.id_funcion;
    }

    const listaNuevos = asientos.split(',').map(s => s.trim()).filter(Boolean);
    const setOcupados = new Set(db.asientos_ocupados[funcionId] || []);
    listaNuevos.forEach(a => setOcupados.add(a));
    db.asientos_ocupados[funcionId] = Array.from(setOcupados).sort();

    const total = cantidad * funcionObj.precio;
    const folio = `CR-TK-${db.boletos.length + 101}`;

    const nuevoBoleto = {
      folio,
      cliente,
      pelicula: pelicula.titulo,
      funcion_id: funcionId,
      fecha: funcionObj.fecha,
      horario: funcionObj.hora,
      sala: funcionObj.sala,
      cantidad,
      asientos,
      total,
      hora: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    };

    db.boletos.unshift(nuevoBoleto);

    return Response.json({
      status: 'ok',
      mensaje: `Boleto registrado exitosamente con folio ${folio}`,
      boleto: nuevoBoleto,
      asientos_ocupados_funcion: db.asientos_ocupados[funcionId]
    }, { status: 201 });
  }

  if (method === 'GET' && path === 'dulceria') {
    return Response.json({ status: 'ok', ordenes: db.dulceria });
  }

  if (method === 'POST' && path === 'dulceria/ordenar') {
    const data = await req.json().catch(() => ({}));
    const cliente = (data.cliente || '').trim() || 'Cliente Dulcería';
    const combo = data.combo || 'Combo Pareja (Palomitas + 2 Refrescos)';
    const cantidad = parseInt(data.cantidad || 1, 10);
    const precioUnitario = parseFloat(data.precio_unitario) || obtenerPrecioDulceria(combo);
    const total = cantidad * precioUnitario;
    const folio = `CR-DL-${db.dulceria.length + 201}`;
    const imagen = data.imagen || obtenerImagenDulceria(combo);

    const nuevaOrden = {
      folio,
      cliente,
      combo,
      cantidad,
      total,
      estado: 'En preparación',
      imagen
    };

    db.dulceria.unshift(nuevaOrden);

    return Response.json({
      status: 'ok',
      mensaje: `Orden enviada a cocina con folio ${folio}`,
      orden: nuevaOrden
    }, { status: 201 });
  }

  if (method === 'GET' && path === 'incidencias') {
    return Response.json({ status: 'ok', incidencias: db.incidencias });
  }

  if (method === 'POST' && path === 'incidencias/reportar') {
    const data = await req.json().catch(() => ({}));
    const sala = data.sala || 'Sala 1 Regina VIP';
    const categoria = data.categoria || 'Proyección';
    const problema = (data.problema || '').trim();
    const prioridad = data.prioridad || 'Media';

    if (!problema) {
      return Response.json({ status: 'error', mensaje: 'Falta escribir el problema' }, { status: 400 });
    }

    const imagen = data.imagen || obtenerImagenIncidencia(categoria, problema);

    const nuevaIncidencia = {
      id: `INC-0${db.incidencias.length + 1}`,
      sala,
      categoria,
      problema,
      prioridad,
      estado: 'Pendiente',
      imagen
    };

    db.incidencias.unshift(nuevaIncidencia);

    return Response.json({
      status: 'ok',
      mensaje: 'Reporte registrado y enviado a mantenimiento',
      incidencia: nuevaIncidencia
    }, { status: 201 });
  }

  return Response.json({ status: 'error', mensaje: 'Ruta no encontrada' }, { status: 404 });
};

export const config = {
  path: "/api/*"
};
