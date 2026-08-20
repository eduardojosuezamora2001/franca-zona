/**
 * Capa de Servicios de Administración (modulos/admin/admin.service.js)
 * Satisface RF-01.
 */
import { request } from '../../shared/http.js';

export async function obtenerZonasFrancas() {
  return await request('/zonasFrancas');
}

export async function registrarZonaFranca(datosZonaFranca) {
  const idGen = `zf-${Math.floor(10 + Math.random() * 90)}`;
  const nuevaZF = {
    id: datosZonaFranca.id || idGen,
    nombre: datosZonaFranca.nombre,
    ubicacion: datosZonaFranca.ubicacion,
    inversionMinima: Number(datosZonaFranca.inversionMinima),
    empleosMinimos: Number(datosZonaFranca.empleosMinimos),
    sectoresPermitidos: Array.isArray(datosZonaFranca.sectoresPermitidos) 
      ? datosZonaFranca.sectoresPermitidos 
      : datosZonaFranca.sectoresPermitidos.split(',').map(s => s.trim())
  };

  return await request('/zonasFrancas', {
    method: 'POST',
    body: JSON.stringify(nuevaZF)
  });
}

export async function actualizarZonaFranca(id, cambios) {
  return await request(`/zonasFrancas/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(cambios)
  });
}
