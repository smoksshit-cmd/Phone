/**
 * DragHelper — перетаскивание телефона
 * Позволяет двигать окно телефона по экрану
 */

if (typeof window.DragHelper === 'undefined') {
  class DragHelper {
    constructor() {
      this.dragging = false;
      this.offsetX = 0;
      this.offsetY = 0;
      this.target = null;
    }

    /**
     * Привязывает перетаскивание к элементу-ручке (handle) на целевом блоке (target)
     */
    bind(handle, target) {
      this.target = target;

      handle.addEventListener('mousedown', (e) => this.startDrag(e));
      handle.addEventListener('touchstart', (e) => this.startDragTouch(e), { passive: false });

      document.addEventListener('mousemove', (e) => this.onDrag(e));
      document.addEventListener('mouseup', () => this.stopDrag());
      document.addEventListener('touchmove', (e) => this.onDragTouch(e), { passive: false });
      document.addEventListener('touchend', () => this.stopDrag());
    }

    startDrag(e) {
      if (!this.target) return;
      this.dragging = true;
      const rect = this.target.getBoundingClientRect();
      this.offsetX = e.clientX - rect.left;
      this.offsetY = e.clientY - rect.top;
      this.target.style.transition = 'none';
      e.preventDefault();
    }

    startDragTouch(e) {
      if (!this.target || e.touches.length !== 1) return;
      this.dragging = true;
      const rect = this.target.getBoundingClientRect();
      this.offsetX = e.touches[0].clientX - rect.left;
      this.offsetY = e.touches[0].clientY - rect.top;
      this.target.style.transition = 'none';
    }

    onDrag(e) {
      if (!this.dragging || !this.target) return;
      this.moveTo(e.clientX, e.clientY);
    }

    onDragTouch(e) {
      if (!this.dragging || !this.target || e.touches.length !== 1) return;
      this.moveTo(e.touches[0].clientX, e.touches[0].clientY);
      e.preventDefault();
    }

    moveTo(clientX, clientY) {
      const x = clientX - this.offsetX;
      const y = clientY - this.offsetY;
      const maxX = window.innerWidth - (this.target.offsetWidth || 390);
      const maxY = window.innerHeight - (this.target.offsetHeight || 844);
      this.target.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
      this.target.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
      this.target.style.right = 'auto';
      this.target.style.bottom = 'auto';
      this.target.style.transform = 'none';
    }

    stopDrag() {
      this.dragging = false;
      if (this.target) this.target.style.transition = '';
    }
  }

  window.DragHelper = DragHelper;
  console.log('[DragHelper] ✅ Загружен');
}
