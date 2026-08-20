/**
 * Controlador para Formulario de Reporte de Cumplimiento (modulos/cumplimiento/reporte-cumplimiento.js)
 * Satisface RF-06 y RF-07.
 */
import { renderNavbar } from '../../components/navbar.js';
import { obtenerSolicitudes } from '../solicitudes/solicitudes.service.js';
import { enviarReporteCumplimiento } from './cumplimiento.service.js';
import { mostrarToast } from '../../components/toast.js';

let solicitudesAprobadas = [];
let solicitudSeleccionada = null;

document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('#app-shell');

  const selectSol = document.getElementById('rep-solicitud');
  try {
    const todas = await obtenerSolicitudes();
    // Filtrar solicitudes aprobadas o recomendadas
    solicitudesAprobadas = todas.filter(s => s.estado === 'Recomendada' || s.estado === 'Aprobada' || s.estado === 'Revisar');

    solicitudesAprobadas.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${s.id} — ${s.nombreEmpresa} (${s.nombreZonaFranca})`;
      selectSol.appendChild(opt);
    });

    if (solicitudesAprobadas.length > 0) {
      selectSol.value = solicitudesAprobadas[0].id;
      actualizarCompromisoOriginal(solicitudesAprobadas[0]);
    }
  } catch (e) {
    mostrarToast('Error cargando solicitudes aprobadas', 'error');
  }

  selectSol.addEventListener('change', (e) => {
    const encontrada = solicitudesAprobadas.find(s => s.id === e.target.value);
    if (encontrada) {
      actualizarCompromisoOriginal(encontrada);
      calcularPrevisualizacion();
    }
  });

  ['rep-inversion', 'rep-empleos'].forEach(id => {
    document.getElementById(id).addEventListener('input', calcularPrevisualizacion);
  });

  const form = document.getElementById('form-reporte-cumplimiento');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.getElementById('btn-enviar-reporte');
    btn.disabled = true;
    btn.textContent = '⏳ Verificando y procesando...';

    const datos = {
      solicitudId: document.getElementById('rep-solicitud').value,
      periodo: document.getElementById('rep-periodo').value,
      inversionEjecutada: document.getElementById('rep-inversion').value,
      empleosReales: document.getElementById('rep-empleos').value,
      exportaciones: document.getElementById('rep-exportaciones').value
    };

    try {
      const reporte = await enviarReporteCumplimiento(datos);
      if (reporte.alertaGenerada) {
        mostrarToast(`⚠️ Reporte registrado. Atención: Se generó una ALERTA de incumplimiento (${reporte.cumplimientoEmpleosPct}% empleos).`, 'error', 6000);
      } else {
        mostrarToast(`✅ Reporte de cumplimiento registrado exitosamente (Estado: En Regla).`, 'success');
      }

      setTimeout(() => {
        window.location.href = '/modulos/cumplimiento/panel-alertas.html';
      }, 1500);
    } catch (err) {
      mostrarToast(`Error enviando reporte: ${err.message}`, 'error');
      btn.disabled = false;
      btn.textContent = '📤 Enviar Reporte de Cumplimiento';
    }
  });
});

function actualizarCompromisoOriginal(solicitud) {
  solicitudSeleccionada = solicitud;
  const box = document.getElementById('box-compromiso-original');
  const lblInv = document.getElementById('lbl-inv-comprometida');
  const lblEmp = document.getElementById('lbl-emp-comprometidos');

  lblInv.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(solicitud.inversionProyectada);
  lblEmp.textContent = `${solicitud.empleosProyectados} directos`;
  box.style.display = 'block';
}

function calcularPrevisualizacion() {
  if (!solicitudSeleccionada) return;

  const invReal = Number(document.getElementById('rep-inversion').value) || 0;
  const empReal = Number(document.getElementById('rep-empleos').value) || 0;

  const invComp = Number(solicitudSeleccionada.inversionProyectada) || 1;
  const empComp = Number(solicitudSeleccionada.empleosProyectados) || 1;

  const invPct = ((invReal / invComp) * 100).toFixed(1);
  const empPct = ((empReal / empComp) * 100).toFixed(1);

  const prevBox = document.getElementById('box-previz-cumplimiento');
  const prevInv = document.getElementById('prev-inv-pct');
  const prevEmp = document.getElementById('prev-emp-pct');
  const prevAlerta = document.getElementById('prev-estado-alerta');

  prevInv.textContent = `${invPct}%`;
  prevEmp.textContent = `${empPct}%`;

  if (invPct < 85 || empPct < 85) {
    prevAlerta.textContent = '⚠️ Se generará una ALERTA por déficit de compromiso (<85%)';
    prevAlerta.style.color = '#DC2626';
  } else {
    prevAlerta.textContent = '✅ Cumplimiento óptimo frente al compromiso original';
    prevAlerta.style.color = '#166534';
  }

  prevBox.style.display = 'block';
}
