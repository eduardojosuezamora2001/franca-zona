/**
 * Controlador para Formulario de Nueva Solicitud (modulos/solicitudes/solicitud-nueva.js)
 */
import { renderNavbar } from '../../components/navbar.js';
import { obtenerZonasFrancas, crearSolicitud } from './solicitudes.service.js';
import { mostrarToast } from '../../components/toast.js';
import { obtenerSesion } from '../../shared/auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('#app-shell');

  const sesion = obtenerSesion();
  if (sesion.nombreEmpresa) {
    const inputNombre = document.getElementById('nombreEmpresa');
    if (inputNombre && !inputNombre.value) {
      inputNombre.value = sesion.nombreEmpresa;
    }
  }

  // Cargar combo de Zonas Francas
  const selectZF = document.getElementById('zonaFrancaId');
  try {
    const zonasFrancas = await obtenerZonasFrancas();
    zonasFrancas.forEach(zf => {
      const opt = document.createElement('option');
      opt.value = zf.id;
      opt.textContent = `${zf.nombre} (${zf.ubicacion}) — Inv. Mín: $${(zf.inversionMinima/1000000).toFixed(1)}M USD`;
      selectZF.appendChild(opt);
    });
  } catch (e) {
    mostrarToast('Error cargando la lista de Zonas Francas', 'error');
  }

  // Manejo de envío
  const form = document.getElementById('form-nueva-solicitud');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btnEnviar = document.getElementById('btn-enviar');
    btnEnviar.disabled = true;
    btnEnviar.textContent = '⏳ Evaluando con IA y registrando...';

    const datos = {
      nombreEmpresa: document.getElementById('nombreEmpresa').value.trim(),
      cedulaJuridica: document.getElementById('cedulaJuridica').value.trim(),
      sector: document.getElementById('sector').value,
      zonaFrancaId: document.getElementById('zonaFrancaId').value,
      inversionProyectada: document.getElementById('inversionProyectada').value,
      empleosProyectados: document.getElementById('empleosProyectados').value,
      descripcionProyecto: document.getElementById('descripcionProyecto').value.trim(),
      adjuntosSimulados: ['plan_inversion.pdf', 'estudio_factibilidad.pdf']
    };

    try {
      const nueva = await crearSolicitud(datos);
      mostrarToast(`¡Solicitud ${nueva.id} registrada exitosamente! Clasificación IA: ${nueva.clasificacionIA}`, 'success');
      setTimeout(() => {
        window.location.href = `/modulos/solicitudes/solicitud-detalle.html?id=${nueva.id}`;
      }, 1200);
    } catch (err) {
      mostrarToast(`Error al procesar la solicitud: ${err.message}`, 'error');
      btnEnviar.disabled = false;
      btnEnviar.textContent = '🚀 Enviar Solicitud y Evaluar con IA';
    }
  });
});
