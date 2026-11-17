import crypto from 'node:crypto';

const AUTH_SECRET = process.env.CINE_SECRET || 'cine-regina-dicis-2026';

const USUARIOS_DEMO = [
  {
    username: 'gerente',
    passwordHash: 'e94d810933f7ea8151d5c1a85ec5a9d6c4390bbb00c36991313b60b0deb9d6df',
    nombre: 'Fernando Tolentino (Gerente)',
    rol: 'gerente'
  },
  {
    username: 'staff',
    passwordHash: '49cf21a443a3bcd6ea37f94a1896db8fc62056808025a6d4ed450888cf2039ab',
    nombre: 'Carlos Ramírez (Staff)',
    rol: 'staff'
  },
  {
    username: 'cliente',
    passwordHash: '19d701a184ebe5a0f9721d8acd219444932ddf2b8b8b85802e97b93c2c4c98d1',
    nombre: 'Luis Mendoza (Cliente VIP)',
    rol: 'cliente'
  }
];

function hashPassword(pwd) {
  return crypto.createHash('sha256').update(`regina:${pwd}`).digest('hex');
}

function firmarToken(usuario) {
  const b64 = Buffer.from(JSON.stringify(usuario), 'utf8').toString('base64url');
  const sig = crypto.createHmac('sha256', AUTH_SECRET).update(b64).digest('hex');
  return `${b64}.${sig}`;
}

function verificarToken(token) {
  if (!token || !token.includes('.')) return null;
  const idx = token.lastIndexOf('.');
  const b64 = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const esperado = crypto.createHmac('sha256', AUTH_SECRET).update(b64).digest('hex');
  if (sig.length !== esperado.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(esperado))) {
    return null;
  }
  try {
    const data = JSON.parse(Buffer.from(b64, 'base64url').toString('utf8'));
    if (['cliente', 'staff', 'gerente'].includes(data.rol)) return data;
  } catch {
    return null;
  }
  return null;
}

function usuarioActual(req) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : (req.headers.get('x-cine-token') || '').trim();
  const u = verificarToken(token);
  if (u) return { usuario: u, autenticado: true };
  return { usuario: { username: 'visitante', nombre: 'Cliente Visitante', rol: 'cliente' }, autenticado: false };
}

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
    asientos_semilla: ["B3", "B4"]
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
        let ocupados;
        if (idxH === 0) {
          ocupados = [...p.asientos_semilla];
        } else if (p.id === 2 && fechaStr === "2026-11-04" && horaStr === "18:00") {
          ocupados = ["D1", "D2"];
        } else {
          ocupados = [...patronesExtra[(p.id + idxF + idxH) % patronesExtra.length]];
        }
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
initData.asientosPorFuncion["F-1-20261104-1430"] = ["B3", "B4", "C4", "C5"];
initData.asientosPorFuncion["F-2-20261104-1800"] = ["B6", "B7", "D1", "D2"];

const db = {
  fechas: FECHAS_CARRETE,
  peliculas: initData.peliculas,
  asientos_ocupados: initData.asientosPorFuncion,
  boletos: [
    {
      folio: "CR-TK-101",
      cliente: "Luis Mendoza",
      pelicula: "La Venganza del Charro Negro",
      funcion_id: "F-1-20261104-1430",
      fecha: "2026-11-04",
      horario: "14:30",
      sala: "Sala 1 Regina VIP",
      cantidad: 2,
      asientos: "C4, C5",
      total: 290.0,
      estado: "Pagado",
      hora: "13:50"
    },
    {
      folio: "CR-TK-102",
      cliente: "Valeria Sánchez",
      pelicula: "Clayface",
      funcion_id: "F-2-20261104-1800",
      fecha: "2026-11-04",
      horario: "18:00",
      sala: "Sala 2 Regina VIP",
      cantidad: 2,
      asientos: "B6, B7",
      total: 290.0,
      estado: "Pagado",
      hora: "16:15"
    }
  ],
  dulceria: [
    {
      folio: "CR-DL-1001",
      cliente: "Valeria Sánchez",
      combo: "Combo Pareja Clásico (Palomitas Grandes + 2 Refrescos)",
      cantidad: 1,
      total: 185.0,
      estado: "Lista",
      imagen: IMAGENES_DULCERIA.Pareja
    },
    {
      folio: "CR-DL-1002",
      cliente: "Cliente Mostrador",
      combo: "Refresco Grande de Máquina (940 ml), Palomitas Medianas Saladas",
      cantidad: 2,
      total: 135.0,
      estado: "En preparación",
      imagen: IMAGENES_DULCERIA.Refresco
    }
  ],
  incidencias: [
    {
      id: "CR-INC-501",
      folio: "CR-INC-501",
      sala: "Sala 3 Regina VIP",
      categoria: "Clima",
      problema: "El aire acondicionado está congelando la fila D y E, temperatura muy baja.",
      prioridad: "Alta",
      estado: "Resuelto",
      imagen: IMAGENES_INCIDENCIAS.Clima
    },
    {
      id: "CR-INC-502",
      folio: "CR-INC-502",
      sala: "Sala 1 Regina VIP",
      categoria: "Audio",
      problema: "La bocina lateral izquierda trasera vibra en los sonidos graves.",
      prioridad: "Media",
      estado: "Pendiente",
      imagen: IMAGENES_INCIDENCIAS.Audio
    }
  ],
  insumos: [
    { id_insumo: 1, nombre: "Maíz palomero premium", unidad: "kg", stock_actual: 48.5, stock_minimo: 15.0 },
    { id_insumo: 2, nombre: "Jarabes concentrados", unidad: "litros", stock_actual: 120.0, stock_minimo: 30.0 },
    { id_insumo: 3, nombre: "Vasos y contenedores", unidad: "piezas", stock_actual: 310.0, stock_minimo: 50.0 },
    { id_insumo: 4, nombre: "Queso cheddar caliente", unidad: "litros", stock_actual: 14.5, stock_minimo: 5.0 },
    { id_insumo: 5, nombre: "Totopos de maíz", unidad: "bolsas", stock_actual: 38.0, stock_minimo: 10.0 },
    { id_insumo: 6, nombre: "Pan artesanal", unidad: "piezas", stock_actual: 35.0, stock_minimo: 10.0 },
    { id_insumo: 7, nombre: "Salchichas de res", unidad: "piezas", stock_actual: 60.0, stock_minimo: 15.0 }
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

function descontarInsumosDemo(combo, cantidad) {
  const c = combo.toLowerCase();
  const restar = (id, cant) => {
    const ins = db.insumos.find(i => i.id_insumo === id);
    if (ins) ins.stock_actual = Math.max(0, Math.round((ins.stock_actual - cant * cantidad) * 100) / 100);
  };
  if (c.includes('pareja') || c.includes('vip') || c.includes('familiar') || c.includes('individual')) {
    restar(1, 0.4);
    restar(2, 1.2);
    restar(3, 2);
  } else if (c.includes('nachos')) {
    restar(4, 0.35);
    restar(5, 1);
  } else if (c.includes('hot dog')) {
    restar(6, 1);
    restar(7, 1);
  } else {
    restar(3, 1);
  }
}

export default async (req, context) => {
  const url = new URL(req.url);
  const path = decodeURIComponent(url.pathname)
    .replace(/^\/\.netlify\/functions\/api\/?/, '')
    .replace(/^\/api\/?/, '');
  const method = req.method;
  const { usuario, autenticado } = usuarioActual(req);

  if (method === 'POST' && path === 'auth/login') {
    const data = await req.json().catch(() => ({}));
    const username = (data.username || '').trim().toLowerCase();
    const password = data.password || '';
    if (!username || !password) {
      return Response.json({ status: 'error', mensaje: 'Ingresa usuario y contraseña' }, { status: 400 });
    }
    const found = USUARIOS_DEMO.find(u => u.username === username);
    if (!found || found.passwordHash !== hashPassword(password)) {
      return Response.json({ status: 'error', mensaje: 'Usuario o contraseña incorrectos' }, { status: 401 });
    }
    const userPayload = { username: found.username, nombre: found.nombre, rol: found.rol };
    return Response.json({
      status: 'ok',
      mensaje: `Bienvenido, ${found.nombre}`,
      token: firmarToken(userPayload),
      usuario: userPayload
    });
  }

  if (method === 'GET' && path === 'auth/me') {
    return Response.json({
      status: 'ok',
      autenticado,
      usuario,
      motor: 'Netlify Serverless (Espejo 14 tablas)',
      total_tablas: 14
    });
  }

  if (method === 'GET' && path === 'cartelera') {
    return Response.json({
      status: 'ok',
      fechas: db.fechas,
      peliculas: db.peliculas,
      asientos_ocupados: db.asientos_ocupados
    });
  }

  if (method === 'GET' && path === 'boletos') {
    if (usuario.rol === 'staff' || usuario.rol === 'gerente') {
      return Response.json({ status: 'ok', boletos: db.boletos, alcance: usuario.rol });
    }
    const foliosRaw = (url.searchParams.get('folios') || '').trim();
    const folioUnico = (url.searchParams.get('folio') || '').trim();
    const lista = foliosRaw.split(',').map(s => s.trim()).filter(Boolean);
    if (folioUnico && !lista.includes(folioUnico)) lista.push(folioUnico);
    const filtrados = lista.length ? db.boletos.filter(b => lista.includes(b.folio)) : [];
    return Response.json({ status: 'ok', boletos: filtrados, alcance: 'cliente' });
  }

  if (method === 'POST' && path === 'boletos/reservar') {
    const data = await req.json().catch(() => ({}));
    const peliId = parseInt(data.pelicula_id || 1, 10);
    let funcionId = (data.funcion_id || '').trim();
    const fecha = (data.fecha || '2026-11-04').trim();
    const horario = (data.horario || '').trim();
    const cliente = (data.cliente || '').trim() || 'Cliente Mostrador';
    const asientosRaw = (data.asientos || '').trim();

    const listaNuevos = asientosRaw.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
    if (!listaNuevos.length) {
      return Response.json({ status: 'error', mensaje: 'Selecciona al menos un asiento' }, { status: 400 });
    }

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

    const setOcupados = new Set(db.asientos_ocupados[funcionId] || []);
    for (const a of listaNuevos) {
      if (setOcupados.has(a)) {
        return Response.json({ status: 'error', mensaje: `El asiento ${a} ya está ocupado en esta función` }, { status: 409 });
      }
    }
    listaNuevos.forEach(a => setOcupados.add(a));
    db.asientos_ocupados[funcionId] = Array.from(setOcupados).sort();

    const cantidad = listaNuevos.length;
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
      asientos: listaNuevos.join(', '),
      total,
      estado: 'Pagado',
      hora: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    };

    db.boletos.unshift(nuevoBoleto);

    return Response.json({
      status: 'ok',
      mensaje: `Boleto guardado con folio ${folio}`,
      boleto: nuevoBoleto,
      asientos_ocupados_funcion: db.asientos_ocupados[funcionId]
    }, { status: 201 });
  }

  if (method === 'DELETE' && path.startsWith('boletos/')) {
    const folio = path.slice('boletos/'.length);
    const bol = db.boletos.find(b => b.folio === folio);
    if (!bol) {
      return Response.json({ status: 'error', mensaje: `No existe el folio ${folio}` }, { status: 404 });
    }
    bol.estado = 'Cancelado';
    if (bol.funcion_id && db.asientos_ocupados[bol.funcion_id]) {
      const liberar = new Set(bol.asientos.split(',').map(s => s.trim()));
      db.asientos_ocupados[bol.funcion_id] = db.asientos_ocupados[bol.funcion_id].filter(a => !liberar.has(a));
    }
    bol.asientos = 'Cancelado';
    return Response.json({ status: 'ok', mensaje: `Boleto ${folio} cancelado y asientos liberados en la sala` });
  }

  if (method === 'GET' && path === 'dulceria') {
    if (usuario.rol === 'staff' || usuario.rol === 'gerente') {
      return Response.json({ status: 'ok', ordenes: db.dulceria, alcance: usuario.rol });
    }
    const foliosRaw = (url.searchParams.get('folios') || '').trim();
    const lista = foliosRaw.split(',').map(s => s.trim()).filter(Boolean);
    const filtradas = lista.length ? db.dulceria.filter(o => lista.includes(o.folio)) : [];
    return Response.json({ status: 'ok', ordenes: filtradas, alcance: 'cliente' });
  }

  if (method === 'POST' && path === 'dulceria/ordenar') {
    const data = await req.json().catch(() => ({}));
    const cliente = (data.cliente || '').trim() || 'Cliente Dulcería';
    const combo = data.combo || 'Combo Pareja (Palomitas + 2 Refrescos)';
    const cantidad = Math.max(1, parseInt(data.cantidad || 1, 10));
    const precioUnitario = parseFloat(data.precio_unitario) || obtenerPrecioDulceria(combo);
    const total = cantidad * precioUnitario;
    const folio = `CR-DL-${db.dulceria.length + 1001}`;
    const imagen = data.imagen || obtenerImagenDulceria(combo);

    descontarInsumosDemo(combo, cantidad);

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

  if (method === 'PUT' && path.startsWith('dulceria/') && path.endsWith('/estado')) {
    if (usuario.rol !== 'staff' && usuario.rol !== 'gerente') {
      return Response.json({ status: 'error', mensaje: 'Acceso restringido a personal o gerencia' }, { status: 403 });
    }
    const folio = path.slice('dulceria/'.length, -'/estado'.length);
    const ord = db.dulceria.find(o => o.folio === folio);
    if (!ord) return Response.json({ status: 'error', mensaje: `Orden ${folio} no encontrada` }, { status: 404 });
    const data = await req.json().catch(() => ({}));
    const sig = {
      'En preparación': 'Listo para entrega',
      Lista: 'Entregada',
      'Listo para entrega': 'Entregada',
      Entregada: 'En preparación'
    };
    ord.estado = data.estado || sig[ord.estado] || 'Listo para entrega';
    return Response.json({ status: 'ok', mensaje: `Orden ${folio} actualizada a '${ord.estado}'`, estado: ord.estado });
  }

  if (method === 'DELETE' && path.startsWith('dulceria/')) {
    if (usuario.rol !== 'staff' && usuario.rol !== 'gerente') {
      return Response.json({ status: 'error', mensaje: 'Acceso restringido a personal o gerencia' }, { status: 403 });
    }
    const folio = path.slice('dulceria/'.length);
    const idx = db.dulceria.findIndex(o => o.folio === folio);
    if (idx === -1) return Response.json({ status: 'error', mensaje: `Orden ${folio} no encontrada` }, { status: 404 });
    db.dulceria.splice(idx, 1);
    return Response.json({ status: 'ok', mensaje: `Orden ${folio} eliminada` });
  }

  if (method === 'GET' && path === 'incidencias') {
    if (usuario.rol === 'staff' || usuario.rol === 'gerente') {
      return Response.json({ status: 'ok', incidencias: db.incidencias, alcance: usuario.rol });
    }
    const foliosRaw = (url.searchParams.get('folios') || '').trim();
    const lista = foliosRaw.split(',').map(s => s.trim()).filter(Boolean);
    const filtradas = lista.length ? db.incidencias.filter(i => lista.includes(i.folio)) : [];
    return Response.json({ status: 'ok', incidencias: filtradas, alcance: 'cliente' });
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
    const folio = `CR-INC-${db.incidencias.length + 501}`;

    const nuevaIncidencia = {
      id: folio,
      folio,
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
      mensaje: `Reporte ${folio} registrado y enviado a mantenimiento`,
      incidencia: nuevaIncidencia
    }, { status: 201 });
  }

  if (method === 'PUT' && path.startsWith('incidencias/') && path.endsWith('/estado')) {
    if (usuario.rol !== 'staff' && usuario.rol !== 'gerente') {
      return Response.json({ status: 'error', mensaje: 'Acceso restringido a personal o gerencia' }, { status: 403 });
    }
    const folio = path.slice('incidencias/'.length, -'/estado'.length);
    const inc = db.incidencias.find(i => i.id === folio || i.folio === folio);
    if (!inc) return Response.json({ status: 'error', mensaje: `Reporte ${folio} no encontrado` }, { status: 404 });
    const data = await req.json().catch(() => ({}));
    const sig = {
      Pendiente: 'En proceso',
      'En proceso': 'Resuelto',
      Resuelto: 'Pendiente'
    };
    inc.estado = data.estado || sig[inc.estado] || 'Resuelto';
    return Response.json({ status: 'ok', mensaje: `Incidencia ${folio} actualizada a '${inc.estado}'`, estado: inc.estado });
  }

  if (method === 'DELETE' && path.startsWith('incidencias/')) {
    if (usuario.rol !== 'staff' && usuario.rol !== 'gerente') {
      return Response.json({ status: 'error', mensaje: 'Acceso restringido a personal o gerencia' }, { status: 403 });
    }
    const folio = path.slice('incidencias/'.length);
    const idx = db.incidencias.findIndex(i => i.id === folio || i.folio === folio);
    if (idx === -1) return Response.json({ status: 'error', mensaje: `Reporte ${folio} no encontrado` }, { status: 404 });
    db.incidencias.splice(idx, 1);
    return Response.json({ status: 'ok', mensaje: `Reporte ${folio} eliminado` });
  }

  if (method === 'GET' && path === 'dashboard') {
    if (usuario.rol !== 'gerente') {
      return Response.json({ status: 'error', mensaje: 'Panel Gerencial exclusivo para cuenta de Gerente' }, { status: 403 });
    }
    const boletosPagados = db.boletos.filter(b => b.estado !== 'Cancelado');
    const ingTaq = boletosPagados.reduce((acc, b) => acc + Number(b.total || 0), 0);
    const ingDul = db.dulceria.reduce((acc, o) => acc + Number(o.total || 0), 0);
    const butacasVend = boletosPagados.reduce((acc, b) => acc + Number(b.cantidad || 0), 0);
    const incPend = db.incidencias.filter(i => i.estado !== 'Resuelto').length;
    const incRes = db.incidencias.filter(i => i.estado === 'Resuelto').length;

    const conteoTablas = [
      { tabla: 'salas', registros: 9 },
      { tabla: 'asientos', registros: 360 },
      { tabla: 'peliculas', registros: db.peliculas.length },
      { tabla: 'funciones', registros: db.peliculas.length * 24 },
      { tabla: 'clientes', registros: 6 },
      { tabla: 'boletos', registros: db.boletos.length },
      { tabla: 'boleto_asiento', registros: butacasVend },
      { tabla: 'productos', registros: 12 },
      { tabla: 'insumos', registros: db.insumos.length },
      { tabla: 'producto_insumo', registros: 28 },
      { tabla: 'ordenes_dulceria', registros: db.dulceria.length },
      { tabla: 'orden_detalle', registros: db.dulceria.length },
      { tabla: 'incidencias', registros: db.incidencias.length },
      { tabla: 'usuarios', registros: USUARIOS_DEMO.length }
    ];

    const ocupacion = db.peliculas.slice(0, 6).map((p, idx) => {
      const fn = p.funciones[0];
      const vend = (db.asientos_ocupados[fn.id_funcion] || []).length;
      return {
        id_funcion: idx + 1,
        pelicula: p.titulo,
        sala: fn.sala,
        fecha: fn.fecha,
        hora: fn.hora,
        aforo: 40,
        asientos_vendidos: vend,
        porcentaje_ocupacion: Math.round((vend * 1000) / 40) / 10
      };
    });

    return Response.json({
      status: 'ok',
      motor: 'Netlify Serverless (Espejo 14 tablas)',
      archivo: 'database/cine_regina.db',
      foreign_keys: true,
      integridad: 'ok',
      kpis: {
        ingresos_taquilla: ingTaq,
        ingresos_dulceria: ingDul,
        ingresos_totales: ingTaq + ingDul,
        boletos_activos: boletosPagados.length,
        butacas_vendidas: butacasVend,
        ordenes_activas: db.dulceria.length,
        incidencias_pendientes: incPend,
        incidencias_resueltas: incRes
      },
      conteo_tablas: conteoTablas,
      ocupacion_funciones: ocupacion,
      insumos: db.insumos
    });
  }

  if (method === 'POST' && path === 'insumos/resurtir') {
    if (usuario.rol !== 'gerente') {
      return Response.json({ status: 'error', mensaje: 'Solo Gerencia puede resurtir inventario en bodega' }, { status: 403 });
    }
    const data = await req.json().catch(() => ({}));
    const idInsumo = data.id_insumo;
    const cantidad = Number(data.cantidad || 20);
    if (!idInsumo || idInsumo === 'all') {
      db.insumos.forEach(i => { i.stock_actual = Math.round((i.stock_actual + cantidad) * 100) / 100; });
    } else {
      const ins = db.insumos.find(i => i.id_insumo === Number(idInsumo));
      if (ins) ins.stock_actual = Math.round((ins.stock_actual + cantidad) * 100) / 100;
    }
    return Response.json({
      status: 'ok',
      mensaje: `Inventario actualizado (+${cantidad} unidades)`,
      insumos: db.insumos
    });
  }

  return Response.json({ status: 'error', mensaje: 'Ruta no encontrada' }, { status: 404 });
};

export const config = {
  path: "/api/*"
};
