export function Modal({ title, children, onClose }) {
  return `
    <div class="modal-overlay" id="modal">
      <div class="modal">
        <div class="modal-header">
          <h3>${escapeHtml(title)}</h3>
          <button class="modal-close" id="modal-close">&times;</button>
        </div>
        <div class="modal-body">${children}</div>
      </div>
    </div>
  `;
}

export function attachModalEvents(onClose) {
  const closeBtn = document.getElementById('modal-close');
  const overlay = document.getElementById('modal');
  
  const handleClose = () => {
    overlay?.remove();
    onClose?.();
  };
  
  closeBtn?.addEventListener('click', handleClose);
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) handleClose();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('modal')) {
      handleClose();
    }
  }, { once: true });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
