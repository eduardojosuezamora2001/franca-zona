/**
 * Componente Modal Reutilizable (components/modal.js)
 */

export function crearModal({ titulo, contenidoHtml, textoConfirmar = 'Confirmar', textoCancelar = 'Cancelar', onConfirmar }) {
  // Eliminar modales previos
  const anterior = document.getElementById('modal-dinamico');
  if (anterior) anterior.remove();

  const modal = document.createElement('div');
  modal.id = 'modal-dinamico';
  modal.className = 'modal-backdrop';

  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>${titulo}</h3>
        <button id="btn-modal-close" style="background:none; border:none; font-size:1.2rem; cursor:pointer; color:var(--color-texto);">&times;</button>
      </div>
      <div class="modal-body">
        ${contenidoHtml}
      </div>
      <div class="modal-footer">
        <button id="btn-modal-cancelar" class="btn btn-secondary">${textoCancelar}</button>
        <button id="btn-modal-confirmar" class="btn btn-primary">${textoConfirmar}</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  setTimeout(() => modal.classList.add('active'), 10);

  const cerrar = () => {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 200);
  };

  document.getElementById('btn-modal-close').addEventListener('click', cerrar);
  document.getElementById('btn-modal-cancelar').addEventListener('click', cerrar);
  document.getElementById('btn-modal-confirmar').addEventListener('click', async () => {
    if (onConfirmar) {
      await onConfirmar();
    }
    cerrar();
  });
}
