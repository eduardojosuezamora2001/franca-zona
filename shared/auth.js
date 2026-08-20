/**
 * Modulo de Autenticación y Sesión Simulada (shared/auth.js)
 */

const KEY_SESION = 'zofranca_sesion';

const USUARIO_DEFECTO = {
  rol: 'analista', // empresa | analista | administrador
  nombre: 'Carlos Rodríguez',
  empresaId: 'emp-101',
  nombreEmpresa: 'BioMed Solutions CR S.A.'
};

export function obtenerSesion() {
  const guardado = localStorage.getItem(KEY_SESION);
  if (!guardado) {
    guardarSesion(USUARIO_DEFECTO);
    return USUARIO_DEFECTO;
  }
  try {
    return JSON.parse(guardado);
  } catch (e) {
    return USUARIO_DEFECTO;
  }
}

export function guardarSesion(sesion) {
  localStorage.setItem(KEY_SESION, JSON.stringify(sesion));
  // Disparar evento para componentes que escuchen cambio de sesión
  window.dispatchEvent(new CustomEvent('zofranca:cambio-sesion', { detail: sesion }));
}

export function cambiarRol(nuevoRol) {
  const sesionActual = obtenerSesion();
  sesionActual.rol = nuevoRol;
  if (nuevoRol === 'empresa' && !sesionActual.empresaId) {
    sesionActual.empresaId = 'emp-101';
    sesionActual.nombreEmpresa = 'BioMed Solutions CR S.A.';
  }
  guardarSesion(sesionActual);
}
