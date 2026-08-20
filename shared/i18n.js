/**
 * Servicio de Internacionalización i18n (shared/i18n.js)
 */

import esDict from './i18n/es.json';
import enDict from './i18n/en.json';
import frDict from './i18n/fr.json';

const DICCIONARIOS = {
  es: esDict,
  en: enDict,
  fr: frDict
};

const KEY_IDIOMA = 'zofranca_idioma';

export function obtenerIdiomaActual() {
  return localStorage.getItem(KEY_IDIOMA) || 'es';
}

export function cambiarIdioma(nuevoIdioma) {
  if (!DICCIONARIOS[nuevoIdioma]) return;
  localStorage.setItem(KEY_IDIOMA, nuevoIdioma);
  aplicarTraducciones();
  window.dispatchEvent(new CustomEvent('zofranca:cambio-idioma', { detail: nuevoIdioma }));
}

export function t(clave, fallback = '') {
  const lang = obtenerIdiomaActual();
  const dict = DICCIONARIOS[lang] || DICCIONARIOS['es'];
  return dict[clave] || fallback || clave;
}

export function aplicarTraducciones() {
  const lang = obtenerIdiomaActual();
  const dict = DICCIONARIOS[lang] || DICCIONARIOS['es'];

  document.querySelectorAll('[data-i18n]').forEach(element => {
    const clave = element.getAttribute('data-i18n');
    if (dict[clave]) {
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        if (element.hasAttribute('placeholder')) {
          element.placeholder = dict[clave];
        } else {
          element.value = dict[clave];
        }
      } else {
        element.textContent = dict[clave];
      }
    }
  });
}
