/**
 * Controlador del Dashboard de Solicitudes (modulos/solicitudes/dashboard-solicitudes.js)
 */
import { renderNavbar } from '../../components/navbar.js';
import { obtenerSolicitudes, obtenerZonasFrancas } from './solicitudes.service.js';
import { renderTablaSolicitudes } from '../../components/tabla-datos.js';
import { renderTarjetaSolicitud } from '../../components/tarjeta-solicitud.js';
import { mostrarToast } from '../../components/toast.js';

let modoVista = 'tabla'; // 'tabla' | 'grid'
let solicitudesCache = [];

document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('#app-shell');

  const selectZona = document.getElementById('filtro-zona');
  try {
    const zfs = await obtenerZonasFrancas();
    zfs.forEach(zf => {
      const opt = document.createElement('option');
      opt.value = zf.id;
      opt.textContent = zf.nombre;
      selectZona.appendChild(opt);
    });
  } catch (e) {
    console.warn('Error cargando combo zonas francas', e);
  }

  // Event Listeners para Filtros
  ['filtro-busqueda', 'filtro-estado', 'filtro-zona', 'filtro-sector'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', () => aplicarFiltrosYRenderizar());
    }
  });

  // Event Listeners para Conmutador de Vistas
  const btnTabla = document.getElementById('btn-vista-tabla');
  const btnGrid = document.getElementById('btn-vista-grid');

  btnTabla.addEventListener('click', () => {
    modoVista = 'tabla';
    btnTabla.classList.add('active');
    btnGrid.classList.remove('active');
    renderizarDatos(solicitudesCache);
  });

  btnGrid.addEventListener('click', () => {
    modoVista = 'grid';
    btnGrid.classList.add('active');
    btnTabla.classList.remove('active');
    renderizarDatos(solicitudesCache);
  });

  // Carga inicial
  await cargarDatos();
});

async function cargarDatos() {
  const contenedor = document.getElementById('dashboard-contenedor-datos');
  try {
    const solicitudes = await obtenerSolicitudes();
    solicitudesCache = solicitudes;
    actualizarKPIs(solicitudes);
    aplicarFiltrosYRenderizar();
  } catch (err) {
    contenedor.innerHTML = `
      <div class="card" style="text-align: center; color: var(--estado-rechazada-texto); border-color: var(--estado-rechazada-borde);">
        ⚠️ Error de conexión al cargar solicitudes: ${err.message}
      </div>
    `;
    mostrarToast('Error al conectar con la API de solicitudes', 'error');
  }
}

async function aplicarFiltrosYRenderizar() {
  const busqueda = document.getElementById('filtro-busqueda').value.trim();
  const estado = document.getElementById('filtro-estado').value;
  const zonaFrancaId = document.getElementById('filtro-zona').value;
  const sector = document.getElementById('filtro-sector').value;

  const solicitudesFiltradas = await obtenerSolicitudes({
    busqueda,
    estado,
    zonaFrancaId,
    sector
  });

  renderizarDatos(solicitudesFiltradas);
}

function actualizarKPIs(solicitudes) {
  const total = solicitudes.length;
  const recomendadas = solicitudes.filter(s => s.estado === 'Recomendada').length;
  const revisar = solicitudes.filter(s => s.estado === 'Revisar' || s.estado === 'Pendiente').length;
  const rechazadas = solicitudes.filter(s => s.estado === 'Rechazada').length;

  document.getElementById('kpi-total').textContent = total;
  document.getElementById('kpi-recomendadas').textContent = `${recomendadas} (${total ? Math.round(recomendadas/total*100) : 0}%)`;
  document.getElementById('kpi-revisar').textContent = `${revisar} (${total ? Math.round(revisar/total*100) : 0}%)`;
  document.getElementById('kpi-rechazadas').textContent = `${rechazadas} (${total ? Math.round(rechazadas/total*100) : 0}%)`;
}

function renderizarDatos(solicitudes) {
  const contenedor = document.getElementById('dashboard-contenedor-datos');

  if (modoVista === 'tabla') {
    contenedor.innerHTML = renderTablaSolicitudes(solicitudes);
  } else {
    if (!solicitudes || solicitudes.length === 0) {
      contenedor.innerHTML = renderTablaSolicitudes([]);
      return;
    }

    const tarjetasHtml = solicitudes.map(s => renderTarjetaSolicitud(s)).join('');
    contenedor.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem;">
        ${tarjetasHtml}
      </div>
    `;
  }
}
