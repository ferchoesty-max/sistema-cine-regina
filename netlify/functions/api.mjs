// base de datos en memoria para la api
const db = {
  peliculas: [
    { id: 1, titulo: "Dune: Parte Dos", horario: "16:00", sala: "Sala 1 (Láser)", precio: 90.0 },
    { id: 2, titulo: "IntensaMente 2", horario: "17:30", sala: "Sala 2 (VIP)", precio: 120.0 },
    { id: 3, titulo: "Oppenheimer", horario: "19:00", sala: "Sala 3 (Estándar)", precio: 80.0 }
  ],
  boletos: [
    {
      folio: "CR-TK-101",
      cliente: "Luis Mendoza",
      pelicula: "Dune: Parte Dos",
      horario: "16:00",
      sala: "Sala 1 (Láser)",
      cantidad: 2,
      asientos: "C4, C5",
      total: 180.0,
      hora: "15:30"
    }
  ],
  dulceria: [
    {
      folio: "CR-DL-201",
      cliente: "Sofía Martínez",
      combo: "Combo Pareja (Palomitas + 2 Refrescos)",
      cantidad: 1,
      total: 175.0,
      estado: "En preparación"
    }
  ],
  incidencias: [
    {
      id: "INC-01",
      sala: "Sala 3",
      problema: "Aire acondicionado muy frío",
      prioridad: "Alta",
      estado: "Resuelto"
    }
  ]
};

export default async (req, context) => {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/\.netlify\/functions\/api\/?/, '').replace(/^\/api\/?/, '');
  const method = req.method;

  if (method === 'GET' && path === 'cartelera') {
    return Response.json({ status: 'ok', peliculas: db.peliculas });
  }

  if (method === 'GET' && path === 'boletos') {
    return Response.json({ status: 'ok', boletos: db.boletos });
  }

  if (method === 'POST' && path === 'boletos/reservar') {
    const data = await req.json().catch(() => ({}));
    const peliId = parseInt(data.pelicula_id || 1, 10);
    const cliente = (data.cliente || '').trim() || 'Cliente Mostrador';
    const cantidad = parseInt(data.cantidad || 1, 10);
    const asientos = (data.asientos || '').trim() || 'General';

    const pelicula = db.peliculas.find(p => p.id === peliId) || db.peliculas[0];
    const total = cantidad * pelicula.precio;
    const folio = `CR-TK-${db.boletos.length + 101}`;

    const nuevoBoleto = {
      folio,
      cliente,
      pelicula: pelicula.titulo,
      horario: pelicula.horario,
      sala: pelicula.sala,
      cantidad,
      asientos,
      total,
      hora: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    };

    db.boletos.unshift(nuevoBoleto);

    return Response.json({
      status: 'ok',
      mensaje: `Boleto registrado exitosamente con folio ${folio}`,
      boleto: nuevoBoleto
    }, { status: 201 });
  }

  if (method === 'GET' && path === 'dulceria') {
    return Response.json({ status: 'ok', ordenes: db.dulceria });
  }

  if (method === 'POST' && path === 'dulceria/ordenar') {
    const data = await req.json().catch(() => ({}));
    const cliente = (data.cliente || '').trim() || 'Cliente Dulcería';
    const combo = data.combo || 'Combo Clásico';
    const cantidad = parseInt(data.cantidad || 1, 10);
    const precioUnitario = combo.includes('Pareja') ? 175.0 : (combo.includes('Individual') ? 120.0 : 60.0);
    const total = cantidad * precioUnitario;
    const folio = `CR-DL-${db.dulceria.length + 201}`;

    const nuevaOrden = {
      folio,
      cliente,
      combo,
      cantidad,
      total,
      estado: 'En preparación'
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
    const sala = data.sala || 'Sala 1';
    const problema = (data.problema || '').trim();
    const prioridad = data.prioridad || 'Media';

    if (!problema) {
      return Response.json({ status: 'error', mensaje: 'Falta escribir el problema' }, { status: 400 });
    }

    const nuevaIncidencia = {
      id: `INC-0${db.incidencias.length + 1}`,
      sala,
      problema,
      prioridad,
      estado: 'Pendiente'
    };

    db.incidencias.unshift(nuevaIncidencia);

    return Response.json({
      status: 'ok',
      mensaje: 'Reporte registrado y enviado a supervisión',
      incidencia: nuevaIncidencia
    }, { status: 201 });
  }

  return Response.json({ status: 'error', mensaje: 'Ruta no encontrada' }, { status: 404 });
};

export const config = {
  path: "/api/*"
};
