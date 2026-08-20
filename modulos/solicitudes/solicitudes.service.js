/**
 * Capa de Servicios del Módulo de Solicitudes (modulos/solicitudes/solicitudes.service.js)
 */
import { request } from '../../shared/http.js';
import { evaluarConIA } from '../ia/ia.service.js';
import { obtenerSesion } from '../../shared/auth.js';

export async function obtenerZonasFrancas() {
  return await request('/zonasFrancas');
}

export async function obtenerSolicitudes(filtros = {}) {
  let queryParts = [];
  if (filtros.estado) queryParts.push(`estado=${encodeURIComponent(filtros.estado)}`);
  if (filtros.zonaFrancaId) queryParts.push(`zonaFrancaId=${encodeURIComponent(filtros.zonaFrancaId)}`);
  if (filtros.sector) queryParts.push(`sector=${encodeURIComponent(filtros.sector)}`);
  if (filtros.empresaId) queryParts.push(`empresaId=${encodeURIComponent(filtros.empresaId)}`);

  const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  const solicitudes = await request(`/solicitudes${queryString}`);

  // Filtro de búsqueda textual local (por nombre de empresa o ID)
  if (filtros.busqueda && Array.isArray(solicitudes)) {
    const q = filtros.busqueda.toLowerCase();
    return solicitudes.filter(s => 
      s.nombreEmpresa.toLowerCase().includes(q) || 
      s.id.toLowerCase().includes(q) ||
      s.cedulaJuridica.includes(q)
    );
  }

  return solicitudes;
}

export async function obtenerSolicitudPorId(id) {
  return await request(`/solicitudes/${id}`);
}

export async function crearSolicitud(datosFormulario) {
  const zonasFrancas = await obtenerZonasFrancas();
  const zonaSeleccionada = zonasFrancas.find(z => z.id === datosFormulario.zonaFrancaId);

  if (!zonaSeleccionada) {
    throw new Error('La Zona Franca seleccionada no existe.');
  }

  // Invocar evaluación de IA
  const resultadoIA = evaluarConIA(datosFormulario, zonaSeleccionada);

  const sesion = obtenerSesion();
  const idSolicitud = `SOL-2026-${Math.floor(100 + Math.random() * 900)}`;

  const nuevaSolicitud = {
    id: idSolicitud,
    empresaId: sesion.empresaId || 'emp-101',
    nombreEmpresa: datosFormulario.nombreEmpresa,
    cedulaJuridica: datosFormulario.cedulaJuridica,
    sector: datosFormulario.sector,
    zonaFrancaId: datosFormulario.zonaFrancaId,
    nombreZonaFranca: zonaSeleccionada.nombre,
    inversionProyectada: Number(datosFormulario.inversionProyectada),
    empleosProyectados: Number(datosFormulario.empleosProyectados),
    descripcionProyecto: datosFormulario.descripcionProyecto || '',
    fechaEnvio: new Date().toISOString(),
    estado: resultadoIA.clasificacionIA,
    puntajeIA: resultadoIA.puntajeIA,
    clasificacionIA: resultadoIA.clasificacionIA,
    justificacionIA: resultadoIA.justificacionIA,
    adjuntosSimulados: datosFormulario.adjuntosSimulados || ['propuesta_proyecto.pdf'],
    historialTrazabilidad: [
      {
        fecha: new Date().toISOString(),
        usuario: `${datosFormulario.nombreEmpresa} (Empresa)`,
        accion: 'Solicitud enviada',
        detalle: 'Ingreso de solicitud en la plataforma.'
      },
      {
        fecha: new Date().toISOString(),
        usuario: 'Sistema IA (Módulo Transversal)',
        accion: 'Evaluación automatizada de afinidad',
        detalle: `Clasificación '${resultadoIA.clasificacionIA}' asignada con puntaje ${resultadoIA.puntajeIA}/100.`
      }
    ]
  };

  return await request('/solicitudes', {
    method: 'POST',
    body: JSON.stringify(nuevaSolicitud)
  });
}

export async function actualizarEstadoSolicitud(idSolicitud, nuevoEstado, justificacionAnalista = '') {
  const solicitud = await obtenerSolicitudPorId(idSolicitud);
  const sesion = obtenerSesion();

  const eventoHistorial = {
    fecha: new Date().toISOString(),
    usuario: `${sesion.nombre} (${sesion.rol})`,
    accion: `Cambio de estado a: ${nuevoEstado}`,
    detalle: justificacionAnalista || `Modificación manual de clasificación por el analista.`
  };

  const trazabilidadActualizada = [...(solicitud.historialTrazabilidad || []), eventoHistorial];

  return await request(`/solicitudes/${idSolicitud}`, {
    method: 'PATCH',
    body: JSON.stringify({
      estado: nuevoEstado,
      historialTrazabilidad: trazabilidadActualizada
    })
  });
}
