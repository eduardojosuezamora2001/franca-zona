/**
 * Controlador para Panel de Alertas y Resumen PROCOMER (modulos/cumplimiento/panel-alertas.js)
 * Satisface RF-08 y RF-09.
 */
import { renderNavbar } from '../../components/navbar.js';
import { obtenerAlertas, obtenerReportesCumplimiento, obtenerResumenConsolidadoPROCOMER } from './cumplimiento.service.js';
import { mostrarToast } from '../../components/toast.js';

document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('#app-shell');

  await cargarResumenPROCOMER();
  await cargarAlertas();
  await cargarTablaReportes();

  document.getElementById('btn-exportar-procomer').addEventListener('click', () => {
    mostrarToast('Generando informe oficial consolidado de cumplimiento para PROCOMER...', 'info');
    setTimeout(() => {
      mostrarToast('Informe exportado exitosamente en formato oficial PROCOMER (Simulación PDF/XLS).', 'success');
    }, 1500);
  });
});

async function cargarResumenPROCOMER() {
  try {
    const resumen = await obtenerResumenConsolidadoPROCOMER();

    const invFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(resumen.totalInversionEjecutada);
    const expFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(resumen.totalExportaciones);

    document.getElementById('procomer-inv-total').textContent = invFormatted;
    document.getElementById('procomer-inv-pct').textContent = `Cumplimiento: ${resumen.cumplimientoGlobalInversion}% de compromisos`;

    document.getElementById('procomer-emp-total').textContent = `${resumen.totalEmpleosReales} puestos`;
    document.getElementById('procomer-emp-pct').textContent = `Cumplimiento: ${resumen.cumplimientoGlobalEmpleos}% de compromisos`;

    document.getElementById('procomer-exp-total').textContent = expFormatted;
  } catch (err) {
    console.warn('Error en resumen PROCOMER', err);
  }
}

async function cargarAlertas() {
  const contenedor = document.getElementById('contenedor-alertas');
  try {
    const alertas = await obtenerAlertas();

    if (!alertas || alertas.length === 0) {
      contenedor.innerHTML = `
        <div style="background-color: var(--estado-recomendada-bg); border: 1px solid var(--estado-recomendada-borde); padding: 1.5rem; border-radius: 8px; text-align: center; color: var(--estado-recomendada-texto);">
          <i class="fa-solid fa-circle-check"></i> <strong>Excelente:</strong> No se registran alertas activas de incumplimiento. Todas las empresas cumplen con más del 85% de sus compromisos.
        </div>
      `;
      return;
    }

    const html = alertas.map(a => {
      const invEjec = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(a.inversionEjecutada);
      const invComp = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(a.inversionComprometida);
      const empPct = Math.round((a.empleosReales / a.empleosComprometidos) * 100);

      return `
        <div style="background-color: var(--estado-rechazada-bg); border: 1px solid var(--estado-rechazada-borde); border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem; color: var(--estado-rechazada-texto);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
            <div>
              <strong style="font-size: 1.1rem;"><i class="fa-solid fa-triangle-exclamation"></i> ${a.nombreEmpresa}</strong> (${a.nombreZonaFranca})
            </div>
            <span class="badge-estado badge-estado--rechazada">Gravedad: ${a.gravedad}</span>
          </div>

          <p style="font-size: 0.9rem; margin-bottom: 0.75rem;">
            <strong>Tipo de Alerta:</strong> ${a.tipoIncumplimiento} (Período: ${a.periodo})
          </p>

          <div style="display: flex; gap: 2rem; flex-wrap: wrap; background-color: rgba(255,255,255,0.4); padding: 0.75rem; border-radius: 6px; font-size: 0.875rem;">
            <div><i class="fa-solid fa-users"></i> <strong>Empleos Reales:</strong> ${a.empleosReales} de ${a.empleosComprometidos} (<span style="font-weight: 700; text-decoration: underline;">${empPct}%</span>)</div>
            <div><i class="fa-solid fa-sack-dollar"></i> <strong>Inversión Ejecutada:</strong> ${invEjec} de ${invComp}</div>
          </div>
        </div>
      `;
    }).join('');

    contenedor.innerHTML = html;
  } catch (err) {
    contenedor.innerHTML = `<p style="color: var(--estado-rechazada-texto);">Error cargando alertas: ${err.message}</p>`;
  }
}

async function cargarTablaReportes() {
  const contenedor = document.getElementById('contenedor-tabla-reportes');
  try {
    const reportes = await obtenerReportesCumplimiento();

    if (!reportes || reportes.length === 0) {
      contenedor.innerHTML = '<p style="color: var(--color-texto-secundario);">No hay reportes de cumplimiento recibidos.</p>';
      return;
    }

    const filas = reportes.map(r => {
      const invEjec = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(r.inversionEjecutada);
      const expFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(r.exportaciones);
      const esAlerta = r.estadoCumplimiento === 'Incumplimiento';

      return `
        <tr>
          <td><strong>${r.id}</strong></td>
          <td>${r.nombreEmpresa}</td>
          <td>${r.nombreZonaFranca}</td>
          <td><span class="badge-estado badge-estado--recomendada">${r.periodo}</span></td>
          <td>${r.empleosReales} / ${r.empleosComprometidos} (${r.cumplimientoEmpleosPct}%)</td>
          <td>${invEjec} (${r.cumplimientoInversionPct}%)</td>
          <td>${expFormatted}</td>
          <td>
            <span class="badge-estado badge-estado--${esAlerta ? 'rechazada' : 'recomendada'}">
              ${r.estadoCumplimiento}
            </span>
          </td>
        </tr>
      `;
    }).join('');

    contenedor.innerHTML = `
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>ID Reporte</th>
              <th>Empresa</th>
              <th>Zona Franca</th>
              <th>Período</th>
              <th>Empleos (Real / Pactado)</th>
              <th>Inversión (Real / Pactado)</th>
              <th>Exportaciones</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${filas}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    contenedor.innerHTML = `<p style="color: var(--estado-rechazada-texto);">Error cargando tabla: ${err.message}</p>`;
  }
}
