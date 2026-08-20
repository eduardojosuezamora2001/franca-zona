/**
 * Capa de Servicios de Cumplimiento y Reportería (modulos/cumplimiento/cumplimiento.service.js)
 * Satisface RF-06, RF-07, RF-08 y RF-09.
 */
import { request } from '../../shared/http.js';
import { obtenerSolicitudes } from '../solicitudes/solicitudes.service.js';

export async function obtenerReportesCumplimiento() {
  return await request('/reportesCumplimiento');
}

export async function obtenerAlertas() {
  return await request('/alertas');
}

export async function enviarReporteCumplimiento(datosReporte) {
  // RF-07: Obtener compromisos originales de la solicitud
  const solicitudes = await obtenerSolicitudes();
  const solicitudOriginal = solicitudes.find(s => s.id === datosReporte.solicitudId) || {
    inversionProyectada: datosReporte.inversionComprometida || 1000000,
    empleosProyectados: datosReporte.empleosComprometidos || 50,
    nombreEmpresa: datosReporte.nombreEmpresa || 'Empresa Instalada',
    nombreZonaFranca: datosReporte.nombreZonaFranca || 'Zona Franca'
  };

  const empleosReales = Number(datosReporte.empleosReales);
  const empleosComprometidos = Number(solicitudOriginal.empleosProyectados);
  const cumplimientoEmpleosPct = Number(((empleosReales / empleosComprometidos) * 100).toFixed(1));

  const inversionEjecutada = Number(datosReporte.inversionEjecutada);
  const inversionComprometida = Number(solicitudOriginal.inversionProyectada);
  const cumplimientoInversionPct = Number(((inversionEjecutada / inversionComprometida) * 100).toFixed(1));

  const exportaciones = Number(datosReporte.exportaciones) || 0;

  // RF-08: Umbral de alerta (si empleos o inversión están por debajo del 85% del compromiso)
  const UMBRAL_ALERTA_PCT = 85.0;
  const esIncumplimiento = cumplimientoEmpleosPct < UMBRAL_ALERTA_PCT || cumplimientoInversionPct < UMBRAL_ALERTA_PCT;

  const idReporte = `REP-2026-${Math.floor(100 + Math.random() * 900)}`;

  let detalleAlerta = '';
  if (esIncumplimiento) {
    detalleAlerta = `Alerta de Incumplimiento: Empleos reales (${empleosReales}) al ${cumplimientoEmpleosPct}% del compromiso (${empleosComprometidos}) e inversión ejecutada ($${inversionEjecutada.toLocaleString()} USD) al ${cumplimientoInversionPct}% de lo acordado.`;
  }

  const reporteFinal = {
    id: idReporte,
    solicitudId: datosReporte.solicitudId,
    empresaId: solicitudOriginal.empresaId || 'emp-101',
    nombreEmpresa: solicitudOriginal.nombreEmpresa,
    nombreZonaFranca: solicitudOriginal.nombreZonaFranca,
    periodo: datosReporte.periodo,
    empleosReales,
    empleosComprometidos,
    cumplimientoEmpleosPct,
    inversionEjecutada,
    inversionComprometida,
    cumplimientoInversionPct,
    exportaciones,
    fechaEnvio: new Date().toISOString(),
    estadoCumplimiento: esIncumplimiento ? 'Incumplimiento' : 'En Regla',
    alertaGenerada: esIncumplimiento,
    detalleAlerta
  };

  // Guardar reporte
  const reporteGuardado = await request('/reportesCumplimiento', {
    method: 'POST',
    body: JSON.stringify(reporteFinal)
  });

  // RF-08: Registrar alerta en la colección /alertas si aplica
  if (esIncumplimiento) {
    const idAlerta = `ALT-2026-${Math.floor(100 + Math.random() * 900)}`;
    const nuevaAlerta = {
      id: idAlerta,
      reporteId: idReporte,
      empresaId: reporteFinal.empresaId,
      nombreEmpresa: reporteFinal.nombreEmpresa,
      nombreZonaFranca: reporteFinal.nombreZonaFranca,
      periodo: datosReporte.periodo,
      fechaDeteccion: new Date().toISOString(),
      tipoIncumplimiento: cumplimientoEmpleosPct < UMBRAL_ALERTA_PCT ? 'Déficit de empleos proyectados' : 'Déficit de inversión ejecutada',
      empleosComprometidos,
      empleosReales,
      inversionComprometida,
      inversionEjecutada,
      gravedad: cumplimientoEmpleosPct < 70 ? 'Alta' : 'Media',
      estadoAlerta: 'Activa'
    };

    await request('/alertas', {
      method: 'POST',
      body: JSON.stringify(nuevaAlerta)
    });
  }

  return reporteGuardado;
}

// RF-09: Resumen consolidado tipo reporte a PROCOMER
export async function obtenerResumenConsolidadoPROCOMER() {
  const reportes = await obtenerReportesCumplimiento();
  const solicitudes = await obtenerSolicitudes();

  let totalInversionEjecutada = 0;
  let totalInversionComprometida = 0;
  let totalEmpleosReales = 0;
  let totalEmpleosComprometidos = 0;
  let totalExportaciones = 0;

  reportes.forEach(r => {
    totalInversionEjecutada += Number(r.inversionEjecutada) || 0;
    totalInversionComprometida += Number(r.inversionComprometida) || 0;
    totalEmpleosReales += Number(r.empleosReales) || 0;
    totalEmpleosComprometidos += Number(r.empleosComprometidos) || 0;
    totalExportaciones += Number(r.exportaciones) || 0;
  });

  const cumplimientoGlobalInversion = totalInversionComprometida > 0 ? (totalInversionEjecutada / totalInversionComprometida) * 100 : 100;
  const cumplimientoGlobalEmpleos = totalEmpleosComprometidos > 0 ? (totalEmpleosReales / totalEmpleosComprometidos) * 100 : 100;

  return {
    totalEmpresasReportando: reportes.length,
    totalInversionEjecutada,
    totalInversionComprometida,
    cumplimientoGlobalInversion: Number(cumplimientoGlobalInversion.toFixed(1)),
    totalEmpleosReales,
    totalEmpleosComprometidos,
    cumplimientoGlobalEmpleos: Number(cumplimientoGlobalEmpleos.toFixed(1)),
    totalExportaciones,
    desglosePorReporte: reportes
  };
}
