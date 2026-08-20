/**
 * Componente de Navegación sensible al Rol (components/navbar.js)
 */
import { obtenerSesion, cambiarRol } from '../shared/auth.js';
import { renderSelectorTema } from './selector-tema.js';
import { renderSelectorIdioma } from './selector-idioma.js';
import { t, aplicarTraducciones } from '../shared/i18n.js';

const MENU_POR_ROL = {
  empresa: [
    { textoClave: 'nav.new_request', texto: 'Nueva solicitud', href: '/modulos/solicitudes/solicitud-nueva.html' },
    { textoClave: 'nav.my_requests', texto: 'Mis solicitudes', href: '/modulos/solicitudes/solicitud-historial.html' }
  ],
  analista: [
    { textoClave: 'nav.dashboard', texto: 'Dashboard solicitudes', href: '/modulos/solicitudes/dashboard-solicitudes.html' },
    { textoClave: 'nav.detail', texto: 'Detalle / Clasificación', href: '/modulos/solicitudes/solicitud-detalle.html?id=SOL-2026-001' }
  ],
  administrador: [
    { textoClave: 'nav.dashboard', texto: 'Dashboard solicitudes', href: '/modulos/solicitudes/dashboard-solicitudes.html' },
    { textoClave: 'nav.detail', texto: 'Detalle / Clasificación', href: '/modulos/solicitudes/solicitud-detalle.html?id=SOL-2026-001' }
  ]
};

export function renderNavbar(contenedorId = '#app-shell') {
  const sesion = obtenerSesion();
  const rolActual = sesion.rol;
  const items = MENU_POR_ROL[rolActual] || MENU_POR_ROL['analista'];
  const pathActual = window.location.pathname;

  const selectorTemaHtml = renderSelectorTema();
  const selectorIdiomaHtml = renderSelectorIdioma();

  const html = `
    <nav class="navbar" data-rol="${rolActual}">
      <div class="navbar__brand">
        <a href="/index.html" class="navbar__logo">
          🌐 ZoFranca CR
        </a>
        <span class="navbar__badge-rol">${rolActual}</span>
      </div>

      <ul class="navbar__links">
        ${items.map(item => {
          const isActive = pathActual.endsWith(item.href) || pathActual === item.href;
          return `<li><a href="${item.href}" class="${isActive ? 'active' : ''}" data-i18n="${item.textoClave}">${t(item.textoClave, item.texto)}</a></li>`;
        }).join('')}
      </ul>

      <div class="navbar__acciones">
        <div class="selector-rol-wrapper" title="Simular cambio de rol">
          <select id="selector-rol-select" class="navbar-select">
            <option value="empresa" ${rolActual === 'empresa' ? 'selected' : ''}>🏢 Empresa</option>
            <option value="analista" ${rolActual === 'analista' ? 'selected' : ''}>🔍 Analista</option>
            <option value="administrador" ${rolActual === 'administrador' ? 'selected' : ''}>⚙️ Admin</option>
          </select>
        </div>
        ${selectorTemaHtml}
        ${selectorIdiomaHtml}
        <button id="btn-logout" class="btn-logout" data-i18n="nav.logout">${t('nav.logout', 'Salir')}</button>
      </div>
    </nav>
  `;

  const contenedor = document.querySelector(contenedorId);
  if (contenedor) {
    contenedor.insertAdjacentHTML('afterbegin', html);
  }

  // Vincular eventos del navbar
  setTimeout(() => {
    // Evento selector de rol
    const rolSelect = document.getElementById('selector-rol-select');
    if (rolSelect) {
      rolSelect.addEventListener('change', (e) => {
        cambiarRol(e.target.value);
        // Redirigir al inicio o dashboard del nuevo rol
        if (e.target.value === 'empresa') {
          window.location.href = '/modulos/solicitudes/solicitud-nueva.html';
        } else {
          window.location.href = '/modulos/solicitudes/dashboard-solicitudes.html';
        }
      });
    }

    // Logout
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        window.location.href = '/index.html';
      });
    }

    // Aplicar i18n
    aplicarTraducciones();
  }, 0);
}
