/**
 * Servicio Transversal de Evaluación Algorítmica con IA (modulos/ia/ia.service.js)
 * Satisface RF-04, RF-08, RF-12 y RF-13.
 */

export function evaluarConIA(datosSolicitud, zonaFranca) {
  const inversionProyectada = Number(datosSolicitud.inversionProyectada) || 0;
  const empleosProyectados = Number(datosSolicitud.empleosProyectados) || 0;
  const sector = datosSolicitud.sector || '';

  const inversionMinima = zonaFranca ? zonaFranca.inversionMinima : 1000000;
  const empleosMinimos = zonaFranca ? zonaFranca.empleosMinimos : 30;
  const sectoresPermitidos = zonaFranca ? zonaFranca.sectoresPermitidos : [];

  let puntajeSector = 0;
  let compatibleSector = false;

  if (sectoresPermitidos.includes(sector)) {
    puntajeSector = 30;
    compatibleSector = true;
  } else {
    puntajeSector = 5; // Incompatibilidad sectorial penalizada
  }

  // Ratio Inversión
  const ratioInversion = inversionProyectada / (inversionMinima || 1);
  let puntajeInversion = 0;
  if (ratioInversion >= 1.5) puntajeInversion = 35;
  else if (ratioInversion >= 1.0) puntajeInversion = 30;
  else if (ratioInversion >= 0.8) puntajeInversion = 15;
  else puntajeInversion = 5;

  // Ratio Empleos
  const ratioEmpleos = empleosProyectados / (empleosMinimos || 1);
  let puntajeEmpleos = 0;
  if (ratioEmpleos >= 1.5) puntajeEmpleos = 35;
  else if (ratioEmpleos >= 1.0) puntajeEmpleos = 30;
  else if (ratioEmpleos >= 0.8) puntajeEmpleos = 15;
  else puntajeEmpleos = 5;

  let puntajeTotal = Math.min(100, Math.max(0, puntajeSector + puntajeInversion + puntajeEmpleos));

  let clasificacion = 'Revisar';
  if (puntajeTotal >= 80 && compatibleSector) {
    clasificacion = 'Recomendada';
  } else if (puntajeTotal < 50 || !compatibleSector) {
    clasificacion = 'Rechazada';
  } else {
    clasificacion = 'Revisar';
  }

  // Generar justificación textual explicativa
  let justificacion = '';
  const diffInversionPct = Math.round((ratioInversion - 1) * 100);
  const diffEmpleosPct = Math.round((ratioEmpleos - 1) * 100);

  if (clasificacion === 'Recomendada') {
    justificacion = `La empresa cumple holgadamente con los requisitos de ${zonaFranca.nombre}: la inversión proyectada ($${inversionProyectada.toLocaleString()} USD) supera el mínimo exigido en un ${diffInversionPct > 0 ? '+' + diffInversionPct : diffInversionPct}%, el compromiso de empleos directos (${empleosProyectados}) supera el requerimiento en un ${diffEmpleosPct > 0 ? '+' + diffEmpleosPct : diffEmpleosPct}%, y el sector '${sector}' forma parte de los sectores estratégicos aprobados.`;
  } else if (clasificacion === 'Revisar') {
    justificacion = `Se sugiere revisión prioritaria por parte del analista: la solicitud presenta un puntaje de afínidad de ${puntajeTotal}/100. La inversión proyectada se ubica en el ${diffInversionPct}% respecto al requerimiento mínimo de $${inversionMinima.toLocaleString()} USD y la generación de empleo se encuentra al ${diffEmpleosPct}% del objetivo de ${zonaFranca.nombre}.`;
  } else {
    if (!compatibleSector) {
      justificacion = `Solicitud rechazada automáticamente: El sector industrial '${sector}' no está dentro de los sectores permitidos para ${zonaFranca.nombre} (${sectoresPermitidos.join(', ')}). Además, los índices de inversión y empleo no compensan el descalce estratégico.`;
    } else {
      justificacion = `Solicitud rechazada automáticamente por insuficiencia de parámetros: La inversión proyectada ($${inversionProyectada.toLocaleString()} USD) se encuentra un ${Math.abs(diffInversionPct)}% por debajo del mínimo exigido ($${inversionMinima.toLocaleString()} USD) y los empleos proyectados son insuficientes.`;
    }
  }

  return {
    puntajeIA: puntajeTotal,
    clasificacionIA: clasificacion,
    justificacionIA: justificacion,
    desglose: {
      puntajeSector,
      puntajeInversion,
      puntajeEmpleos,
      ratioInversion,
      ratioEmpleos,
      compatibleSector
    }
  };
}
