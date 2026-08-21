/**
 * Componente Tabla de Datos Reutilizable (components/tabla-datos.js)
 */
import { renderBadgeEstado } from './badge-estado.js';
import { t } from '../shared/i18n.js';

export function renderTablaSolicitudes(solicitudes, onAccionClick) {
  if (!solicitudes || solicitudes.length === 0) {
    return `
      <div class="card" style="text-align: center; padding: 3rem 1.5rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem; color: var(--color-texto-secundario);"><i class="fa-solid fa-magnifying-glass"></i></div>
        <h3 data-i18n="dashboard.empty_title">${t('dashboard.empty_title', 'No se encontraron solicitudes')}</h3>
        <p style="color: var(--color-texto-secundario);" data-i18n="dashboard.empty_desc">${t('dashboard.empty_desc', 'Prueba ajustando los filtros de búsqueda o registra una nueva solicitud.')}</p>
      </div>
    `;
  }

  const filasHtml = solicitudes.map(s => {
    const fechaFormatted = new Date(s.fechaEnvio).toLocaleDateString('es-CR', { year: 'numeric', month: 'short', day: 'numeric' });
    const inversionFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(s.inversionProyectada);

    return `
      <tr>
        <td><strong>${s.id}</strong></td>
        <td>
          <div><strong>${s.nombreEmpresa}</strong></div>
          <div style="font-size: 0.8rem; color: var(--color-texto-secundario);">${s.cedulaJuridica}</div>
        </td>
        <td>${s.sector}</td>
        <td>${s.nombreZonaFranca}</td>
        <td>${inversionFormatted}</td>
        <td>${s.empleosProyectados}</td>
        <td>
          <div style="display: flex; flex-direction: column; gap: 0.25rem;">
            ${renderBadgeEstado(s.estado)}
            <small style="font-size: 0.75rem; color: var(--color-texto-secundario);">${t('common.score', 'Puntaje IA')}: <strong>${s.puntajeIA}/100</strong></small>
          </div>
        </td>
        <td>${fechaFormatted}</td>
        <td>
          <a href="/modulos/solicitudes/solicitud-detalle.html?id=${s.id}" class="btn btn-secondary" style="padding: 0.35rem 0.65rem; font-size: 0.8rem;" data-i18n="common.view_detail">
            ${t('common.view_detail', 'Ver Detalle')}
          </a>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th data-i18n="common.company">${t('common.company', 'Empresa')}</th>
            <th data-i18n="common.sector">${t('common.sector', 'Sector')}</th>
            <th data-i18n="common.zone">${t('common.zone', 'Zona Franca')}</th>
            <th data-i18n="common.investment">${t('common.investment', 'Inversión')}</th>
            <th data-i18n="common.jobs">${t('common.jobs', 'Empleos')}</th>
            <th data-i18n="common.status">${t('common.status', 'Estado / IA')}</th>
            <th data-i18n="common.date">${t('common.date', 'Fecha')}</th>
            <th data-i18n="common.actions">${t('common.actions', 'Acciones')}</th>
          </tr>
        </thead>
        <tbody>
          ${filasHtml}
        </tbody>
      </table>
    </div>
  `;
}
