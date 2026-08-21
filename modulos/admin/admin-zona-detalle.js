/**
 * Controlador para la Vista Detalle de Zona Franca (modulos/admin/admin-zona-detalle.js)
 */
import { renderNavbar } from '../../components/navbar.js';
import { obtenerZonaFrancaPorId } from './admin.service.js';
import { obtenerSolicitudes } from '../solicitudes/solicitudes.service.js';
import { renderTablaSolicitudes } from '../../components/tabla-datos.js';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('#app-shell');

  const params = new URLSearchParams(window.location.search);
  const idZF = params.get('id') || 'zf-01';

  await cargarDetalleZF(idZF);
});

async function cargarDetalleZF(id) {
  const contenedor = document.getElementById('contenedor-detalle-zf');
  try {
    const zf = await obtenerZonaFrancaPorId(id);
    const solicitudes = await obtenerSolicitudes({ zonaFrancaId: id });

    document.getElementById('lbl-zf-nombre').textContent = zf.nombre;
    const provinciaCanton = zf.canton ? `${zf.canton}, ${zf.provincia}` : (zf.ubicacion || 'Costa Rica');
    document.getElementById('lbl-zf-ubicacion').textContent = `ID: ${zf.id} &bull; Ubicación: ${provinciaCanton}`;
    document.getElementById('badge-zf-provincia').innerHTML = `<span class="badge-estado badge-estado--recomendada" style="font-size:1rem; padding: 0.4rem 0.85rem;"><i class="fa-solid fa-location-dot"></i> ${provinciaCanton}</span>`;

    const invFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(zf.inversionMinima);
    const direccionCompleta = zf.direccion || `${zf.nombre}, ${provinciaCanton}, Costa Rica`;
    const urlGoogleMapsDirecto = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccionCompleta)}`;

    const lat = zf.lat || 9.9922;
    const lng = zf.lng || -84.2818;

    contenedor.innerHTML = `
      <!-- Mapa Completo a Ancho de Pantalla -->
      <div class="card" style="padding: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <h3 style="font-size: 1.15rem; margin: 0; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fa-solid fa-map-location-dot"></i> Ubicación Geográfica en Mapa (Lat: ${lat}, Lng: ${lng})
          </h3>
          <a href="${urlGoogleMapsDirecto}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="font-size: 0.85rem;">
            <i class="fa-solid fa-location-dot"></i> Abrir en Google Maps App <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </div>

        <div class="detail-map-container" id="map-detail-div">
          <!-- Renderizado de mapa interactivo -->
        </div>
      </div>

      <!-- Tarjetas de Parámetros y Requisitos -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
        <div class="card" style="margin:0;">
          <h4 style="font-size: 1rem; color: var(--color-texto-secundario); margin-bottom: 0.5rem;"><i class="fa-solid fa-sack-dollar"></i> Inversión Mínima Requerida</h4>
          <div style="font-size: 1.75rem; font-weight: 800; color: var(--color-primario);">${invFormatted}</div>
          <small style="color: var(--color-texto-secundario);">Monto base para acogerse al régimen de ZF</small>
        </div>

        <div class="card" style="margin:0;">
          <h4 style="font-size: 1rem; color: var(--color-texto-secundario); margin-bottom: 0.5rem;"><i class="fa-solid fa-users"></i> Empleos Mínimos Proyectados</h4>
          <div style="font-size: 1.75rem; font-weight: 800; color: var(--color-primario);">${zf.empleosMinimos} puestos</div>
          <small style="color: var(--color-texto-secundario);">Puestos de trabajo directos requeridos</small>
        </div>

        <div class="card" style="margin:0;">
          <h4 style="font-size: 1rem; color: var(--color-texto-secundario); margin-bottom: 0.5rem;"><i class="fa-solid fa-industry"></i> Sectores Estratégicos Permitidos</h4>
          <div style="font-size: 1.1rem; font-weight: 700; color: #166534;">
            ${Array.isArray(zf.sectoresPermitidos) ? zf.sectoresPermitidos.join(', ') : zf.sectoresPermitidos}
          </div>
          <small style="color: var(--color-texto-secundario);">Sectores industriales elegibles</small>
        </div>
      </div>

      <!-- Empresas y Solicitudes en esta Zona Franca -->
      <div class="card">
        <h3 style="font-size: 1.2rem; margin-bottom: 1rem;"><i class="fa-solid fa-building"></i> Solicitudes de Empresas Registradas en esta Zona Franca</h3>
        ${renderTablaSolicitudes(solicitudes)}
      </div>
    `;

    // Renderizar mapa interactivo
    setTimeout(() => {
      const mapDiv = document.getElementById('map-detail-div');
      if (mapDiv && window.L) {
        const map = L.map(mapDiv).setView([lat, lng], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap & Google Maps'
        }).addTo(map);

        const marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup(`<b><i class="fa-solid fa-location-dot"></i> ${zf.nombre}</b><br>${direccionCompleta}`).openPopup();
      }
    }, 50);

  } catch (err) {
    contenedor.innerHTML = `
      <div class="card" style="text-align: center; color: var(--estado-rechazada-texto);">
        <i class="fa-solid fa-triangle-exclamation"></i> No se encontró la Zona Franca (ID: ${id}): ${err.message}
      </div>
    `;
  }
}
