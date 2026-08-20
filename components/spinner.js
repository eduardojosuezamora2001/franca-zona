/**
 * Componente Indicador de Carga (components/spinner.js)
 */

export function mostrarSpinner() {
  let spinner = document.getElementById('spinner-container');
  if (!spinner) {
    spinner = document.createElement('div');
    spinner.id = 'spinner-container';
    spinner.innerHTML = `<div class="spinner"></div>`;
    document.body.appendChild(spinner);
  }
  spinner.style.display = 'flex';
}

export function ocultarSpinner() {
  const spinner = document.getElementById('spinner-container');
  if (spinner) {
    spinner.style.display = 'none';
  }
}
