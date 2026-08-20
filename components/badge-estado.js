/**
 * Componente Badge de Estado (components/badge-estado.js)
 */
import { t } from '../shared/i18n.js';

export function renderBadgeEstado(estado) {
  let claseEstado = 'recomendada';
  let claveI18n = 'status.recommended';

  if (estado === 'Revisar') {
    claseEstado = 'revisar';
    claveI18n = 'status.review';
  } else if (estado === 'Rechazada') {
    claseEstado = 'rechazada';
    claveI18n = 'status.rejected';
  } else if (estado === 'Pendiente') {
    claseEstado = 'revisar';
    claveI18n = 'status.pending';
  }

  const texto = t(claveI18n, estado);
  return `<span class="badge-estado badge-estado--${claseEstado}" data-i18n="${claveI18n}">${texto}</span>`;
}
