/**
 * Componente Tarjeta de Solicitud (components/tarjeta-solicitud.js)
 */
import { renderBadgeEstado } from './badge-estado.js';
import { t } from '../shared/i18n.js';

export function renderTarjetaSolicitud(solicitud) {
  const inversionFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(solicitud.inversionProyectada);
  const fechaFormatted = new Date(solicitud.fechaEnvio).toLocaleDateString('es-CR', { year: 'numeric', month: 'short', day: 'numeric' });

  return `
    <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
          <span style="font-weight: 700; font-size: 0.85rem; color: var(--color-texto-secundario);">${solicitud.id}</span>
          ${renderBadgeEstado(solicitud.estado)}
        </div>
        <h3 style="font-size: 1.15rem; margin-bottom: 0.25rem;">${solicitud.nombreEmpresa}</h3>
        <p style="font-size: 0.85rem; color: var(--color-texto-secundario); margin-bottom: 1rem;">
          📍 ${solicitud.nombreZonaFranca} &bull; 🏭 ${solicitud.sector}
        </p>
        
        <div style="background-color: var(--color-superficie-elevada); padding: 0.75rem; border-radius: 8px; font-size: 0.875rem; margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
            <span>💵 Inversión:</span>
            <strong>${inversionFormatted}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>👥 Empleos:</span>
            <strong>${solicitud.empleosProyectados} directos</strong>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; margin-bottom: 1rem;">
          <span>🤖 Afinidad IA:</span>
          <div style="flex:1; height: 8px; background: var(--color-superficie-elevada); border-radius: 4px; overflow:hidden;">
            <div style="width: ${solicitud.puntajeIA}%; height: 100%; background: ${solicitud.puntajeIA >= 80 ? '#166534' : solicitud.puntajeIA >= 50 ? '#D97706' : '#DC2626'};"></div>
          </div>
          <strong>${solicitud.puntajeIA}%</strong>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: var(--grosor-borde) solid var(--color-borde); pt: 0.75rem; margin-top: 0.5rem; padding-top: 0.75rem;">
        <small style="color: var(--color-texto-secundario);">${fechaFormatted}</small>
        <a href="/modulos/solicitudes/solicitud-detalle.html?id=${solicitud.id}" class="btn btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" data-i18n="common.view_detail">
          ${t('common.view_detail', 'Ver Detalle')}
        </a>
      </div>
    </div>
  `;
}
