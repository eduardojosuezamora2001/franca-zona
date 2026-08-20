/**
 * Componente Selector de Tema (components/selector-tema.js)
 */
import { t } from '../shared/i18n.js';

const KEY_TEMA = 'zofranca_tema';

export function obtenerTemaActual() {
  return localStorage.getItem(KEY_TEMA) || 'claro';
}

export function aplicarTema(tema) {
  document.documentElement.setAttribute('data-tema', tema);
  localStorage.setItem(KEY_TEMA, tema);
}

export function renderSelectorTema() {
  const temaActual = obtenerTemaActual();
  aplicarTema(temaActual);

  const html = `
    <select id="selector-tema-select" class="navbar-select" title="Seleccionar Tema">
      <option value="claro" ${temaActual === 'claro' ? 'selected' : ''}>☀️ ${t('theme.light', 'Claro')}</option>
      <option value="oscuro" ${temaActual === 'oscuro' ? 'selected' : ''}>🌙 ${t('theme.dark', 'Oscuro')}</option>
      <option value="institucional" ${temaActual === 'institucional' ? 'selected' : ''}>🏛️ ${t('theme.institutional', 'Institucional')}</option>
      <option value="alto-contraste" ${temaActual === 'alto-contraste' ? 'selected' : ''}>👁️ ${t('theme.high_contrast', 'Alto Contraste')}</option>
    </select>
  `;

  setTimeout(() => {
    const select = document.getElementById('selector-tema-select');
    if (select) {
      select.addEventListener('change', (e) => {
        aplicarTema(e.target.value);
      });
    }
  }, 0);

  return html;
}
