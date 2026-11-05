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

document.addEventListener('DOMContentLoaded', () => {
  renderizarTarjetasDulceria();
  renderizarTarjetasIncidencias();
  cargarCartelera();
  cargarDulceria();
  cargarIncidencias();

  document.getElementById('form-boleto').addEventListener('submit', registrarBoleto);
  document.getElementById('form-dulceria').addEventListener('submit', ordenarDulceria);
  document.getElementById('form-incidencia').addEventListener('submit', reportarIncidencia);

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
    }
  });

  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab');
  if (tab) {
    verModulo(tab);
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
  const modulos = ['taquilla', 'dulceria', 'incidencias'];
  modulos.forEach(m => {
    const el = document.getElementById(`modulo-${m}`);
    if (el) el.classList.add('hidden');
  });

  const seleccionado = document.getElementById(`modulo-${nombre}`);
  if (seleccionado) seleccionado.classList.remove('hidden');

  const botones = document.querySelectorAll('.nav-btn');
  botones.forEach((btn, idx) => {
    btn.classList.toggle('active', modulos[idx] === nombre);
  });

  const hero = document.getElementById('hero-section');
  if (hero) {
    const enSala = !document.getElementById('vista-seleccion-sala')?.classList.contains('hidden');
    hero.classList.toggle('hidden', nombre !== 'taquilla' || enSala);
  }
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
async function cargarBoletos() {
  try {
    const res = await fetch('/api/boletos');
    const data = await res.json();
    const tbody = document.getElementById('tabla-boletos-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    (data.boletos || []).forEach(b => {
      const fechaMostrada = b.fecha ? `${b.fecha} · ` : '';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong class="gold-text">${b.folio}</strong></td>
        <td>${b.cliente}</td>
        <td><strong>${b.pelicula}</strong></td>
        <td>${fechaMostrada}${b.horario} hrs</td>
        <td><span style="color:#cbd5e1">${b.sala}</span></td>
        <td><span class="status-pill prep">${b.asientos}</span></td>
        <td><strong>$${Number(b.total).toFixed(2)}</strong></td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Error al cargar boletos:', err);
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
    mostrarMensaje('Selecciona al menos un asiento en el mapa de la sala antes de confirmar.', 'exito');
    return;
  }

  try {
    const res = await fetch('/api/boletos/reservar', {
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

      if (result.boleto) {
        mostrarModalBoleto(result.boleto);
      }
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
    const res = await fetch('/api/dulceria');
    const data = await res.json();
    const tbody = document.getElementById('tabla-dulceria-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    (data.ordenes || []).forEach(o => {
      const imgUrl = o.imagen || obtenerImagenPorNombreCombo(o.combo || '');
      const pillClass = (o.estado || '').toLowerCase().includes('list') ? 'ready' : 'prep';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong class="gold-text">${o.folio}</strong></td>
        <td><img src="${imgUrl}" alt="Combo" class="table-thumb" loading="lazy"></td>
        <td>${o.cliente}</td>
        <td>${o.combo}</td>
        <td><strong>${o.cantidad}</strong></td>
        <td><strong>$${Number(o.total).toFixed(2)}</strong></td>
        <td><span class="status-pill ${pillClass}">${o.estado}</span></td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Error al cargar dulcería:', err);
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
    const res = await fetch('/api/dulceria/ordenar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cliente, combo, cantidad, imagen, precio_unitario })
    });
    const result = await res.json();
    if (res.ok) {
      mostrarMensaje(result.mensaje, 'exito');
      document.getElementById('dulceria-cliente').value = '';
      cargarDulceria();
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
    const res = await fetch('/api/incidencias');
    const data = await res.json();
    const tbody = document.getElementById('tabla-incidencias-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    (data.incidencias || []).forEach(i => {
      const imgUrl = obtenerImagenIncidenciaLocal(i);
      const esResuelto = i.estado === 'Resuelto';
      const pillClass = esResuelto ? 'ready' : 'pending';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong class="gold-text">${i.id}</strong></td>
        <td><img src="${imgUrl}" alt="Incidencia" class="table-thumb" loading="lazy"></td>
        <td><strong>${i.sala}</strong></td>
        <td>${i.problema}</td>
        <td><span class="badge-outline">${i.prioridad}</span></td>
        <td><span class="status-pill ${pillClass}">${i.estado}</span></td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Error al cargar incidencias:', err);
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
    const res = await fetch('/api/incidencias/reportar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sala, prioridad, problema, categoria, imagen })
    });
    const result = await res.json();
    if (res.ok) {
      mostrarMensaje(result.mensaje, 'exito');
      document.getElementById('inc-problema').value = '';
      cargarIncidencias();
    }
  } catch (err) {
    console.error('Error al reportar:', err);
  }
}
