/**
 * Controlador para la Gestión de Zonas Francas (modulos/admin/admin-zonas-francas.js)
 * Satisface RF-01, selección por Provincia/Cantón y mapa interactivo con actualización en tiempo real al seleccionar Cantón.
 */
import { renderNavbar } from '../../components/navbar.js';
import { obtenerZonasFrancas, registrarZonaFranca } from './admin.service.js';
import { PROVINCIAS_CANTONES_CR, obtenerCoordenadasCanton } from '../../shared/costa-rica-geo.js';
import { mostrarToast } from '../../components/toast.js';

let mapaInteractivo = null;
let marcadorInteractivo = null;

document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('#app-shell');

  // Inicializar combos de Provincia y Cantón
  inicializarCombosGeo();

  // Cargar lista de zonas francas
  await cargarZonasFrancas();

  // Inicializar mapa interactivo
  inicializarMapaInteractivo();

  // Escuchar cambios en provincia y cantón
  const selectProvincia = document.getElementById('zf-provincia');
  const selectCanton = document.getElementById('zf-canton');

  selectProvincia.addEventListener('change', (e) => {
    poblarCantones(e.target.value);
    actualizarUbicacionPorGeo();
  });

  selectCanton.addEventListener('change', () => {
    actualizarUbicacionPorGeo();
  });

  // Escuchar edición manual de inputs lat / lng
  document.getElementById('zf-lat').addEventListener('change', actualizarMarcadorDesdeInputs);
  document.getElementById('zf-lng').addEventListener('change', actualizarMarcadorDesdeInputs);

  // Manejo del formulario de creación
  const form = document.getElementById('form-nueva-zf');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
      nombre: document.getElementById('zf-nombre').value.trim(),
      provincia: document.getElementById('zf-provincia').value,
      canton: document.getElementById('zf-canton').value,
      direccion: document.getElementById('zf-direccion').value.trim(),
      lat: document.getElementById('zf-lat').value,
      lng: document.getElementById('zf-lng').value,
      inversionMinima: document.getElementById('zf-inversion').value,
      empleosMinimos: document.getElementById('zf-empleos').value,
      sectoresPermitidos: document.getElementById('zf-sectores').value
    };

    try {
      const creada = await registrarZonaFranca(datos);
      mostrarToast(`¡Zona Franca "${creada.nombre}" en ${datos.canton}, ${datos.provincia} guardada con éxito!`, 'success');
      form.reset();
      inicializarCombosGeo();
      await cargarZonasFrancas();
    } catch (err) {
      mostrarToast(`Error registrando Zona Franca: ${err.message}`, 'error');
    }
  });
});

function inicializarCombosGeo() {
  const selectProvincia = document.getElementById('zf-provincia');
  selectProvincia.innerHTML = '';

  Object.keys(PROVINCIAS_CANTONES_CR).forEach(prov => {
    const opt = document.createElement('option');
    opt.value = prov;
    opt.textContent = prov;
    selectProvincia.appendChild(opt);
  });

  selectProvincia.value = 'Alajuela';
  poblarCantones('Alajuela');
}

function poblarCantones(provincia) {
  const selectCanton = document.getElementById('zf-canton');
  selectCanton.innerHTML = '';

  const datosProv = PROVINCIAS_CANTONES_CR[provincia] || PROVINCIAS_CANTONES_CR['Alajuela'];
  datosProv.cantones.forEach(cant => {
    const opt = document.createElement('option');
    opt.value = cant;
    opt.textContent = cant;
    selectCanton.appendChild(opt);
  });

  selectCanton.value = datosProv.cantones[0];
}

function inicializarMapaInteractivo() {
  const container = document.getElementById('mapa-formulario-container');
  if (!container) return;

  const provincia = document.getElementById('zf-provincia').value || 'Alajuela';
  const canton = document.getElementById('zf-canton').value || 'Alajuela';
  const coords = obtenerCoordenadasCanton(canton, provincia);

  if (window.L) {
    if (mapaInteractivo) {
      mapaInteractivo.remove();
    }

    mapaInteractivo = L.map(container).setView([coords.lat, coords.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap & Google Maps'
    }).addTo(mapaInteractivo);

    marcadorInteractivo = L.marker([coords.lat, coords.lng], { draggable: true }).addTo(mapaInteractivo);
    marcadorInteractivo.bindPopup(`<b>📍 ${canton}, ${provincia}</b><br>Haga clic o arrastre para mover el punto.`).openPopup();

    // Evento Clic en el mapa para seleccionar punto
    mapaInteractivo.on('click', (e) => {
      const lat = Number(e.latlng.lat.toFixed(5));
      const lng = Number(e.latlng.lng.toFixed(5));

      marcadorInteractivo.setLatLng([lat, lng]);
      actualizarInputsCoordenadas(lat, lng);
    });

    // Evento Arrastrar marcador
    marcadorInteractivo.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      const lat = Number(pos.lat.toFixed(5));
      const lng = Number(pos.lng.toFixed(5));
      actualizarInputsCoordenadas(lat, lng);
    });

    actualizarInputsCoordenadas(coords.lat, coords.lng);
  }
}

function actualizarUbicacionPorGeo() {
  const provincia = document.getElementById('zf-provincia').value;
  const canton = document.getElementById('zf-canton').value;
  const coords = obtenerCoordenadasCanton(canton, provincia);

  const latInput = document.getElementById('zf-lat');
  const lngInput = document.getElementById('zf-lng');

  latInput.value = coords.lat;
  lngInput.value = coords.lng;

  if (mapaInteractivo && window.L) {
    mapaInteractivo.setView([coords.lat, coords.lng], 13, { animate: true });
    if (marcadorInteractivo) {
      marcadorInteractivo.setLatLng([coords.lat, coords.lng]);
      marcadorInteractivo.bindPopup(`<b>📍 Cantón: ${canton}, ${provincia}</b>`).openPopup();
    }
  }

  actualizarInputsCoordenadas(coords.lat, coords.lng);
}

function actualizarMarcadorDesdeInputs() {
  const lat = Number(document.getElementById('zf-lat').value);
  const lng = Number(document.getElementById('zf-lng').value);

  if (mapaInteractivo && marcadorInteractivo && !isNaN(lat) && !isNaN(lng)) {
    mapaInteractivo.setView([lat, lng], 13);
    marcadorInteractivo.setLatLng([lat, lng]);
    document.getElementById('badge-punto-mapa').textContent = `🎯 Lat: ${lat}, Lng: ${lng}`;
  }
}

function actualizarInputsCoordenadas(lat, lng) {
  document.getElementById('zf-lat').value = lat;
  document.getElementById('zf-lng').value = lng;
  const badge = document.getElementById('badge-punto-mapa');
  if (badge) {
    badge.textContent = `🎯 Lat: ${lat}, Lng: ${lng}`;
  }
}

async function cargarZonasFrancas() {
  const contenedor = document.getElementById('contenedor-lista-zf');
  try {
    const zonas = await obtenerZonasFrancas();

    if (!zonas || zonas.length === 0) {
      contenedor.innerHTML = '<p style="color: var(--color-texto-secundario);">No hay zonas francas registradas.</p>';
      return;
    }

    const html = zonas.map(z => {
      const invFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(z.inversionMinima);
      const provinciaStr = z.provincia || z.ubicacion || 'Costa Rica';
      const cantonStr = z.canton || '';
      const ubicacionFormateada = cantonStr ? `${cantonStr}, ${provinciaStr}` : provinciaStr;

      return `
        <div class="card" style="margin-bottom: 1.25rem; border: var(--grosor-borde) solid var(--color-borde); transition: transform 0.2s ease;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
            <h4 style="font-size: 1.15rem; color: var(--color-primario); margin:0;">${z.nombre}</h4>
            <span class="badge-estado badge-estado--recomendada">📍 ${ubicacionFormateada}</span>
          </div>

          <div style="font-size: 0.875rem; display: flex; flex-direction: column; gap: 0.35rem; margin-top: 0.75rem; margin-bottom: 1rem;">
            <div>🗺️ <strong>Dirección:</strong> ${z.direccion || ubicacionFormateada}</div>
            <div>💰 <strong>Inversión Mínima:</strong> ${invFormatted}</div>
            <div>👥 <strong>Empleos Mínimos:</strong> ${z.empleosMinimos} puestos directos</div>
            <div>🏭 <strong>Sectores:</strong> ${z.sectoresPermitidos ? (Array.isArray(z.sectoresPermitidos) ? z.sectoresPermitidos.join(', ') : z.sectoresPermitidos) : 'Todos'}</div>
            <div style="margin-top: 0.25rem;">
              <span class="coord-badge">🌐 Lat: ${z.lat || '9.9922'} &bull; Lng: ${z.lng || '-84.2818'}</span>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; border-top: var(--grosor-borde) solid var(--color-borde); padding-top: 0.75rem;">
            <a href="/modulos/admin/admin-zona-detalle.html?id=${z.id}" class="btn btn-primary" style="font-size: 0.85rem; padding: 0.4rem 0.85rem;">
              🔍 Ver Detalle Completo & Mapa &rarr;
            </a>
          </div>
        </div>
      `;
    }).join('');

    contenedor.innerHTML = html;
  } catch (err) {
    contenedor.innerHTML = `<p style="color: var(--estado-rechazada-texto);">Error cargando zonas francas: ${err.message}</p>`;
  }
}
