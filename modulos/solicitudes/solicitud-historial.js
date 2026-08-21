/**
 * Controlador para Historial de Solicitudes Propias (modulos/solicitudes/solicitud-historial.js)
 */
import { renderNavbar } from '../../components/navbar.js';
import { obtenerSolicitudes } from './solicitudes.service.js';
import { renderTablaSolicitudes } from '../../components/tabla-datos.js';
import { obtenerSesion } from '../../shared/auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('#app-shell');

  const sesion = obtenerSesion();
  const subtitulo = document.getElementById('subtitulo-empresa');
  if (subtitulo && sesion.nombreEmpresa) {
    subtitulo.textContent = `Empresa: ${sesion.nombreEmpresa} — Cédula Jurídica: ${sesion.empresaId}`;
  }

  const contenedor = document.getElementById('contenedor-lista-historial');

  try {
    const solicitudes = await obtenerSolicitudes({ empresaId: sesion.empresaId });
    contenedor.innerHTML = renderTablaSolicitudes(solicitudes);
  } catch (err) {
    contenedor.innerHTML = `
      <div class="card" style="text-align: center; color: var(--estado-rechazada-texto); border-color: var(--estado-rechazada-borde);">
        <i class="fa-solid fa-triangle-exclamation"></i> Error al cargar el historial de solicitudes: ${err.message}
      </div>
    `;
  }
});
