// estado global de cartelera, fechas, funciones individuales y hero dinamico
let catalogoPeliculas = [];
let fechasCarrete = [];
let mapaAsientosPorFuncion = {};

let fechaActiva = '2026-11-04';
let peliculaActivaId = 1;
let funcionActivaId = null;
let asientosSeleccionados = new Set();

let heroIndex = 0;
let heroTimer = null;
let listaBoletosCache = [];
let authToken = sessionStorage.getItem('cine_auth_token') || '';
let usuarioActual = { rol: 'cliente', nombre: 'Cliente / Invitado', username: 'invitado', autenticado: false };
let ultimoFolioConsultado = '';

function cargarFoliosLocales(clave) {
  try {
    const arr = JSON.parse(sessionStorage.getItem(clave) || '[]');
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function guardarFolioLocal(clave, folio) {
  if (!folio) return;
  const actuales = cargarFoliosLocales(clave);
  if (!actuales.includes(folio)) {
    actuales.unshift(folio);
    sessionStorage.setItem(clave, JSON.stringify(actuales.slice(0, 50)));
  }
}

function esOperador() {
  return usuarioActual.rol === 'staff' || usuarioActual.rol === 'gerente';
}

function esGerente() {
  return usuarioActual.rol === 'gerente';
}

function apiFetch(url, opciones = {}) {
  const headers = new Headers(opciones.headers || {});
  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`);
  }
  return fetch(url, { ...opciones, headers });
}

function esc(txt) {
  return String(txt ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// 12 opciones visuales de dulceria con imagenes por link ligero
const CATALOGO_DULCERIA = [
  {
    id: 'd1',
    nombre: 'Combo Pareja Clásico (Palomitas Grandes + 2 Refrescos)',
    tituloCorto: 'Combo Pareja Clásico',
    desc: '1 Palomitas grandes de mantequilla + 2 Refrescos grandes',
    precio: 185.0,
    imagen: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'd2',
    nombre: 'Combo Regina VIP (Palomitas Caramelo + Nachos + 2 Refrescos)',
    tituloCorto: 'Combo Regina VIP',
    desc: 'Palomitas gourmet de caramelo + Nachos con queso + 2 Refrescos',
    precio: 240.0,
    imagen: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'd3',
    nombre: 'Combo Familiar Mega (2 Palomitas Jumbo + 4 Refrescos + 2 Hot Dogs)',
    tituloCorto: 'Combo Familiar Mega',
    desc: '2 Palomitas jumbo + 4 Refrescos grandes + 2 Hot Dogs jumbo',
    precio: 310.0,
    imagen: 'https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'd4',
    nombre: 'Combo Individual (Palomitas Medianas + Refresco)',
    tituloCorto: 'Combo Individual',
    desc: '1 Palomitas medianas recién hechas + 1 Refresco mediano',
    precio: 120.0,
    imagen: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'd5',
    nombre: 'Nachos Especiales con Extra Queso Cheddar y Carne',
    tituloCorto: 'Nachos Especiales VIP',
    desc: 'Totopos crujientes con queso cheddar caliente, carne y jalapeños',
    precio: 85.0,
    imagen: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'd6',
    nombre: 'Hot Dog Tradicional Jumbo con Tocino',
    tituloCorto: 'Hot Dog Jumbo con Tocino',
    desc: 'Salchicha de res envuelta en tocino con pan artesanal caliente',
    precio: 65.0,
    imagen: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'd7',
    nombre: 'Boneless Crispy BBQ / Búfalo con Papas Gajo',
    tituloCorto: 'Boneless con Papas Gajo',
    desc: 'Orden de boneless de pechuga bañados en salsa BBQ o Búfalo',
    precio: 125.0,
    imagen: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'd8',
    nombre: 'Pizza Individual Artesanal de Pepperoni',
    tituloCorto: 'Pizza Artesanal Pepperoni',
    desc: 'Pizza recién horneada con queso mozzarella y pepperoni crujiente',
    precio: 135.0,
    imagen: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'd9',
    nombre: 'Crepa Dulce con Nutella y Fresas Frescas',
    tituloCorto: 'Crepa Nutella con Fresas',
    desc: 'Crepa francesa rellena de avellana, fresas naturales y azúcar glass',
    precio: 95.0,
    imagen: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'd10',
    nombre: 'ICEE Grande Congelado (Cereza / Mora Azul)',
    tituloCorto: 'ICEE Grande Cereza y Mora',
    desc: 'Bebida granizada congelada combinada de cereza roja y mora azul',
    precio: 75.0,
    imagen: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'd11',
    nombre: 'Frappé Gourmet de Oreo y Caramelo',
    tituloCorto: 'Frappé Gourmet Oreo',
    desc: 'Café frappé batido con galleta Oreo, crema batida y caramelo',
    precio: 80.0,
    imagen: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'd12',
    nombre: 'Refresco Grande de Máquina (940 ml)',
    tituloCorto: 'Refresco Grande 940 ml',
    desc: 'Vaso grande de refresco bien frío con hielo al gusto',
    precio: 60.0,
    imagen: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80'
  }
];

// 8 categorias visuales de reporte de sala (todas las salas son Regina VIP)
const CATALOGO_INCIDENCIAS = [
  {
    categoria: 'Proyección',
    titulo: 'Proyección y Pantalla Láser 4K',
    desc: 'Brillo bajo, desenfoque de lente 4K, subtítulos cortados o parpadeo.',
    salaSugerida: 'Sala 1 Regina VIP',
    prioridadSugerida: 'Urgente',
    ejemplo: 'El proyector láser presenta ligero desenfoque en el borde derecho de la pantalla.',
    imagen: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80'
  },
  {
    categoria: 'Audio',
    titulo: 'Audio y Sonido Envolvente',
    desc: 'Bocina con vibración, volumen desbalanceado o eco en canales traseros.',
    salaSugerida: 'Sala 2 Regina VIP',
    prioridadSugerida: 'Alta',
    ejemplo: 'La bocina lateral izquierda vibra durante las escenas con sonidos graves.',
    imagen: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=500&q=80'
  },
  {
    categoria: 'Clima',
    titulo: 'Clima y Aire Acondicionado',
    desc: 'Temperatura demasiado baja o falta de ventilación en filas centrales.',
    salaSugerida: 'Sala 3 Regina VIP',
    prioridadSugerida: 'Media',
    ejemplo: 'El aire acondicionado está enfriando demasiado la zona de las filas D y E.',
    imagen: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=500&q=80'
  },
  {
    categoria: 'Butacas',
    titulo: 'Butacas Reclinables Eléctricas VIP',
    desc: 'Mecanismo eléctrico de reposapiés trabado, mesa giratoria o conector USB.',
    salaSugerida: 'Sala 4 Regina VIP',
    prioridadSugerida: 'Media',
    ejemplo: 'El botón de reclinado eléctrico de la butaca C4 no responde al presionarlo.',
    imagen: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=500&q=80'
  },
  {
    categoria: 'Limpieza',
    titulo: 'Limpieza y Derrames en Sala',
    desc: 'Derrame de bebida o palomitas en pasillo, charola sucia o contenedores.',
    salaSugerida: 'Sala 5 Regina VIP',
    prioridadSugerida: 'Alta',
    ejemplo: 'Se reporta derrame de refresco en el pasillo central junto a la fila B.',
    imagen: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=500&q=80'
  },
  {
    categoria: 'Iluminación',
    titulo: 'Iluminación de Escaleras y Pasillos',
    desc: 'Tira LED de escalón apagada o luces de cortesía encendidas durante función.',
    salaSugerida: 'Sala 6 Regina VIP',
    prioridadSugerida: 'Media',
    ejemplo: 'Las luces guía LED de los escalones de la fila D parpadean intermitentemente.',
    imagen: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=500&q=80'
  },
  {
    categoria: 'Servicio',
    titulo: 'Servicio de Mesero en Asiento VIP',
    desc: 'Botón llamador de mesero sin señal o demora en entrega de alimentos.',
    salaSugerida: 'Sala 1 Regina VIP',
    prioridadSugerida: 'Media',
    ejemplo: 'El botón de llamado a mesero en el asiento B5 no registra alerta en cocina.',
    imagen: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80'
  },
  {
    categoria: 'Accesos',
    titulo: 'Puertas, Lectores QR y Salidas',
    desc: 'Puerta acústica mal cerrada o escáner de boletos digitales lento.',
    salaSugerida: 'Sala 2 Regina VIP',
    prioridadSugerida: 'Baja',
    ejemplo: 'El amortiguador de la puerta principal de acceso cierra con ruido.',
    imagen: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=500&q=80'
  }
];

document.addEventListener('DOMContentLoaded', async () => {
  await verificarSesionInicial();
  aplicarPermisosUI();

  renderizarTarjetasDulceria();
  renderizarTarjetasIncidencias();
  cargarCartelera();
  cargarBoletos();
  cargarDulceria();
  cargarIncidencias();
  if (esGerente()) {
    cargarDashboard();
  }

  document.getElementById('form-boleto').addEventListener('submit', registrarBoleto);
  document.getElementById('form-dulceria').addEventListener('submit', ordenarDulceria);
  document.getElementById('form-incidencia').addEventListener('submit', reportarIncidencia);
  const formLogin = document.getElementById('form-login');
  if (formLogin) {
    formLogin.addEventListener('submit', iniciarSesionTrabajador);
  }

  const selectPeli = document.getElementById('peli-select');
  if (selectPeli) {
    selectPeli.addEventListener('change', (e) => {
      const nuevoId = parseInt(e.target.value, 10);
      cambiarPeliculaEnSala(nuevoId);
    });
  }

  const selectCombo = document.getElementById('dulceria-combo');
  const inputCantDulceria = document.getElementById('dulceria-cant');
  if (selectCombo) selectCombo.addEventListener('change', actualizarPreviewDulceria);
  if (inputCantDulceria) inputCantDulceria.addEventListener('input', actualizarPreviewDulceria);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      cerrarTrailer();
      cerrarModalBoleto();
      cerrarModalAcceso();
    }
  });

  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab');
  if (tab) {
    verModulo(tab === 'bd' && !esGerente() ? 'taquilla' : tab);
  }

  if (params.get('acceso') === '1' || !sessionStorage.getItem('cine_rol_elegido')) {
    abrirModalAcceso();
  }
});

// =========================================================================
// HERO BANNER DINÁMICO (CARRUSEL AUTOMÁTICO ENTRE PELÍCULAS)
// =========================================================================
function iniciarCarruselHero() {
  if (!catalogoPeliculas.length) return;
  renderizarDotsHero();
  mostrarSlideHero(0);

  if (heroTimer) clearInterval(heroTimer);
  heroTimer = setInterval(() => {
    cambiarSlideHero(1, false);
  }, 5500);
}

function renderizarDotsHero() {
  const dotsBox = document.getElementById('hero-dots');
  if (!dotsBox) return;
  dotsBox.innerHTML = '';

  catalogoPeliculas.forEach((p, idx) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = `hero-dot ${idx === heroIndex ? 'active' : ''}`;
    dot.title = p.titulo;
    dot.addEventListener('click', () => {
      mostrarSlideHero(idx);
      reiniciarTemporizadorHero();
    });
    dotsBox.appendChild(dot);
  });
}

function cambiarSlideHero(direccion, manual = true) {
  if (!catalogoPeliculas.length) return;
  heroIndex = (heroIndex + direccion + catalogoPeliculas.length) % catalogoPeliculas.length;
  mostrarSlideHero(heroIndex);
  if (manual) reiniciarTemporizadorHero();
}

function reiniciarTemporizadorHero() {
  if (heroTimer) clearInterval(heroTimer);
  heroTimer = setInterval(() => {
    cambiarSlideHero(1, false);
  }, 5500);
}

function mostrarSlideHero(idx) {
  heroIndex = idx;
  const peli = catalogoPeliculas[idx];
  if (!peli) return;

  const bgLayer = document.getElementById('hero-bg-layer');
  const titleEl = document.getElementById('hero-title');
  const synEl = document.getElementById('hero-synopsis');
  const fmtBadge = document.getElementById('hero-formato-badge');
  const clasifBadge = document.getElementById('hero-clasif-badge');
  const posterImg = document.getElementById('hero-poster-img');
  const btnComprar = document.getElementById('hero-btn-comprar');
  const btnTrailer = document.getElementById('hero-btn-trailer');

  if (bgLayer && peli.backdrop) {
    bgLayer.style.backgroundImage = `url('${peli.backdrop}')`;
  }
  if (titleEl) titleEl.textContent = peli.titulo.toUpperCase();
  if (synEl) synEl.textContent = peli.sinopsis || '';
  if (fmtBadge) fmtBadge.textContent = `${peli.sala.toUpperCase()} · ${peli.formato}`;
  if (clasifBadge) clasifBadge.textContent = `CLASIFICACIÓN ${peli.clasificacion} · ${peli.duracion}`;
  if (posterImg && peli.poster) posterImg.src = peli.poster;

  if (btnComprar) {
    btnComprar.onclick = () => abrirSeleccionAsientos(peli.id);
  }
  if (btnTrailer) {
    btnTrailer.onclick = () => abrirTrailer(peli.titulo, peli.trailer_id, peli.id);
  }

  document.querySelectorAll('.hero-dot').forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });
}

// =========================================================================
// CARGA DE CARTELERA, CARRETE DE FECHAS Y FUNCIONES POR PELÍCULA
// =========================================================================
async function cargarCartelera() {
  try {
    const res = await fetch('/api/cartelera');
    const data = await res.json();
    catalogoPeliculas = data.peliculas || [];
    fechasCarrete = data.fechas || [
      { fecha: '2026-11-04', etiqueta: 'HOY', dia_semana: 'Mié', dia_num: '04 Nov' },
      { fecha: '2026-11-05', etiqueta: 'MAÑANA', dia_semana: 'Jue', dia_num: '05 Nov' },
      { fecha: '2026-11-06', etiqueta: 'VIERNES', dia_semana: 'Vie', dia_num: '06 Nov' },
      { fecha: '2026-11-07', etiqueta: 'SÁBADO', dia_semana: 'Sáb', dia_num: '07 Nov' },
      { fecha: '2026-11-08', etiqueta: 'DOMINGO', dia_semana: 'Dom', dia_num: '08 Nov' }
    ];
    mapaAsientosPorFuncion = data.asientos_ocupados || {};

    if (fechasCarrete.length > 0 && !fechaActiva) {
      fechaActiva = fechasCarrete[0].fecha;
    }

    const select = document.getElementById('peli-select');
    if (select) {
      select.innerHTML = '';
      catalogoPeliculas.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = `${p.titulo} (${p.sala})`;
        select.appendChild(opt);
      });
    }

    renderizarCarreteFechas();
    renderizarGridCartelera();
    iniciarCarruselHero();
  } catch (err) {
    console.error('Error al cargar cartelera:', err);
  }
}

function renderizarCarreteFechas() {
  const reel = document.getElementById('fechas-reel');
  if (!reel) return;
  reel.innerHTML = '';

  fechasCarrete.forEach(f => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `fecha-card-btn ${f.fecha === fechaActiva ? 'active' : ''}`;
    btn.innerHTML = `
      <span class="f-top">${f.etiqueta}</span>
      <span class="f-main">${f.dia_semana} ${f.dia_num}</span>
    `;
    btn.addEventListener('click', () => {
      fechaActiva = f.fecha;
      renderizarCarreteFechas();
      renderizarGridCartelera();
    });
    reel.appendChild(btn);
  });
}

function obtenerFuncionesPorPeliculaYFecha(peli, fechaStr) {
  if (Array.isArray(peli.funciones) && peli.funciones.length > 0) {
    const filtradas = peli.funciones.filter(fn => fn.fecha === fechaStr);
    if (filtradas.length > 0) return filtradas;
    return peli.funciones.slice(0, 4);
  }
  return [
    {
      id_funcion: `F-${peli.id}-${fechaStr}-1630`,
      fecha: fechaStr,
      dia_etiqueta: 'HOY (04 Nov)',
      hora: peli.horario || '16:30',
      sala: peli.sala || 'Sala 1 Regina VIP',
      precio: peli.precio || 145.0,
      formato: peli.formato || 'REGINA VIP'
    }
  ];
}

function renderizarGridCartelera() {
  const grid = document.getElementById('cartelera-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const fallbackPoster = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80';
  const fechaObj = fechasCarrete.find(f => f.fecha === fechaActiva) || { etiqueta: 'HOY', dia_num: '04 Nov' };

  catalogoPeliculas.forEach(p => {
    const card = document.createElement('article');
    card.className = 'movie-card';
    card.id = `movie-card-${p.id}`;

    const clasificacion = p.clasificacion || 'B';
    const formato = p.formato || 'REGINA VIP';
    const duracion = p.duracion || '120 min';
    const genero = p.genero || 'Estreno';
    const posterUrl = p.poster || fallbackPoster;
    const trailerId = p.trailer_id || 'IzynsBv2Dnw';
    const tituloSeguro = p.titulo.replace(/'/g, "\\'");

    const funcionesDia = obtenerFuncionesPorPeliculaYFecha(p, fechaActiva);
    const botonesHorariosHtml = funcionesDia.map(fn => `
      <button type="button" class="btn-horario-chip" onclick="abrirSeleccionAsientos(${p.id}, '${fn.id_funcion}')">
        🕒 ${fn.hora}
      </button>
    `).join('');

    card.innerHTML = `
      <div class="poster-wrap">
        <img src="${posterUrl}" alt="${p.titulo}" loading="lazy" onerror="this.src='${fallbackPoster}'">
        <div class="poster-badges">
          <span class="rating-tag">${clasificacion}</span>
          <span class="format-tag">${formato}</span>
        </div>
        <button type="button" class="btn-play-overlay" onclick="abrirTrailer('${tituloSeguro}', '${trailerId}', ${p.id})">
          ▶ Ver Tráiler en Español
        </button>
      </div>
      <div class="movie-info">
        <div>
          <h3 class="movie-title">${p.titulo}</h3>
          <p class="movie-meta">${genero} · ${duracion}</p>
          <div class="movie-sala-line">
            <span>📍 ${p.sala}</span>
            <strong>$${Number(p.precio).toFixed(0)} MXN</strong>
          </div>
          <span class="horarios-label">Funciones ${fechaObj.etiqueta} (${fechaObj.dia_num}):</span>
          <div class="horarios-chips-grid">
            ${botonesHorariosHtml}
          </div>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// =========================================================================
// PASO 2: SELECCIÓN DE ASIENTOS INDIVIDUAL POR PELÍCULA Y FUNCIÓN
// =========================================================================
function abrirSeleccionAsientos(peliId, funcionIdOpcional = null) {
  verModulo('taquilla');
  peliculaActivaId = Number(peliId);

  const peli = catalogoPeliculas.find(p => p.id === peliculaActivaId) || catalogoPeliculas[0];
  if (!peli) return;

  const funcionesDia = obtenerFuncionesPorPeliculaYFecha(peli, fechaActiva);
  if (funcionIdOpcional) {
    funcionActivaId = funcionIdOpcional;
    const fnEncontrada = (peli.funciones || []).find(f => f.id_funcion === funcionIdOpcional);
    if (fnEncontrada) {
      fechaActiva = fnEncontrada.fecha;
    }
  } else {
    funcionActivaId = funcionesDia[0].id_funcion;
  }

  asientosSeleccionados.clear();
  document.getElementById('asientos-txt').value = '';
  document.getElementById('boletos-cant').value = 0;

  const vistaCartelera = document.getElementById('vista-cartelera');
  const vistaSala = document.getElementById('vista-seleccion-sala');
  const hero = document.getElementById('hero-section');

  if (vistaCartelera) vistaCartelera.classList.add('hidden');
  if (hero) hero.classList.add('hidden');
  if (vistaSala) {
    vistaSala.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  actualizarVistaSalaCompleta();
}

function cambiarPeliculaEnSala(nuevoPeliId) {
  peliculaActivaId = Number(nuevoPeliId);
  const peli = catalogoPeliculas.find(p => p.id === peliculaActivaId) || catalogoPeliculas[0];
  if (!peli) return;

  const funcionesDia = obtenerFuncionesPorPeliculaYFecha(peli, fechaActiva);
  funcionActivaId = funcionesDia[0].id_funcion;
  asientosSeleccionados.clear();
  document.getElementById('asientos-txt').value = '';
  document.getElementById('boletos-cant').value = 0;

  actualizarVistaSalaCompleta();
}

function obtenerFuncionActivaObjeto() {
  const peli = catalogoPeliculas.find(p => p.id === Number(peliculaActivaId)) || catalogoPeliculas[0];
  if (!peli) return null;
  const todas = peli.funciones || [];
  let fn = todas.find(f => f.id_funcion === funcionActivaId);
  if (!fn) {
    const delDia = obtenerFuncionesPorPeliculaYFecha(peli, fechaActiva);
    fn = delDia[0];
    if (fn) funcionActivaId = fn.id_funcion;
  }
  return { peli, fn };
}

function renderizarSwitchersDeSala(peli, fnActiva) {
  const fechasContainer = document.getElementById('sala-fechas-pills');
  const horariosContainer = document.getElementById('sala-horarios-pills');
  if (!fechasContainer || !horariosContainer) return;

  fechasContainer.innerHTML = '';
  fechasCarrete.forEach(f => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `pill-funcion-btn ${f.fecha === fechaActiva ? 'active' : ''}`;
    btn.textContent = `${f.etiqueta} (${f.dia_num})`;
    btn.addEventListener('click', () => {
      fechaActiva = f.fecha;
      const funcionesNuevoDia = obtenerFuncionesPorPeliculaYFecha(peli, fechaActiva);
      funcionActivaId = funcionesNuevoDia[0].id_funcion;
      asientosSeleccionados.clear();
      document.getElementById('asientos-txt').value = '';
      document.getElementById('boletos-cant').value = 0;
      actualizarVistaSalaCompleta();
    });
    fechasContainer.appendChild(btn);
  });

  horariosContainer.innerHTML = '';
  const funcionesDia = obtenerFuncionesPorPeliculaYFecha(peli, fechaActiva);
  funcionesDia.forEach(fn => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `pill-funcion-btn ${fn.id_funcion === funcionActivaId ? 'active' : ''}`;
    btn.textContent = `🕒 ${fn.hora} hrs`;
    btn.addEventListener('click', () => {
      funcionActivaId = fn.id_funcion;
      asientosSeleccionados.clear();
      document.getElementById('asientos-txt').value = '';
      document.getElementById('boletos-cant').value = 0;
      actualizarVistaSalaCompleta();
    });
    horariosContainer.appendChild(btn);
  });
}

function actualizarVistaSalaCompleta() {
  const info = obtenerFuncionActivaObjeto();
  if (!info || !info.peli || !info.fn) return;
  const { peli, fn } = info;

  const select = document.getElementById('peli-select');
  if (select) select.value = String(peli.id);

  const fallbackPoster = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80';
  const subFuncion = document.getElementById('sala-subtitulo-funcion');
  const tituloSala = document.getElementById('sala-titulo-pelicula');
  const pantallaTxt = document.getElementById('texto-pantalla-sala');
  const resPoster = document.getElementById('resumen-peli-poster');
  const resClasif = document.getElementById('resumen-peli-clasif');
  const resNombre = document.getElementById('resumen-peli-nombre');
  const resFuncion = document.getElementById('resumen-peli-funcion');
  const resFecha = document.getElementById('resumen-peli-fecha');

  if (subFuncion) subFuncion.textContent = `${fn.sala.toUpperCase()} · ${fn.dia_etiqueta} · ${fn.hora} HRS`;
  if (tituloSala) tituloSala.textContent = `${peli.titulo}`;
  if (pantallaTxt) pantallaTxt.textContent = `PANTALLA CINE REGINA · ${fn.sala.toUpperCase()} (${fn.hora} HRS)`;
  if (resPoster) resPoster.src = peli.poster || fallbackPoster;
  if (resClasif) resClasif.textContent = `CLASIFICACIÓN ${peli.clasificacion || 'B'}`;
  if (resNombre) resNombre.textContent = peli.titulo;
  if (resFuncion) resFuncion.textContent = `${fn.sala} · ${fn.hora} hrs`;
  if (resFecha) resFecha.textContent = `Fecha: ${fn.dia_etiqueta}`;

  renderizarSwitchersDeSala(peli, fn);
  generarMapaAsientos();
  actualizarPrecioSeleccionado();
}

function generarMapaAsientos() {
  const container = document.getElementById('grid-asientos');
  if (!container) return;
  container.innerHTML = '';

  const listaOcupados = mapaAsientosPorFuncion[funcionActivaId] || ['B3', 'B4'];
  const setOcupadosActual = new Set(listaOcupados);

  const filas = ['A', 'B', 'C', 'D', 'E'];
  const columnas = 8;

  filas.forEach(fila => {
    const filaDiv = document.createElement('div');
    filaDiv.className = 'fila-asientos';

    const letraIzq = document.createElement('span');
    letraIzq.className = 'fila-letra';
    letraIzq.textContent = fila;
    filaDiv.appendChild(letraIzq);

    for (let c = 1; c <= columnas; c++) {
      const codigo = `${fila}${c}`;
      const butaca = document.createElement('div');
      butaca.className = 'butaca';
      if (c === 4) {
        butaca.classList.add('pasillo-der');
      }
      butaca.textContent = `${fila}${c}`;
      butaca.title = `Asiento VIP ${codigo}`;

      if (setOcupadosActual.has(codigo)) {
        butaca.classList.add('ocupado');
      } else {
        if (asientosSeleccionados.has(codigo)) {
          butaca.classList.add('seleccion');
        } else {
          butaca.classList.add('tradicional');
        }

        butaca.addEventListener('click', () => {
          if (asientosSeleccionados.has(codigo)) {
            asientosSeleccionados.delete(codigo);
            butaca.classList.remove('seleccion');
            butaca.classList.add('tradicional');
          } else {
            asientosSeleccionados.add(codigo);
            butaca.classList.remove('tradicional');
            butaca.classList.add('seleccion');
          }

          const arr = Array.from(asientosSeleccionados).sort();
          document.getElementById('asientos-txt').value = arr.join(', ');
          document.getElementById('boletos-cant').value = arr.length;
          actualizarPrecioSeleccionado();
        });
      }

      filaDiv.appendChild(butaca);
    }

    const letraDer = document.createElement('span');
    letraDer.className = 'fila-letra';
    letraDer.textContent = fila;
    filaDiv.appendChild(letraDer);

    container.appendChild(filaDiv);
  });
}

function actualizarPrecioSeleccionado() {
  const info = obtenerFuncionActivaObjeto();
  const precio = info && info.fn ? Number(info.fn.precio) : 145.0;
  const cant = asientosSeleccionados.size;
  const total = cant * precio;

  const badge = document.getElementById('precio-unitario-badge');
  if (badge) badge.textContent = `$${precio.toFixed(2)} MXN`;

  const totalTxt = document.getElementById('total-estimado-txt');
  if (totalTxt) totalTxt.textContent = `$${total.toFixed(2)} MXN`;
}

// =========================================================================
// NAVEGACIÓN ENTRE MÓDULOS Y VISTAS
// =========================================================================
function verModulo(nombre) {
  if (nombre === 'bd' && !esGerente()) {
    mostrarMensaje('El Panel Gerencial y BD solo está disponible para el rol de Gerente.', 'error');
    abrirModalAcceso();
    nombre = 'taquilla';
  }

  const modulos = ['taquilla', 'dulceria', 'incidencias', 'bd'];
  modulos.forEach(m => {
    const el = document.getElementById(`modulo-${m}`);
    if (el) el.classList.add('hidden');
    const btn = document.getElementById(`nav-btn-${m}`);
    if (btn) btn.classList.toggle('active', m === nombre);
  });

  const seleccionado = document.getElementById(`modulo-${nombre}`);
  if (seleccionado) seleccionado.classList.remove('hidden');

  const hero = document.getElementById('hero-section');
  if (hero) {
    const enSala = !document.getElementById('vista-seleccion-sala')?.classList.contains('hidden');
    hero.classList.toggle('hidden', nombre !== 'taquilla' || enSala);
  }

  if (nombre === 'bd' && esGerente()) {
    cargarDashboard();
  }
}

// =========================================================================
// CONTROL DE ACCESO POR ROLES (CLIENTE / STAFF / GERENTE)
// =========================================================================
async function verificarSesionInicial() {
  if (!authToken) {
    usuarioActual = { rol: 'cliente', nombre: 'Cliente / Invitado', username: 'invitado', autenticado: false };
    return;
  }
  try {
    const res = await apiFetch('/api/auth/me');
    const data = await res.json();
    if (res.ok && data.autenticado && data.usuario) {
      usuarioActual = { ...data.usuario, autenticado: true };
      sessionStorage.setItem('cine_rol_elegido', '1');
      return;
    }
  } catch (err) {
    console.error('Error al verificar sesión:', err);
  }
  authToken = '';
  sessionStorage.removeItem('cine_auth_token');
  usuarioActual = { rol: 'cliente', nombre: 'Cliente / Invitado', username: 'invitado', autenticado: false };
}

function aplicarPermisosUI() {
  const pill = document.getElementById('role-badge-pill');
  const btnAcceso = document.getElementById('btn-abrir-acceso');
  const navBd = document.getElementById('nav-btn-bd');
  const thDulcAcc = document.getElementById('th-dulceria-acciones');
  const thIncAcc = document.getElementById('th-incidencias-acciones');

  if (pill) {
    pill.classList.remove('role-cliente', 'role-staff', 'role-gerente');
    if (esGerente()) {
      pill.classList.add('role-gerente');
      pill.textContent = `Gerente: ${usuarioActual.nombre}`;
    } else if (usuarioActual.rol === 'staff') {
      pill.classList.add('role-staff');
      pill.textContent = `Staff: ${usuarioActual.nombre}`;
    } else {
      pill.classList.add('role-cliente');
      pill.textContent = 'Modo: Cliente';
    }
  }

  if (btnAcceso) {
    btnAcceso.textContent = usuarioActual.autenticado ? 'Cambiar Perfil' : 'Acceso Staff / Gerente';
  }
  if (navBd) {
    navBd.classList.toggle('hidden', !esGerente());
  }
  if (thDulcAcc) {
    thDulcAcc.classList.toggle('hidden', !esOperador());
  }
  if (thIncAcc) {
    thIncAcc.classList.toggle('hidden', !esOperador());
  }

  const titBol = document.getElementById('titulo-historial-boletos');
  const subBol = document.getElementById('subtitulo-historial-boletos');
  if (titBol && subBol) {
    titBol.textContent = esOperador() ? 'Boletos Emitidos en SQLite' : 'Mis Boletos Comprados';
    subBol.textContent = esOperador()
      ? 'Historial operativo completo en SQLite para validar o cancelar boletos en taquilla.'
      : 'Consulta tus boletos de esta sesión o busca un folio específico (ej. CR-TK-0001).';
  }

  const titDul = document.getElementById('titulo-tabla-dulceria');
  const subDul = document.getElementById('subtitulo-tabla-dulceria');
  if (titDul && subDul) {
    titDul.textContent = esOperador() ? 'Cola Operativa de Dulcería' : 'Mis Pedidos de Dulcería';
    subDul.textContent = esOperador()
      ? 'Todos los pedidos registrados en base de datos para preparación y entrega.'
      : 'Estado en tiempo real de los combos que solicitaste en esta sesión.';
  }

  const titInc = document.getElementById('titulo-tabla-incidencias');
  const subInc = document.getElementById('subtitulo-tabla-incidencias');
  if (titInc && subInc) {
    titInc.textContent = esOperador() ? 'Bitácora de Soporte Técnico' : 'Mis Reportes en Sala';
    subInc.textContent = esOperador()
      ? 'Incidencias de sala registradas en SQLite para atención técnica.'
      : 'Envía un aviso de sala y revisa el avance de los folios reportados en tu sesión.';
  }

  const sesionFooter = document.getElementById('sesion-activa-footer');
  const sesionTexto = document.getElementById('sesion-activa-texto');
  if (sesionFooter && sesionTexto) {
    sesionFooter.classList.toggle('hidden', !usuarioActual.autenticado);
    if (usuarioActual.autenticado) {
      sesionTexto.textContent = `Sesión activa: ${usuarioActual.nombre} (${usuarioActual.rol.toUpperCase()})`;
    }
  }

  const modBdVisible = !document.getElementById('modulo-bd')?.classList.contains('hidden');
  if (modBdVisible && !esGerente()) {
    verModulo('taquilla');
  }
}

function abrirModalAcceso() {
  const modal = document.getElementById('modal-acceso');
  const errBox = document.getElementById('login-error-box');
  if (errBox) {
    errBox.classList.add('hidden');
    errBox.textContent = '';
  }
  aplicarPermisosUI();
  if (modal) modal.classList.remove('hidden');
}

function cerrarModalAcceso() {
  sessionStorage.setItem('cine_rol_elegido', '1');
  const modal = document.getElementById('modal-acceso');
  if (modal) modal.classList.add('hidden');
}

function cerrarModalAccesoSiFondo(event) {
  if (event.target && event.target.id === 'modal-acceso') {
    cerrarModalAcceso();
  }
}

function rellenarDemoLogin(user, pwd) {
  const u = document.getElementById('login-username');
  const p = document.getElementById('login-password');
  if (u) u.value = user;
  if (p) p.value = pwd;
}

async function entrarComoCliente() {
  authToken = '';
  sessionStorage.removeItem('cine_auth_token');
  sessionStorage.setItem('cine_rol_elegido', '1');
  usuarioActual = { rol: 'cliente', nombre: 'Cliente / Invitado', username: 'invitado', autenticado: false };
  aplicarPermisosUI();
  cerrarModalAcceso();
  await Promise.all([cargarBoletos(), cargarDulceria(), cargarIncidencias()]);
  verModulo('taquilla');
  mostrarMensaje('Vista de Cliente activada: solo ves tus propios folios y la cartelera.', 'exito');
}

async function iniciarSesionTrabajador(e) {
  e.preventDefault();
  const username = (document.getElementById('login-username')?.value || '').trim();
  const password = document.getElementById('login-password')?.value || '';
  const errBox = document.getElementById('login-error-box');

  if (errBox) {
    errBox.classList.add('hidden');
    errBox.textContent = '';
  }

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) {
      if (errBox) {
        errBox.textContent = data.mensaje || 'Usuario o contraseña incorrectos.';
        errBox.classList.remove('hidden');
      }
      return;
    }

    authToken = data.token;
    sessionStorage.setItem('cine_auth_token', authToken);
    sessionStorage.setItem('cine_rol_elegido', '1');
    usuarioActual = { ...data.usuario, autenticado: true };

    const pwdEl = document.getElementById('login-password');
    if (pwdEl) pwdEl.value = '';

    aplicarPermisosUI();
    cerrarModalAcceso();
    await Promise.all([cargarBoletos(), cargarDulceria(), cargarIncidencias()]);
    if (esGerente()) {
      cargarDashboard();
    }
    mostrarMensaje(`Bienvenido ${usuarioActual.nombre} (${usuarioActual.rol}).`, 'exito');
  } catch (err) {
    console.error('Error al iniciar sesión:', err);
    if (errBox) {
      errBox.textContent = 'No se pudo conectar con el servidor de autenticación.';
      errBox.classList.remove('hidden');
    }
  }
}

async function cerrarSesion() {
  await entrarComoCliente();
}

function volverACartelera() {
  const vistaCartelera = document.getElementById('vista-cartelera');
  const vistaSala = document.getElementById('vista-seleccion-sala');
  const hero = document.getElementById('hero-section');

  if (vistaSala) vistaSala.classList.add('hidden');
  if (vistaCartelera) vistaCartelera.classList.remove('hidden');
  if (hero) hero.classList.remove('hidden');
  renderizarCarreteFechas();
  renderizarGridCartelera();
}

function mostrarMensaje(texto, tipo = 'exito') {
  const box = document.getElementById('mensaje-box');
  if (!box) return;
  box.textContent = texto;
  box.className = `mensaje ${tipo}`;
  box.classList.remove('hidden');
  setTimeout(() => {
    box.classList.add('hidden');
  }, 4500);
}

// =========================================================================
// MODAL DE TRÁILER EN ESPAÑOL
// =========================================================================
function abrirTrailer(titulo, trailerId, peliId = 1) {
  const modal = document.getElementById('modal-trailer');
  const iframe = document.getElementById('youtube-iframe');
  const tituloEl = document.getElementById('modal-trailer-titulo');
  const btnComprar = document.getElementById('btn-modal-comprar');

  if (!modal || !iframe) return;

  if (tituloEl) tituloEl.textContent = `${titulo} — Tráiler en Español`;
  iframe.src = `https://www.youtube.com/embed/${trailerId}?autoplay=1&rel=0&hl=es`;

  if (btnComprar) {
    btnComprar.onclick = () => {
      cerrarTrailer();
      abrirSeleccionAsientos(peliId);
    };
  }

  modal.classList.remove('hidden');
}

function cerrarTrailer() {
  const modal = document.getElementById('modal-trailer');
  const iframe = document.getElementById('youtube-iframe');
  if (iframe) iframe.src = '';
  if (modal) modal.classList.add('hidden');
}

function cerrarTrailerSiFondo(e) {
  if (e.target && e.target.id === 'modal-trailer') {
    cerrarTrailer();
  }
}

// =========================================================================
// REGISTRO Y TABLA DE BOLETOS + MODAL DE BOLETO DIGITAL
// =========================================================================
async function cargarBoletos(folioExacto = '') {
  try {
    let url = '/api/boletos';
    if (!esOperador()) {
      const params = new URLSearchParams();
      const folios = cargarFoliosLocales('cine_mis_boletos');
      if (folios.length) params.set('folios', folios.join(','));
      if (folioExacto) params.set('folio', folioExacto);
      url = `/api/boletos?${params.toString()}`;
    }
    const res = await apiFetch(url);
    const data = await res.json();
    listaBoletosCache = data.boletos || [];
    filtrarTablaBoletos();
  } catch (err) {
    console.error('Error al cargar boletos:', err);
  }
}

function filtrarTablaBoletos() {
  const input = document.getElementById('buscar-boleto-input');
  const q = (input ? input.value : '').trim().toLowerCase();
  if (!q) {
    ultimoFolioConsultado = '';
    renderizarTablaBoletos(listaBoletosCache);
    return;
  }

  const folioMayus = q.toUpperCase();
  if (!esOperador() && /^CR-TK-\d{4,}$/.test(folioMayus)) {
    const yaEsta = listaBoletosCache.some(b => (b.folio || '').toUpperCase() === folioMayus);
    if (!yaEsta && ultimoFolioConsultado !== folioMayus) {
      ultimoFolioConsultado = folioMayus;
      cargarBoletos(folioMayus);
      return;
    }
  }

  const filtrados = listaBoletosCache.filter(b =>
    (b.folio || '').toLowerCase().includes(q) ||
    (b.cliente || '').toLowerCase().includes(q) ||
    (b.pelicula || '').toLowerCase().includes(q) ||
    (b.sala || '').toLowerCase().includes(q)
  );
  renderizarTablaBoletos(filtrados);
}

function renderizarTablaBoletos(lista) {
  const tbody = document.getElementById('tabla-boletos-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (!lista.length) {
    const msg = esOperador()
      ? 'No hay boletos que coincidan con la búsqueda.'
      : 'Aún no tienes boletos en esta sesión. Compra uno arriba o escribe tu folio (ej. CR-TK-0001).';
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;color:#94a3b8;">${msg}</td></tr>`;
    return;
  }

  lista.forEach(b => {
    const fechaMostrada = b.fecha ? `${b.fecha} · ` : '';
    const estado = b.estado || 'Pagado';
    const esCancelado = estado === 'Cancelado';
    const pillClass = esCancelado ? 'cancel' : 'ready';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong class="gold-text">${esc(b.folio)}</strong></td>
      <td>${esc(b.cliente)}</td>
      <td><strong>${esc(b.pelicula)}</strong></td>
      <td>${esc(fechaMostrada)}${esc(b.horario)} hrs</td>
      <td><span style="color:#cbd5e1">${esc(b.sala)}</span></td>
      <td><span class="status-pill ${esCancelado ? 'cancel' : 'prep'}">${esc(b.asientos)}</span></td>
      <td><strong>$${Number(b.total).toFixed(2)}</strong></td>
      <td><span class="status-pill ${pillClass}">${esc(estado)}</span></td>
      <td>
        <div class="acciones-celda">
          <button type="button" class="btn-tabla-accion" onclick="verTicketPorFolio('${esc(b.folio)}')">Ticket</button>
          ${esCancelado ? '' : `<button type="button" class="btn-tabla-danger" onclick="cancelarBoleto('${esc(b.folio)}')">Cancelar</button>`}
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function verTicketPorFolio(folio) {
  const b = listaBoletosCache.find(item => item.folio === folio);
  if (b) {
    mostrarModalBoleto(b);
  }
}

async function cancelarBoleto(folio) {
  try {
    const res = await apiFetch(`/api/boletos/${encodeURIComponent(folio)}`, { method: 'DELETE' });
    const result = await res.json();
    if (res.ok) {
      mostrarMensaje(result.mensaje, 'exito');
      const tareas = [cargarBoletos(), cargarCartelera()];
      if (esGerente()) tareas.push(cargarDashboard());
      await Promise.all(tareas);
    } else {
      mostrarMensaje(result.mensaje || 'No se pudo cancelar el boleto', 'error');
    }
  } catch (err) {
    console.error('Error al cancelar boleto:', err);
  }
}

async function registrarBoleto(e) {
  e.preventDefault();
  const info = obtenerFuncionActivaObjeto();
  const pelicula_id = info && info.peli ? info.peli.id : document.getElementById('peli-select').value;
  const funcion_id = funcionActivaId || '';
  const fecha = info && info.fn ? info.fn.fecha : fechaActiva;
  const horario = info && info.fn ? info.fn.hora : '16:30';
  const cliente = document.getElementById('cliente-nombre').value.trim();
  const cantidad = Number(document.getElementById('boletos-cant').value);
  const asientos = document.getElementById('asientos-txt').value.trim();

  if (!cantidad || !asientos) {
    mostrarMensaje('Selecciona al menos un asiento en el mapa de la sala antes de confirmar.', 'error');
    return;
  }

  try {
    const res = await apiFetch('/api/boletos/reservar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pelicula_id,
        funcion_id,
        fecha,
        horario,
        cliente,
        cantidad,
        asientos
      })
    });
    const result = await res.json();
    if (res.ok) {
      mostrarMensaje(result.mensaje, 'exito');
      document.getElementById('cliente-nombre').value = '';
      document.getElementById('asientos-txt').value = '';
      document.getElementById('boletos-cant').value = 0;

      if (result.boleto && result.boleto.folio) {
        guardarFolioLocal('cine_mis_boletos', result.boleto.folio);
      }

      if (result.asientos_ocupados_funcion && funcion_id) {
        mapaAsientosPorFuncion[funcion_id] = result.asientos_ocupados_funcion;
      } else if (funcion_id) {
        const actuales = new Set(mapaAsientosPorFuncion[funcion_id] || []);
        asientosSeleccionados.forEach(a => actuales.add(a));
        mapaAsientosPorFuncion[funcion_id] = Array.from(actuales);
      }

      asientosSeleccionados.clear();
      generarMapaAsientos();
      actualizarPrecioSeleccionado();
      cargarBoletos();
      if (esGerente()) cargarDashboard();

      if (result.boleto) {
        mostrarModalBoleto(result.boleto);
      }
    } else {
      mostrarMensaje(result.mensaje || 'Error al registrar boleto', 'error');
      await cargarCartelera();
      generarMapaAsientos();
    }
  } catch (err) {
    console.error('Error al guardar boleto:', err);
  }
}

function mostrarModalBoleto(boleto) {
  const modal = document.getElementById('modal-boleto');
  if (!modal) return;

  const fechaTexto = boleto.fecha ? ` (${boleto.fecha})` : '';
  document.getElementById('ticket-pelicula').textContent = boleto.pelicula;
  document.getElementById('ticket-folio').textContent = `FOLIO: ${boleto.folio}`;
  document.getElementById('ticket-cliente').textContent = boleto.cliente;
  document.getElementById('ticket-sala').textContent = `${boleto.sala} · ${boleto.horario}${fechaTexto}`;
  document.getElementById('ticket-asientos').textContent = boleto.asientos;
  document.getElementById('ticket-total').textContent = `$${Number(boleto.total).toFixed(2)} MXN`;

  modal.classList.remove('hidden');
}

function cerrarModalBoleto() {
  const modal = document.getElementById('modal-boleto');
  if (modal) modal.classList.add('hidden');
  volverACartelera();
}

function cerrarModalBoletoSiFondo(e) {
  if (e.target && e.target.id === 'modal-boleto') {
    cerrarModalBoleto();
  }
}

// =========================================================================
// MÓDULO 2: DULCERÍA EXPRESS (12 PRODUCTOS CON IMÁGENES EN LINK)
// =========================================================================
function renderizarTarjetasDulceria() {
  const grid = document.getElementById('dulceria-cards-grid');
  const select = document.getElementById('dulceria-combo');
  if (!grid) return;
  grid.innerHTML = '';

  if (select) {
    select.innerHTML = '';
    CATALOGO_DULCERIA.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.nombre;
      opt.dataset.precio = item.precio;
      opt.dataset.img = item.imagen;
      opt.textContent = `${item.tituloCorto} — $${item.precio.toFixed(2)}`;
      select.appendChild(opt);
    });
  }

  CATALOGO_DULCERIA.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = `visual-item-card ${idx === 0 ? 'active-card' : ''}`;
    card.dataset.combo = item.nombre;

    card.innerHTML = `
      <div class="visual-img-box">
        <img src="${item.imagen}" alt="${item.tituloCorto}" loading="lazy">
        <span class="visual-price-tag">$${item.precio.toFixed(0)} MXN</span>
      </div>
      <div class="visual-body">
        <div>
          <h4>${item.tituloCorto}</h4>
          <p>${item.desc}</p>
        </div>
        <span class="visual-select-hint">● Clic para seleccionar</span>
      </div>
    `;

    card.addEventListener('click', () => {
      document.querySelectorAll('#dulceria-cards-grid .visual-item-card').forEach(c => c.classList.remove('active-card'));
      card.classList.add('active-card');

      if (select) {
        select.value = item.nombre;
        actualizarPreviewDulceria();
      }
    });

    grid.appendChild(card);
  });
}

function actualizarPreviewDulceria() {
  const select = document.getElementById('dulceria-combo');
  const cantInput = document.getElementById('dulceria-cant');
  if (!select || !cantInput) return;

  const opt = select.options[select.selectedIndex];
  const precio = Number(opt?.dataset.precio || 185);
  const img = opt?.dataset.img || CATALOGO_DULCERIA[0].imagen;
  const cant = Math.max(1, Number(cantInput.value || 1));
  const subtotal = precio * cant;

  const badge = document.getElementById('dulceria-precio-badge');
  if (badge) badge.textContent = `$${precio.toFixed(2)} MXN c/u`;

  const previewImg = document.getElementById('dulceria-preview-img');
  if (previewImg) previewImg.src = img;

  const subTxt = document.getElementById('dulceria-subtotal-txt');
  if (subTxt) subTxt.textContent = `Total: $${subtotal.toFixed(2)}`;

  document.querySelectorAll('#dulceria-cards-grid .visual-item-card').forEach(c => {
    c.classList.toggle('active-card', c.dataset.combo === select.value);
  });
}

function obtenerImagenPorNombreCombo(nombreCombo) {
  const encontrado = CATALOGO_DULCERIA.find(item => item.nombre === nombreCombo || nombreCombo.includes(item.tituloCorto));
  if (encontrado) return encontrado.imagen;
  return CATALOGO_DULCERIA[0].imagen;
}

async function cargarDulceria() {
  try {
    let url = '/api/dulceria';
    if (!esOperador()) {
      const folios = cargarFoliosLocales('cine_mis_dulceria');
      url = `/api/dulceria?folios=${encodeURIComponent(folios.join(','))}`;
    }
    const res = await apiFetch(url);
    const data = await res.json();
    const tbody = document.getElementById('tabla-dulceria-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    const ordenes = data.ordenes || [];
    if (!ordenes.length) {
      const cols = esOperador() ? 8 : 7;
      const msg = esOperador()
        ? 'No hay pedidos de dulcería registrados.'
        : 'Aún no envías pedidos de dulcería en esta sesión.';
      tbody.innerHTML = `<tr><td colspan="${cols}" style="text-align:center;color:#94a3b8;">${msg}</td></tr>`;
      return;
    }

    ordenes.forEach(o => {
      const imgUrl = o.imagen || obtenerImagenPorNombreCombo(o.combo || '');
      const est = (o.estado || '').toLowerCase();
      const pillClass = (est.includes('list') || est.includes('entreg')) ? 'ready' : 'prep';
      const accionesHtml = esOperador()
        ? `<td>
            <div class="acciones-celda">
              <button type="button" class="btn-tabla-ok" onclick="avanzarEstadoDulceria('${esc(o.folio)}')">Estado</button>
              <button type="button" class="btn-tabla-danger" onclick="eliminarOrdenDulceria('${esc(o.folio)}')">Eliminar</button>
            </div>
          </td>`
        : '';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong class="gold-text">${esc(o.folio)}</strong></td>
        <td><img src="${imgUrl}" alt="Combo" class="table-thumb" loading="lazy"></td>
        <td>${esc(o.cliente)}</td>
        <td>${esc(o.combo)}</td>
        <td><strong>${o.cantidad}</strong></td>
        <td><strong>$${Number(o.total).toFixed(2)}</strong></td>
        <td><span class="status-pill ${pillClass}">${esc(o.estado)}</span></td>
        ${accionesHtml}
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Error al cargar dulcería:', err);
  }
}

async function avanzarEstadoDulceria(folio) {
  try {
    const res = await apiFetch(`/api/dulceria/${encodeURIComponent(folio)}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const result = await res.json();
    if (res.ok) {
      mostrarMensaje(result.mensaje, 'exito');
      cargarDulceria();
      if (esGerente()) cargarDashboard();
    } else {
      mostrarMensaje(result.mensaje || 'Sin permiso para actualizar pedido.', 'error');
    }
  } catch (err) {
    console.error('Error al actualizar orden:', err);
  }
}

async function eliminarOrdenDulceria(folio) {
  try {
    const res = await apiFetch(`/api/dulceria/${encodeURIComponent(folio)}`, { method: 'DELETE' });
    const result = await res.json();
    if (res.ok) {
      mostrarMensaje(result.mensaje, 'exito');
      cargarDulceria();
      if (esGerente()) cargarDashboard();
    } else {
      mostrarMensaje(result.mensaje || 'Sin permiso para eliminar pedido.', 'error');
    }
  } catch (err) {
    console.error('Error al eliminar orden:', err);
  }
}

async function ordenarDulceria(e) {
  e.preventDefault();
  const cliente = document.getElementById('dulceria-cliente').value.trim();
  const select = document.getElementById('dulceria-combo');
  const combo = select.value;
  const cantidad = document.getElementById('dulceria-cant').value;
  const opt = select.options[select.selectedIndex];
  const imagen = opt ? opt.dataset.img : CATALOGO_DULCERIA[0].imagen;
  const precio_unitario = opt ? Number(opt.dataset.precio) : 185.0;

  try {
    const res = await apiFetch('/api/dulceria/ordenar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cliente, combo, cantidad, imagen, precio_unitario })
    });
    const result = await res.json();
    if (res.ok) {
      if (result.orden && result.orden.folio) {
        guardarFolioLocal('cine_mis_dulceria', result.orden.folio);
      }
      mostrarMensaje(result.mensaje, 'exito');
      document.getElementById('dulceria-cliente').value = '';
      cargarDulceria();
      if (esGerente()) cargarDashboard();
    } else {
      mostrarMensaje(result.mensaje || 'Error al enviar pedido', 'error');
    }
  } catch (err) {
    console.error('Error al enviar pedido:', err);
  }
}

// =========================================================================
// MÓDULO 3: REPORTE DE INCIDENCIAS EN SALA (8 CATEGORÍAS VISUALES)
// =========================================================================
function renderizarTarjetasIncidencias() {
  const grid = document.getElementById('incidencias-cards-grid');
  if (!grid) return;
  grid.innerHTML = '';

  CATALOGO_INCIDENCIAS.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = `visual-item-card ${idx === 0 ? 'active-card' : ''}`;

    card.innerHTML = `
      <div class="visual-img-box">
        <img src="${item.imagen}" alt="${item.titulo}" loading="lazy">
        <span class="visual-price-tag">${item.categoria}</span>
      </div>
      <div class="visual-body">
        <div>
          <h4>${item.titulo}</h4>
          <p>${item.desc}</p>
        </div>
        <span class="visual-select-hint">● Seleccionar categoría</span>
      </div>
    `;

    card.addEventListener('click', () => {
      document.querySelectorAll('#incidencias-cards-grid .visual-item-card').forEach(c => c.classList.remove('active-card'));
      card.classList.add('active-card');

      document.getElementById('inc-categoria').value = item.categoria;
      document.getElementById('inc-imagen').value = item.imagen;
      document.getElementById('inc-sala').value = item.salaSugerida;
      document.getElementById('inc-prioridad').value = item.prioridadSugerida;

      const probInput = document.getElementById('inc-problema');
      if (probInput) {
        probInput.value = item.ejemplo;
      }

      const badge = document.getElementById('inc-categoria-badge');
      if (badge) badge.textContent = `Área: ${item.categoria}`;

      const prevImg = document.getElementById('inc-preview-img');
      if (prevImg) prevImg.src = item.imagen;

      const prevLbl = document.getElementById('inc-preview-label');
      if (prevLbl) prevLbl.textContent = item.titulo;
    });

    grid.appendChild(card);
  });
}

function obtenerImagenIncidenciaLocal(item) {
  if (item.imagen) return item.imagen;
  const encontrada = CATALOGO_INCIDENCIAS.find(c => c.categoria.toLowerCase() === (item.categoria || '').toLowerCase());
  if (encontrada) return encontrada.imagen;
  return CATALOGO_INCIDENCIAS[0].imagen;
}

async function cargarIncidencias() {
  try {
    let url = '/api/incidencias';
    if (!esOperador()) {
      const folios = cargarFoliosLocales('cine_mis_incidencias');
      url = `/api/incidencias?folios=${encodeURIComponent(folios.join(','))}`;
    }
    const res = await apiFetch(url);
    const data = await res.json();
    const tbody = document.getElementById('tabla-incidencias-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    const incidencias = data.incidencias || [];
    if (!incidencias.length) {
      const cols = esOperador() ? 7 : 6;
      const msg = esOperador()
        ? 'No hay incidencias registradas.'
        : 'Aún no has enviado reportes de sala en esta sesión.';
      tbody.innerHTML = `<tr><td colspan="${cols}" style="text-align:center;color:#94a3b8;">${msg}</td></tr>`;
      return;
    }

    incidencias.forEach(i => {
      const imgUrl = obtenerImagenIncidenciaLocal(i);
      const est = (i.estado || '').toLowerCase();
      const pillClass = est === 'resuelto' ? 'ready' : (est === 'en proceso' ? 'prep' : 'pending');
      const accionesHtml = esOperador()
        ? `<td>
            <div class="acciones-celda">
              <button type="button" class="btn-tabla-ok" onclick="avanzarEstadoIncidencia('${esc(i.id)}')">Estado</button>
              <button type="button" class="btn-tabla-danger" onclick="eliminarIncidencia('${esc(i.id)}')">Eliminar</button>
            </div>
          </td>`
        : '';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong class="gold-text">${esc(i.id)}</strong></td>
        <td><img src="${imgUrl}" alt="Incidencia" class="table-thumb" loading="lazy"></td>
        <td><strong>${esc(i.sala)}</strong></td>
        <td>${esc(i.problema)}</td>
        <td><span class="badge-outline">${esc(i.prioridad)}</span></td>
        <td><span class="status-pill ${pillClass}">${esc(i.estado)}</span></td>
        ${accionesHtml}
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Error al cargar incidencias:', err);
  }
}

async function avanzarEstadoIncidencia(folio) {
  try {
    const res = await apiFetch(`/api/incidencias/${encodeURIComponent(folio)}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const result = await res.json();
    if (res.ok) {
      mostrarMensaje(result.mensaje, 'exito');
      cargarIncidencias();
      if (esGerente()) cargarDashboard();
    } else {
      mostrarMensaje(result.mensaje || 'Sin permiso para actualizar incidencia.', 'error');
    }
  } catch (err) {
    console.error('Error al actualizar incidencia:', err);
  }
}

async function eliminarIncidencia(folio) {
  try {
    const res = await apiFetch(`/api/incidencias/${encodeURIComponent(folio)}`, { method: 'DELETE' });
    const result = await res.json();
    if (res.ok) {
      mostrarMensaje(result.mensaje, 'exito');
      cargarIncidencias();
      if (esGerente()) cargarDashboard();
    } else {
      mostrarMensaje(result.mensaje || 'Sin permiso para eliminar incidencia.', 'error');
    }
  } catch (err) {
    console.error('Error al eliminar incidencia:', err);
  }
}

async function reportarIncidencia(e) {
  e.preventDefault();
  const sala = document.getElementById('inc-sala').value;
  const prioridad = document.getElementById('inc-prioridad').value;
  const problema = document.getElementById('inc-problema').value.trim();
  const categoria = document.getElementById('inc-categoria').value || 'Proyección';
  const imagen = document.getElementById('inc-imagen').value || CATALOGO_INCIDENCIAS[0].imagen;

  try {
    const res = await apiFetch('/api/incidencias/reportar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sala, prioridad, problema, categoria, imagen })
    });
    const result = await res.json();
    if (res.ok) {
      if (result.incidencia && result.incidencia.id) {
        guardarFolioLocal('cine_mis_incidencias', result.incidencia.id);
      }
      mostrarMensaje(result.mensaje, 'exito');
      document.getElementById('inc-problema').value = '';
      cargarIncidencias();
      if (esGerente()) cargarDashboard();
    } else {
      mostrarMensaje(result.mensaje || 'Error al registrar incidencia', 'error');
    }
  } catch (err) {
    console.error('Error al reportar:', err);
  }
}

// =========================================================================
// MÓDULO 4: PANEL GERENCIAL (MIS / DSS) Y MONITOR SQLITE EN VIVO
// =========================================================================
async function cargarDashboard() {
  if (!esGerente()) return;
  try {
    const res = await apiFetch('/api/dashboard');
    if (!res.ok) return;
    const data = await res.json();
    const kpis = data.kpis || {};

    const pillHeader = document.getElementById('db-live-indicator');
    if (pillHeader) {
      pillHeader.textContent = `● ${data.motor || 'SQLite 3'} · ${(data.conteo_tablas || []).length} Tablas`;
    }

    const elTot = document.getElementById('kpi-ingresos-totales');
    const elDesg = document.getElementById('kpi-ingresos-desglose');
    const elBol = document.getElementById('kpi-boletos-vendidos');
    const elBut = document.getElementById('kpi-butacas-sub');
    const elOrd = document.getElementById('kpi-ordenes-dulceria');
    const elInc = document.getElementById('kpi-incidencias-estado');
    const elIncRes = document.getElementById('kpi-incidencias-resueltas');

    if (elTot) elTot.textContent = `$${Number(kpis.ingresos_totales || 0).toFixed(2)} MXN`;
    if (elDesg) elDesg.textContent = `Taquilla: $${Number(kpis.ingresos_taquilla || 0).toFixed(2)} · Dulcería: $${Number(kpis.ingresos_dulceria || 0).toFixed(2)}`;
    if (elBol) elBol.textContent = `${kpis.boletos_activos || 0} boletos`;
    if (elBut) elBut.textContent = `${kpis.butacas_vendidas || 0} asientos pagados en SQLite`;
    if (elOrd) elOrd.textContent = `${kpis.ordenes_activas || 0} órdenes`;
    if (elInc) elInc.textContent = `${kpis.incidencias_pendientes || 0} pendientes`;
    if (elIncRes) elIncRes.textContent = `${kpis.incidencias_resueltas || 0} resueltas en bitácora`;

    const elRuta = document.getElementById('bd-archivo-ruta');
    const elMotor = document.getElementById('motor-bd-badge');
    const elInt = document.getElementById('integridad-bd-badge');
    if (elRuta) elRuta.textContent = `Archivo: ${data.archivo || 'database/cine_regina.db'}`;
    if (elMotor) elMotor.textContent = data.motor || 'SQLite 3';
    if (elInt) elInt.textContent = `PRAGMA FK: ${data.foreign_keys ? 'ON' : 'OFF'} · Integridad: ${data.integridad || 'ok'}`;

    const gridTablas = document.getElementById('grid-conteo-tablas');
    if (gridTablas) {
      gridTablas.innerHTML = (data.conteo_tablas || []).map(t => `
        <div class="tabla-bd-badge">
          <code>${esc(t.tabla)}</code>
          <strong>${t.registros}</strong>
        </div>
      `).join('');
    }

    const tbodyOcup = document.getElementById('tabla-ocupacion-body');
    if (tbodyOcup) {
      tbodyOcup.innerHTML = (data.ocupacion_funciones || []).map(f => {
        const pct = Number(f.porcentaje_ocupacion || 0);
        let dssLabel = 'Operación normal';
        let dssClass = 'prep';
        if (pct < 15) {
          dssLabel = 'Lanzar promo 2x1';
          dssClass = 'pending';
        } else if (pct >= 50) {
          dssLabel = 'Alta demanda';
          dssClass = 'ready';
        }
        return `
          <tr>
            <td><strong>${esc(f.pelicula)}</strong></td>
            <td>${esc(f.sala)}</td>
            <td>${esc(f.fecha)} · ${esc(f.hora)}</td>
            <td><strong>${f.asientos_vendidos}</strong> / ${f.aforo}</td>
            <td>
              <span>${pct}%</span>
              <div class="ocupacion-bar-wrap">
                <div class="ocupacion-bar-fill" style="width:${Math.min(100, pct)}%"></div>
              </div>
            </td>
            <td><span class="status-pill ${dssClass}">${dssLabel}</span></td>
          </tr>
        `;
      }).join('');
    }

    renderizarTablaInsumos(data.insumos || []);
  } catch (err) {
    console.error('Error al cargar panel gerencial:', err);
  }
}

function renderizarTablaInsumos(insumos) {
  const tbody = document.getElementById('tabla-insumos-body');
  if (!tbody) return;
  tbody.innerHTML = insumos.map(ins => {
    const bajo = Number(ins.stock_actual) <= Number(ins.stock_minimo);
    return `
      <tr>
        <td><strong>${esc(ins.nombre)}</strong></td>
        <td><strong>${Number(ins.stock_actual).toFixed(2)}</strong> ${esc(ins.unidad)}</td>
        <td>${Number(ins.stock_minimo).toFixed(2)} ${esc(ins.unidad)}</td>
        <td><span class="status-pill ${bajo ? 'pending' : 'ready'}">${bajo ? 'Resurtir' : 'Stock OK'}</span></td>
        <td>
          <button type="button" class="btn-tabla-ok" onclick="resurtirInsumo(${ins.id_insumo})">+ Resurtir (+20)</button>
        </td>
      </tr>
    `;
  }).join('');
}

async function resurtirInsumo(idInsumo) {
  try {
    const res = await apiFetch('/api/insumos/resurtir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_insumo: idInsumo, cantidad: 20 })
    });
    const result = await res.json();
    if (res.ok) {
      mostrarMensaje(result.mensaje, 'exito');
      renderizarTablaInsumos(result.insumos || []);
    } else {
      mostrarMensaje(result.mensaje || 'Solo el Gerente puede resurtir inventario.', 'error');
    }
  } catch (err) {
    console.error('Error al resurtir insumo:', err);
  }
}
