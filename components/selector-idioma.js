/**
 * Componente Selector de Idioma (components/selector-idioma.js)
 */
import { obtenerIdiomaActual, cambiarIdioma } from '../shared/i18n.js';

export function renderSelectorIdioma() {
  const idiomaActual = obtenerIdiomaActual();

  const html = `
    <select id="selector-idioma-select" class="navbar-select" title="Seleccionar Idioma">
      <option value="es" ${idiomaActual === 'es' ? 'selected' : ''}>ES</option>
      <option value="en" ${idiomaActual === 'en' ? 'selected' : ''}>EN</option>
      <option value="fr" ${idiomaActual === 'fr' ? 'selected' : ''}>FR</option>
    </select>
  `;

  setTimeout(() => {
    const select = document.getElementById('selector-idioma-select');
    if (select) {
      select.addEventListener('change', (e) => {
        cambiarIdioma(e.target.value);
      });
    }
  }, 0);

  return html;
}
