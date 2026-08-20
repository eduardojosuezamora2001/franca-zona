/**
 * Componente Notificaciones Toast (components/toast.js)
 */

export function mostrarToast(mensaje, tipo = 'info', duracion = 4000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast--${tipo}`;
  
  let icon = 'ℹ️';
  if (tipo === 'success') icon = '✅';
  if (tipo === 'error') icon = '⚠️';

  toast.innerHTML = `<span>${icon}</span> <span>${mensaje}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duracion);
}
