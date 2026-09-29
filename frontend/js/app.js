// los asientos que ya estan ocupados
let asientosSeleccionados = new Set();
let asientosOcupados = new Set(['A2', 'B3', 'B4', 'C5', 'D6', 'D7']);

document.addEventListener('DOMContentLoaded', () => {
  cargarCartelera();
  cargarBoletos();
  cargarDulceria();
  cargarIncidencias();
  generarMapaAsientos();

  document.getElementById('form-boleto').addEventListener('submit', registrarBoleto);
  document.getElementById('form-dulceria').addEventListener('submit', ordenarDulceria);
  document.getElementById('form-incidencia').addEventListener('submit', reportarIncidencia);

  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab');
  if (tab) {
    verModulo(tab);
  }

  // detecta si estamos en netlify o local
  if (window.location.hostname.includes('netlify')) {
    const statusEl = document.querySelector('.status-box');
    if (statusEl) statusEl.innerHTML = '<strong>Estado:</strong> Cloud Serverless (Netlify) conectado';
  }
});

// genera los cuadritos de los asientos
function generarMapaAsientos() {
  const container = document.getElementById('grid-asientos');
  if (!container) return;
  container.innerHTML = '';
  
  const filas = ['A', 'B', 'C', 'D', 'E'];
  const columnas = 8;
  
  filas.forEach(fila => {
    const filaDiv = document.createElement('div');
    filaDiv.className = 'fila-asientos';
    
    const letraSpan = document.createElement('span');
    letraSpan.className = 'fila-letra';
    letraSpan.textContent = fila;
    filaDiv.appendChild(letraSpan);
    
    for (let c = 1; c <= columnas; c++) {
      const codigo = `${fila}${c}`;
      const butaca = document.createElement('div');
      butaca.className = 'butaca';
      butaca.textContent = c;
      butaca.title = `Asiento ${codigo}`;
      
      if (asientosOcupados.has(codigo)) {
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
        });
      }
      
      filaDiv.appendChild(butaca);
    }
    
    container.appendChild(filaDiv);
  });
}

// cambiar de pestaña en la pantalla
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
}

function mostrarMensaje(texto, tipo = 'exito') {
  const box = document.getElementById('mensaje-box');
  box.textContent = texto;
  box.className = `mensaje ${tipo}`;
  box.classList.remove('hidden');
  setTimeout(() => {
    box.classList.add('hidden');
  }, 4000);
}

async function cargarCartelera() {
  try {
    const res = await fetch('/api/cartelera');
    const data = await res.json();
    const select = document.getElementById('peli-select');
    select.innerHTML = '';
    data.peliculas.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = `${p.titulo} — ${p.horario} (${p.sala}) - $${p.precio}`;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error('Error al cargar cartelera:', err);
  }
}

async function cargarBoletos() {
  try {
    const res = await fetch('/api/boletos');
    const data = await res.json();
    const tbody = document.getElementById('tabla-boletos-body');
    tbody.innerHTML = '';
    data.boletos.forEach(b => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${b.folio}</strong></td>
        <td>${b.cliente}</td>
        <td>${b.pelicula}</td>
        <td>${b.horario} (${b.sala})</td>
        <td>${b.asientos}</td>
        <td>$${b.total.toFixed(2)}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Error al cargar boletos:', err);
  }
}

// mandamos el boleto al backend
async function registrarBoleto(e) {
  e.preventDefault();
  const pelicula_id = document.getElementById('peli-select').value;
  const cliente = document.getElementById('cliente-nombre').value.trim();
  const cantidad = document.getElementById('boletos-cant').value;
  const asientos = document.getElementById('asientos-txt').value.trim();

  try {
    const res = await fetch('/api/boletos/reservar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pelicula_id, cliente, cantidad, asientos })
    });
    const result = await res.json();
    if (res.ok) {
      mostrarMensaje(result.mensaje, 'exito');
      document.getElementById('cliente-nombre').value = '';
      document.getElementById('asientos-txt').value = '';
      document.getElementById('boletos-cant').value = 0;
      asientosSeleccionados.forEach(a => asientosOcupados.add(a));
      asientosSeleccionados.clear();
      generarMapaAsientos();
      cargarBoletos();
    }
  } catch (err) {
    console.error('Error al guardar boleto:', err);
  }
}

async function cargarDulceria() {
  try {
    const res = await fetch('/api/dulceria');
    const data = await res.json();
    const tbody = document.getElementById('tabla-dulceria-body');
    tbody.innerHTML = '';
    data.ordenes.forEach(o => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${o.folio}</strong></td>
        <td>${o.cliente}</td>
        <td>${o.combo}</td>
        <td>${o.cantidad}</td>
        <td>$${o.total.toFixed(2)}</td>
        <td><span style="color: #d97706; font-weight: bold;">${o.estado}</span></td>
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
  const combo = document.getElementById('dulceria-combo').value;
  const cantidad = document.getElementById('dulceria-cant').value;

  try {
    const res = await fetch('/api/dulceria/ordenar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cliente, combo, cantidad })
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

async function cargarIncidencias() {
  try {
    const res = await fetch('/api/incidencias');
    const data = await res.json();
    const tbody = document.getElementById('tabla-incidencias-body');
    tbody.innerHTML = '';
    data.incidencias.forEach(i => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${i.id}</strong></td>
        <td>${i.sala}</td>
        <td>${i.problema}</td>
        <td>${i.prioridad}</td>
        <td><span style="color: ${i.estado === 'Resuelto' ? '#16a34a' : '#dc2626'}; font-weight: bold;">${i.estado}</span></td>
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

  try {
    const res = await fetch('/api/incidencias/reportar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sala, prioridad, problema })
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
