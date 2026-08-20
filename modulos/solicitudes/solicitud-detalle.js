/**
 * Controlador para la vista Detalle de Solicitud (modulos/solicitudes/solicitud-detalle.js)
 */
import { renderNavbar } from '../../components/navbar.js';
import { obtenerSolicitudPorId, obtenerZonasFrancas, actualizarEstadoSolicitud } from './solicitudes.service.js';
import { renderBadgeEstado } from '../../components/badge-estado.js';
import { crearModal } from '../../components/modal.js';
import { mostrarToast } from '../../components/toast.js';
import { obtenerSesion } from '../../shared/auth.js';
import { t } from '../../shared/i18n.js';

let solicitudActual = null;
let zonaFrancaActual = null;

document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('#app-shell');

  const params = new URLSearchParams(window.location.search);
  const idSolicitud = params.get('id') || 'SOL-2026-001';

  await cargarDetalle(idSolicitud);
});

async function cargarDetalle(id) {
  const contenedor = document.getElementById('contenedor-detalle-solicitud');
  try {
    solicitudActual = await obtenerSolicitudPorId(id);
    const zonasFrancas = await obtenerZonasFrancas();
    zonaFrancaActual = zonasFrancas.find(z => z.id === solicitudActual.zonaFrancaId) || {
      inversionMinima: 1000000,
      empleosMinimos: 30,
      sectoresPermitidos: ['Tecnología', 'Dispositivos Médicos']
    };

    document.getElementById('subtitulo-solicitud').textContent = `${solicitudActual.id} — Registrada el ${new Date(solicitudActual.fechaEnvio).toLocaleString('es-CR')}`;
    document.getElementById('badge-contenedor-estado').innerHTML = renderBadgeEstado(solicitudActual.estado);

    renderizarVista(solicitudActual, zonaFrancaActual);
  } catch (err) {
    contenedor.innerHTML = `
      <div class="card" style="text-align: center; color: var(--estado-rechazada-texto); border-color: var(--estado-rechazada-borde);">
        ⚠️ No se encontró la solicitud solicitada (ID: ${id}): ${err.message}
      </div>
    `;
  }
}

function renderizarVista(solicitud, zona) {
  const contenedor = document.getElementById('contenedor-detalle-solicitud');
  const sesion = obtenerSesion();
  const esAnalistaOAdmin = sesion.rol === 'analista' || sesion.rol === 'administrador';

  const inversionFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(solicitud.inversionProyectada);
  const minInversionFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(zona.inversionMinima);

  // Color de barra según puntaje
  let colorBarra = '#166534';
  if (solicitud.puntajeIA < 50) colorBarra = '#DC2626';
  else if (solicitud.puntajeIA < 80) colorBarra = '#D97706';

  // Historial HTML
  const historialHtml = (solicitud.historialTrazabilidad || []).map(h => `
    <div style="padding-left: 1rem; border-left: 2px solid var(--color-primario); margin-bottom: 1rem; position: relative;">
      <div style="position: absolute; left: -6px; top: 0; width: 10px; height: 10px; border-radius: 50%; background: var(--color-primario);"></div>
      <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--color-texto-secundario);">
        <strong>${h.usuario}</strong>
        <span>${new Date(h.fecha).toLocaleString('es-CR')}</span>
      </div>
      <div style="font-weight: 600; font-size: 0.95rem; margin-top: 0.2rem;">${h.accion}</div>
      <div style="font-size: 0.875rem; color: var(--color-texto);">${h.detalle}</div>
    </div>
  `).join('');

  contenedor.innerHTML = `
    <!-- Tarjeta de Puntaje de IA -->
    <div class="ai-score-card">
      <div class="ai-score-header">
        <div>
          <h3 style="font-size: 1.25rem; display: flex; align-items: center; gap: 0.5rem;" data-i18n="detail.ai_score">
            🤖 Puntaje de Afinidad Algorítmica con IA
          </h3>
          <p style="font-size: 0.875rem; color: var(--color-texto-secundario);">Evaluación automatizada frente a parámetros de la Zona Franca "${solicitud.nombreZonaFranca}"</p>
        </div>
        <div class="ai-score-number">${solicitud.puntajeIA}<span style="font-size: 1rem; color: var(--color-texto-secundario);">/100</span></div>
      </div>

      <div class="ai-progress-track">
        <div class="ai-progress-fill" style="width: ${solicitud.puntajeIA}%; background-color: ${colorBarra};"></div>
      </div>

      <div style="background-color: var(--color-superficie-elevada); border-left: 4px solid var(--color-acento); padding: 1rem; border-radius: 8px;">
        <h4 style="font-size: 0.9rem; margin-bottom: 0.35rem;" data-i18n="detail.ai_justification">💬 Justificación Algorítmica de la IA:</h4>
        <p style="font-size: 0.925rem;">${solicitud.justificacionIA}</p>
      </div>
    </div>

    <!-- Requisitos Comparativos de la Zona Franca -->
    <div class="card">
      <h3 style="font-size: 1.15rem; margin-bottom: 1rem;" data-i18n="detail.requirements">📊 Comparativa de Requisitos Reales vs. Exigidos</h3>
      <div class="form-row">
        <div style="background-color: var(--color-superficie-elevada); padding: 1rem; border-radius: 8px;">
          <small style="color: var(--color-texto-secundario);">Inversión Proyectada</small>
          <div style="font-size: 1.2rem; font-weight: 700;">${inversionFormatted}</div>
          <small style="color: var(--color-texto-secundario);">Mínimo Exigido: <strong>${minInversionFormatted}</strong></small>
        </div>

        <div style="background-color: var(--color-superficie-elevada); padding: 1rem; border-radius: 8px;">
          <small style="color: var(--color-texto-secundario);">Empleos Directos Proyectados</small>
          <div style="font-size: 1.2rem; font-weight: 700;">${solicitud.empleosProyectados} empleos</div>
          <small style="color: var(--color-texto-secundario);">Mínimo Exigido: <strong>${zona.empleosMinimos} empleos</strong></small>
        </div>

        <div style="background-color: var(--color-superficie-elevada); padding: 1rem; border-radius: 8px;">
          <small style="color: var(--color-texto-secundario);">Compatibilidad Sectorial</small>
          <div style="font-size: 1.2rem; font-weight: 700; color: ${zona.sectoresPermitidos.includes(solicitud.sector) ? '#166534' : '#DC2626'};">
            ${zona.sectoresPermitidos.includes(solicitud.sector) ? '✅ Sector Compatible' : '❌ Sector Incompatible'}
          </div>
          <small style="color: var(--color-texto-secundario);">Permitidos: <strong>${zona.sectoresPermitidos.join(', ')}</strong></small>
        </div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
      <!-- Información General -->
      <div class="card">
        <h3 style="font-size: 1.15rem; margin-bottom: 1rem;" data-i18n="detail.company_info">🏢 Información de la Empresa y Proyecto</h3>
        <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.925rem;">
          <div><strong>Empresa:</strong> ${solicitud.nombreEmpresa}</div>
          <div><strong>Cédula Jurídica:</strong> ${solicitud.cedulaJuridica}</div>
          <div><strong>Sector:</strong> ${solicitud.sector}</div>
          <div><strong>Zona Franca:</strong> ${solicitud.nombreZonaFranca}</div>
          <div><strong>Descripción del Proyecto:</strong> ${solicitud.descripcionProyecto || 'Sin descripción adicional'}</div>
          <div>
            <strong>Documentos Adjuntos:</strong>
            <ul style="margin-top: 0.35rem; padding-left: 1.25rem;">
              ${(solicitud.adjuntosSimulados || []).map(f => `<li>📄 <a href="#">${f}</a></li>`).join('')}
            </ul>
          </div>
        </div>
      </div>

      <!-- Historial de Trazabilidad -->
      <div class="card">
        <h3 style="font-size: 1.15rem; margin-bottom: 1rem;" data-i18n="detail.history">📜 Historial de Trazabilidad</h3>
        <div>
          ${historialHtml}
        </div>
      </div>
    </div>

    <!-- Panel de Acciones de Clasificación Manual (Analista / Admin) -->
    ${esAnalistaOAdmin ? `
      <div class="card" style="border: 2px solid var(--color-primario);">
        <h3 style="font-size: 1.15rem; margin-bottom: 0.5rem;" data-i18n="detail.actions">⚖️ Acciones de Clasificación del Analista</h3>
        <p style="font-size: 0.875rem; color: var(--color-texto-secundario); margin-bottom: 1.25rem;">
          Como analista, usted puede confirmar la recomendación de la IA o rectificar manualmente el estado de la solicitud. Toda decisión quedará auditada en el historial de trazabilidad.
        </p>

        <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
          <button id="btn-confirmar-ia" class="btn btn-success" data-i18n="detail.confirm_ai">
            ✅ Confirmar Recomendación IA (${solicitud.clasificacionIA})
          </button>
          <button id="btn-rechazar-solicitud" class="btn btn-danger" data-i18n="detail.reject_ai">
            ❌ Rechazar Solicitud
          </button>
          <button id="btn-cambiar-clasificacion" class="btn btn-warning" data-i18n="detail.change_status">
            ⚠️ Cambiar Clasificación Manualmente
          </button>
        </div>
      </div>
    ` : ''}
  `;

  // Eventos de botones de acción
  if (esAnalistaOAdmin) {
    document.getElementById('btn-confirmar-ia')?.addEventListener('click', () => {
      abrirModalConfirmacion(solicitud.clasificacionIA, 'Confirmación directa de sugerencia algorítmica.');
    });

    document.getElementById('btn-rechazar-solicitud')?.addEventListener('click', () => {
      abrirModalConfirmacion('Rechazada', 'Rechazo manual por parte del analista.');
    });

    document.getElementById('btn-cambiar-clasificacion')?.addEventListener('click', () => {
      abrirModalCambioManual();
    });
  }
}

function abrirModalConfirmacion(nuevoEstado, justificacionDefecto) {
  const contenidoHtml = `
    <p style="margin-bottom: 1rem;">¿Está seguro de clasificar la solicitud <strong>${solicitudActual.id}</strong> como <strong style="text-transform:uppercase;">${nuevoEstado}</strong>?</p>
    <div class="form-group">
      <label class="form-label" for="modal-justificacion">Justificación u observaciones del Analista *</label>
      <textarea id="modal-justificacion" class="form-control" rows="3" placeholder="Ingrese el motivo de su resolución...">${justificacionDefecto}</textarea>
    </div>
  `;

  crearModal({
    titulo: `Confirmar Resolución (${nuevoEstado})`,
    contenidoHtml,
    textoConfirmar: 'Guardar Resolución',
    onConfirmar: async () => {
      const nota = document.getElementById('modal-justificacion').value.trim();
      try {
        await actualizarEstadoSolicitud(solicitudActual.id, nuevoEstado, nota);
        mostrarToast('Estado actualizado correctamente', 'success');
        await cargarDetalle(solicitudActual.id);
      } catch (e) {
        mostrarToast(`Error al actualizar estado: ${e.message}`, 'error');
      }
    }
  });
}

function abrirModalCambioManual() {
  const contenidoHtml = `
    <div class="form-group">
      <label class="form-label" for="modal-select-nuevo-estado">Seleccione el nuevo estado:</label>
      <select id="modal-select-nuevo-estado" class="form-control">
        <option value="Recomendada" ${solicitudActual.estado === 'Recomendada' ? 'selected' : ''}>Recomendada</option>
        <option value="Revisar" ${solicitudActual.estado === 'Revisar' ? 'selected' : ''}>Revisar</option>
        <option value="Rechazada" ${solicitudActual.estado === 'Rechazada' ? 'selected' : ''}>Rechazada</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label" for="modal-justificacion-manual">Motivo de la reclasificación manual *</label>
      <textarea id="modal-justificacion-manual" class="form-control" rows="3" placeholder="Justifique el cambio de estado frente al reporte de la IA..."></textarea>
    </div>
  `;

  crearModal({
    titulo: 'Reclasificación Manual de Solicitud',
    contenidoHtml,
    textoConfirmar: 'Aplicar Cambio',
    onConfirmar: async () => {
      const nuevoEstado = document.getElementById('modal-select-nuevo-estado').value;
      const nota = document.getElementById('modal-justificacion-manual').value.trim() || 'Reclasificación manual efectuada por el analista.';
      try {
        await actualizarEstadoSolicitud(solicitudActual.id, nuevoEstado, nota);
        mostrarToast('Solicitud reclasificada con éxito', 'success');
        await cargarDetalle(solicitudActual.id);
      } catch (e) {
        mostrarToast(`Error al reclasificar: ${e.message}`, 'error');
      }
    }
  });
}
