/**
 * Controlador para la Gestión de Zonas Francas (modulos/admin/admin-zonas-francas.js)
 * Satisface RF-01.
 */
import { renderNavbar } from '../../components/navbar.js';
import { obtenerZonasFrancas, registrarZonaFranca } from './admin.service.js';
import { mostrarToast } from '../../components/toast.js';

document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('#app-shell');
  await cargarZonasFrancas();

  const form = document.getElementById('form-nueva-zf');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
      nombre: document.getElementById('zf-nombre').value.trim(),
      ubicacion: document.getElementById('zf-ubicacion').value.trim(),
      inversionMinima: document.getElementById('zf-inversion').value,
      empleosMinimos: document.getElementById('zf-empleos').value,
      sectoresPermitidos: document.getElementById('zf-sectores').value
    };

    try {
      const creada = await registrarZonaFranca(datos);
      mostrarToast(`¡Zona Franca "${creada.nombre}" registrada con éxito!`, 'success');
      form.reset();
      await cargarZonasFrancas();
    } catch (err) {
      mostrarToast(`Error registrando Zona Franca: ${err.message}`, 'error');
    }
  });
});

async function cargarZonasFrancas() {
  const contenedor = document.getElementById('contenedor-lista-zf');
  try {
    const zonas = await obtenerZonasFrancas();

    if (!zonas || zonas.length === 0) {
      contenedor.innerHTML = '<p style="color: var(--color-texto-secundario);">No hay zonas francas registradas.</p>';
      return;
    }

    const html = zonas.map(z => {
      const invFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(z.inversionMinima);
      return `
        <div style="background-color: var(--color-superficie-elevada); border: var(--grosor-borde) solid var(--color-borde); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <h4 style="font-size: 1.05rem;">${z.nombre}</h4>
            <span class="badge-estado badge-estado--recomendada">${z.ubicacion}</span>
          </div>
          <div style="font-size: 0.875rem; margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.25rem;">
            <div>💰 <strong>Inversión Mínima:</strong> ${invFormatted}</div>
            <div>👥 <strong>Empleos Mínimos:</strong> ${z.empleosMinimos} puestos</div>
            <div>🏭 <strong>Sectores Permitidos:</strong> ${z.sectoresPermitidos ? z.sectoresPermitidos.join(', ') : 'Todos'}</div>
          </div>
        </div>
      `;
    }).join('');

    contenedor.innerHTML = html;
  } catch (err) {
    contenedor.innerHTML = `<p style="color: var(--estado-rechazada-texto);">Error cargando lista: ${err.message}</p>`;
  }
}
