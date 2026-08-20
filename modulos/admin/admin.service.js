/**
 * Capa de Servicios de Administración (modulos/admin/admin.service.js)
 * Satisface RF-01 e integración con Google Maps.
 */
import { request } from '../../shared/http.js';

export async function obtenerZonasFrancas() {
  return await request('/zonasFrancas');
}

export async function obtenerZonaFrancaPorId(id) {
  const zonas = await obtenerZonasFrancas();
  const zf = zonas.find(z => z.id === id);
  if (!zf) throw new Error(`Zona Franca con ID ${id} no encontrada.`);
  return zf;
}

export async function registrarZonaFranca(datosZonaFranca) {
  const idGen = `zf-${Math.floor(10 + Math.random() * 90)}`;
  const provincia = datosZonaFranca.provincia || 'Alajuela';
  const canton = datosZonaFranca.canton || 'Alajuela';
  const ubicacionStr = `${canton}, ${provincia}`;

  const nuevaZF = {
    id: datosZonaFranca.id || idGen,
    nombre: datosZonaFranca.nombre,
    provincia,
    canton,
    ubicacion: ubicacionStr,
    direccion: datosZonaFranca.direccion || `${datosZonaFranca.nombre}, ${ubicacionStr}, Costa Rica`,
    lat: Number(datosZonaFranca.lat) || 9.9922,
    lng: Number(datosZonaFranca.lng) || -84.2818,
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
