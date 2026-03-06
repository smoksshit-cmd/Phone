/**
 * Image Config Modal - ...
 * ...ПользовательАватар...Сообщения...
 */

if (typeof window.ImageConfigModal === 'undefined') {
  class ImageConfigModal {
    constructor() {
      this.isVisible = false;
      this.currentTab = 'avatar'; // 'avatar' ... 'background'
      this.modalElement = null;
      this.currentConfig = {
        avatar: {
          image: '',
          position: { x: 50, y: 50 }, // ...
          rotation: 0,
          scale: 1,
        },
        background: {
          image: '',
          position: { x: 50, y: 50 },
          rotation: 0,
          scale: 1,
        },
      };

      this.isDragging = false;
      this.dragStartPos = { x: 0, y: 0 };
      this.dragStartImagePos = { x: 0, y: 0 };

      console.log('[Image Config Modal] ...');
    }

    show() {
      console.log('[Image Config Modal] ...');

      this.loadCurrentConfig();

      // HTML
      this.createModal();

      this.bindEvents();

      this.isVisible = true;
      this.modalElement.style.display = 'flex';

      setTimeout(() => {
        this.modalElement.classList.add('show');
      }, 10);

      this.updatePreview();
    }

    hide() {
      console.log('[Image Config Modal] ...');

      if (!this.modalElement) return;

      this.cleanupDragEvents();

      this.modalElement.classList.remove('show');

      setTimeout(() => {
        if (this.modalElement && this.modalElement.parentNode) {
          this.modalElement.parentNode.removeChild(this.modalElement);
        }
        this.modalElement = null;
        this.isVisible = false;
      }, 300);
    }

    // HTML
    createModal() {
      const existingModal = document.querySelector('.image-config-modal');
      if (existingModal) {
        existingModal.remove();
      }

      this.modalElement = document.createElement('div');
      this.modalElement.className = 'image-config-modal';
      this.modalElement.innerHTML = this.getModalHTML();

      // ，
      const phoneContainer =
        document.querySelector('#mobile-phone-container .mobile-phone-frame') ||
        document.querySelector('.mobile-phone-frame') ||
        document.querySelector('#mobile-phone-container') ||
        document.querySelector('.mobile-phone-container');

      if (phoneContainer) {
        const computedStyle = getComputedStyle(phoneContainer);
        if (computedStyle.position === 'static') {
          phoneContainer.style.position = 'relative';
        }
        phoneContainer.appendChild(this.modalElement);
        console.log('[Image Config Modal] ...:', phoneContainer.className || phoneContainer.id);
      } else {
        // Если，bodyfixed
        console.warn('[Image Config Modal] error，errorbodyerror');
        this.modalElement.style.position = 'fixed';
        document.body.appendChild(this.modalElement);
      }
    }

    // HTML
    getModalHTML() {
      return `
        <div class="modal-backdrop"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">...Настройки</h3>
            <button class="modal-close-btn" type="button">✕</button>
          </div>
          
          <div class="modal-tabs">
            <button class="tab-btn ${this.currentTab === 'avatar' ? 'active' : ''}" data-tab="avatar">
              ПользовательАватар
            </button>
            <button class="tab-btn ${this.currentTab === 'background' ? 'active' : ''}" data-tab="background">
              Сообщения...
            </button>
          </div>
          
          <div class="modal-body">
            <div class="tab-content" data-tab="avatar" style="display: ${
              this.currentTab === 'avatar' ? 'block' : 'none'
            }">
              ${this.getAvatarTabHTML()}
            </div>
            <div class="tab-content" data-tab="background" style="display: ${
              this.currentTab === 'background' ? 'block' : 'none'
            }">
              ${this.getBackgroundTabHTML()}
            </div>
          </div>
          
          <div class="modal-footer">
            <button class="save-btn" type="button">СохранитьНастройки</button>
          </div>
        </div>
      `;
    }

    // АватарHTML
    getAvatarTabHTML() {
      return `
        <div class="config-section">
          <div class="upload-section">
            <div class="upload-controls">
              <input type="file" id="avatar-file-input" accept="image/*" style="display: none;">
              <button class="upload-btn" data-target="avatar-file-input">...</button>
              <input type="url" class="url-input" placeholder="......" data-type="avatar">
            </div>
          </div>
          
          <div class="preview-section">
            <div class="preview-container avatar-preview">
              <div class="preview-image" id="avatar-preview"></div>
              <div class="drag-hint">...</div>
            </div>
          </div>
          
          <div class="controls-section">
            <div class="control-row">
              <label>...:</label>
              <input type="range" class="control-slider" min="0" max="360" step="1" value="0" data-type="avatar" data-property="rotation">
              <span class="control-value">0°</span>
            </div>
            <div class="control-row">
              <label>...:</label>
              <input type="range" class="control-slider" min="0.5" max="2" step="0.1" value="1" data-type="avatar" data-property="scale">
              <span class="control-value">1.0x</span>
            </div>
          </div>
        </div>
      `;
    }

    // HTML
    getBackgroundTabHTML() {
      return `
        <div class="config-section">
          <div class="upload-section">
            <div class="upload-controls">
              <input type="file" id="background-file-input" accept="image/*" style="display: none;">
              <button class="upload-btn" data-target="background-file-input">...</button>
              <input type="url" class="url-input" placeholder="......" data-type="background">
            </div>
          </div>
          
          <div class="preview-section">
            <div class="preview-container background-preview">
              <div class="preview-image" id="background-preview"></div>
              <div class="drag-hint">...</div>
            </div>
          </div>
          
          <div class="controls-section">
            <div class="control-row">
              <label>...:</label>
              <input type="range" class="control-slider" min="0" max="360" step="1" value="0" data-type="background" data-property="rotation">
              <span class="control-value">0°</span>
            </div>
            <div class="control-row">
              <label>...:</label>
              <input type="range" class="control-slider" min="0.5" max="2" step="0.1" value="1" data-type="background" data-property="scale">
              <span class="control-value">1.0x</span>
            </div>
          </div>
        </div>
      `;
    }

    loadCurrentConfig() {
      if (window.styleConfigManager && window.styleConfigManager.isReady) {
        const config = window.styleConfigManager.getConfig();

        // ПользовательАватар
        if (config.messageSentAvatar) {
          this.currentConfig.avatar = {
            image: config.messageSentAvatar.backgroundImage || config.messageSentAvatar.backgroundImageUrl || '',
            position: this.parseBackgroundPosition(config.messageSentAvatar.backgroundPosition || 'center center'),
            rotation: parseFloat(config.messageSentAvatar.rotation || 0),
            scale: parseFloat(config.messageSentAvatar.scale || 1),
          };
        }

        // Сообщения
        if (config.messagesApp) {
          this.currentConfig.background = {
            image: config.messagesApp.backgroundImage || config.messagesApp.backgroundImageUrl || '',
            position: this.parseBackgroundPosition(config.messagesApp.backgroundPosition || 'center center'),
            rotation: parseFloat(config.messagesApp.rotation || 0),
            scale: parseFloat(config.messagesApp.scale || 1),
          };
        }

        console.log('[Image Config Modal] ...:', this.currentConfig);
      }
    }

    // CSS background-position
    parseBackgroundPosition(positionStr) {
      const parts = positionStr.split(' ');
      let x = 50,
        y = 50;

      if (parts.length >= 2) {
        if (parts[0].includes('%')) {
          x = parseFloat(parts[0]);
        } else if (parts[0] === 'left') {
          x = 0;
        } else if (parts[0] === 'right') {
          x = 100;
        } else if (parts[0] === 'center') {
          x = 50;
        }

        if (parts[1].includes('%')) {
          y = parseFloat(parts[1]);
        } else if (parts[1] === 'top') {
          y = 0;
        } else if (parts[1] === 'bottom') {
          y = 100;
        } else if (parts[1] === 'center') {
          y = 50;
        }
      }

      return { x, y };
    }

    // CSS background-position
    formatBackgroundPosition(position) {
      return `${position.x}% ${position.y}%`;
    }

    switchTab(tabName) {
      console.log(`[Image Config Modal] ...: ${tabName}`);

      this.currentTab = tabName;

      // Статус
      const tabBtns = this.modalElement.querySelectorAll('.tab-btn');
      tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
      });

      const tabContents = this.modalElement.querySelectorAll('.tab-content');
      tabContents.forEach(content => {
        content.style.display = content.dataset.tab === tabName ? 'block' : 'none';
      });

      this.updatePreview();
    }

    updatePreview() {
      const config = this.currentConfig[this.currentTab];
      const previewElement = this.modalElement.querySelector(`#${this.currentTab}-preview`);

      if (!previewElement || !config.image) return;

      const backgroundPosition = this.formatBackgroundPosition(config.position);

      previewElement.style.backgroundImage = `url(${config.image})`;
      previewElement.style.backgroundPosition = backgroundPosition;
      previewElement.style.backgroundRepeat = 'no-repeat';

      // CSS
      if (this.currentTab === 'avatar') {
        // Аватар：background-size，transform
        previewElement.style.backgroundSize = `${config.scale * 100}%`;
        previewElement.style.transform = `rotate(${config.rotation}deg)`;
      } else {
        // ：transform
        previewElement.style.backgroundSize = 'cover';
        previewElement.style.transform = `rotate(${config.rotation}deg) scale(${config.scale})`;
      }

      this.updateControlValues();

      // URL/* Поле ввода */
      this.updateUrlInput();

      console.log(`[Image Config Modal] ...${this.currentTab}...:`, {
        image: config.image.substring(0, 50) + '...',
        position: backgroundPosition,
        transform,
      });
    }

    // URL/* Поле ввода */
    updateUrlInput() {
      if (!this.modalElement) return;

      const config = this.currentConfig[this.currentTab];
      const urlInput = this.modalElement.querySelector(`[data-type="${this.currentTab}"].url-input`);

      if (urlInput && config.image && !config.image.startsWith('data:')) {
        urlInput.value = config.image;
      }
    }

    updateControlValues() {
      if (!this.modalElement) return;

      const config = this.currentConfig[this.currentTab];

      const rotationSlider = this.modalElement.querySelector(
        `[data-type="${this.currentTab}"][data-property="rotation"]`,
      );
      const rotationRow = rotationSlider?.closest('.control-row');
      const rotationValue = rotationRow?.querySelector('.control-value');
      if (rotationSlider && rotationValue) {
        rotationSlider.value = config.rotation;
        rotationValue.textContent = `${config.rotation}°`;
      }

      const scaleSlider = this.modalElement.querySelector(`[data-type="${this.currentTab}"][data-property="scale"]`);
      const scaleRow = scaleSlider?.closest('.control-row');
      const scaleValue = scaleRow?.querySelector('.control-value');
      if (scaleSlider && scaleValue) {
        scaleSlider.value = config.scale;
        scaleValue.textContent = `${config.scale.toFixed(1)}x`;
      }
    }

    bindEvents() {
      if (!this.modalElement) return;

      // Закрыть
      const closeBtn = this.modalElement.querySelector('.modal-close-btn');
      closeBtn?.addEventListener('click', () => this.hide());

      // Закрыть
      const backdrop = this.modalElement.querySelector('.modal-backdrop');
      backdrop?.addEventListener('click', () => this.hide());

      const tabBtns = this.modalElement.querySelectorAll('.tab-btn');
      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
      });

      // Загрузить
      this.bindFileUploadEvents();

      // URL
      this.bindUrlInputEvents();

      this.bindDragEvents();

      this.bindControlEvents();

      // Сохранить
      const saveBtn = this.modalElement.querySelector('.save-btn');
      saveBtn?.addEventListener('click', () => this.saveConfig());
    }

    // Загрузить
    bindFileUploadEvents() {
      const fileInputs = this.modalElement.querySelectorAll('input[type="file"]');
      const uploadBtns = this.modalElement.querySelectorAll('.upload-btn');

      uploadBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetId = btn.dataset.target;
          const fileInput = document.getElementById(targetId);
          fileInput?.click();
        });
      });

      fileInputs.forEach(input => {
        input.addEventListener('change', e => this.handleFileUpload(e));
      });
    }

    // URL
    bindUrlInputEvents() {
      const urlInputs = this.modalElement.querySelectorAll('.url-input');
      urlInputs.forEach(input => {
        input.addEventListener('input', e => this.handleUrlInput(e));
        input.addEventListener('paste', e => {
          setTimeout(() => this.handleUrlInput(e), 10);
        });
      });
    }

    // Загрузить
    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      console.log(`[Image Config Modal] ...Загрузить:`, file.name);

      try {
        // ЗагрузитьData Bank
        let imageUrl = '';
        if (window.styleConfigManager && typeof window.styleConfigManager.uploadImageToDataBank === 'function') {
          imageUrl = await window.styleConfigManager.uploadImageToDataBank(file);
        }

        // ЕслиЗагрузить，Base64
        if (!imageUrl) {
          imageUrl = await this.fileToBase64(file);
        }

        this.currentConfig[this.currentTab].image = imageUrl;

        this.updatePreview();

        console.log(`[Image Config Modal] ...Загрузить...`);
      } catch (error) {
        console.error('[Image Config Modal] errorЗагрузитьerror:', error);
        if (window.MobilePhone && window.MobilePhone.showToast) {
          window.MobilePhone.showToast('...Загрузить...', 'error');
        }
      }
    }

    // URL
    handleUrlInput(event) {
      const url = event.target.value.trim();
      const type = event.target.dataset.type;

      if (url && this.isValidImageUrl(url)) {
        console.log(`[Image Config Modal] Настройки${type}...URL:`, url);
        this.currentConfig[type].image = url;
        this.updatePreview();
      }
    }

    // URL
    isValidImageUrl(url) {
      try {
        new URL(url);
        return /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url) || url.startsWith('data:image/');
      } catch {
        return url.startsWith('data:image/');
      }
    }

    // Base64
    fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    bindDragEvents() {
      const previewContainers = this.modalElement.querySelectorAll('.preview-container');

      previewContainers.forEach(container => {
        container.addEventListener('mousedown', e => this.startDrag(e, container));

        container.addEventListener('touchstart', e => this.startDrag(e, container), { passive: false });

        container.addEventListener('dragstart', e => e.preventDefault());
      });

      // （document）
      this.dragMoveHandler = e => this.handleDrag(e);
      this.dragEndHandler = () => this.endDrag();

      document.addEventListener('mousemove', this.dragMoveHandler);
      document.addEventListener('mouseup', this.dragEndHandler);
      document.addEventListener('touchmove', this.dragMoveHandler, { passive: false });
      document.addEventListener('touchend', this.dragEndHandler);
    }

    cleanupDragEvents() {
      if (this.dragMoveHandler) {
        document.removeEventListener('mousemove', this.dragMoveHandler);
        document.removeEventListener('touchmove', this.dragMoveHandler);
      }
      if (this.dragEndHandler) {
        document.removeEventListener('mouseup', this.dragEndHandler);
        document.removeEventListener('touchend', this.dragEndHandler);
      }
    }

    startDrag(event, container) {
      event.preventDefault();

      this.isDragging = true;
      this.dragContainer = container;

      const rect = container.getBoundingClientRect();
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;

      this.dragStartPos = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };

      this.dragStartImagePos = { ...this.currentConfig[this.currentTab].position };

      container.style.cursor = 'grabbing';
      console.log('[Image Config Modal] ...');
    }

    handleDrag(event) {
      if (!this.isDragging || !this.dragContainer) return;

      event.preventDefault();

      const rect = this.dragContainer.getBoundingClientRect();
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;

      // （）
      const currentX = ((clientX - rect.left) / rect.width) * 100;
      const currentY = ((clientY - rect.top) / rect.height) * 100;

      // （）
      const startX = (this.dragStartPos.x / rect.width) * 100;
      const startY = (this.dragStartPos.y / rect.height) * 100;

      const deltaX = currentX - startX;
      const deltaY = currentY - startY;

      // （：background-position）
      // = = background-position X
      // = = background-position Y
      const newX = Math.max(0, Math.min(100, this.dragStartImagePos.x - deltaX));
      const newY = Math.max(0, Math.min(100, this.dragStartImagePos.y - deltaY));

      this.currentConfig[this.currentTab].position = { x: newX, y: newY };

      // （，）
      const previewElement = this.modalElement.querySelector(`#${this.currentTab}-preview`);
      if (previewElement) {
        previewElement.style.backgroundPosition = this.formatBackgroundPosition({ x: newX, y: newY });
      }
    }

    endDrag() {
      if (this.isDragging) {
        this.isDragging = false;
        if (this.dragContainer) {
          this.dragContainer.style.cursor = 'grab';
          this.dragContainer = null;
        }
        console.log('[Image Config Modal] ...');
      }
    }

    bindControlEvents() {
      const sliders = this.modalElement.querySelectorAll('.control-slider');

      sliders.forEach(slider => {
        slider.addEventListener('input', e => this.handleControlChange(e));
      });
    }

    handleControlChange(event) {
      const type = event.target.dataset.type;
      const property = event.target.dataset.property;
      const value = parseFloat(event.target.value);

      if (type && property) {
        this.currentConfig[type][property] = value;

        const valueSpan = event.target.parentNode.querySelector('.control-value');
        if (valueSpan) {
          if (property === 'rotation') {
            valueSpan.textContent = `${value}°`;
          } else if (property === 'scale') {
            valueSpan.textContent = `${value.toFixed(1)}x`;
          }
        }

        this.updatePreview();

        console.log(`[Image Config Modal] ...${type}...${property}:`, value);
      }
    }

    // Сохранить
    async saveConfig() {
      console.log('[Image Config Modal] Сохранить...');

      if (!window.styleConfigManager || !window.styleConfigManager.isReady) {
        console.error('[Image Config Modal] StyleConfigManagererror');
        if (window.MobilePhone && window.MobilePhone.showToast) {
          window.MobilePhone.showToast('...', 'error');
        }
        return;
      }

      try {
        const config = JSON.parse(JSON.stringify(window.styleConfigManager.currentConfig));

        // ПользовательАватар
        if (this.currentConfig.avatar.image) {
          if (!config.messageSentAvatar) {
            config.messageSentAvatar = {
              backgroundImage: '',
              backgroundImageUrl: '',
              backgroundPosition: 'center center',
              rotation: '0',
              scale: '1',
              description: '...СообщенияАватар...',
            };
          }

          config.messageSentAvatar.backgroundImage = this.currentConfig.avatar.image.startsWith('data:')
            ? this.currentConfig.avatar.image
            : '';
          config.messageSentAvatar.backgroundImageUrl = !this.currentConfig.avatar.image.startsWith('data:')
            ? this.currentConfig.avatar.image
            : '';
          config.messageSentAvatar.backgroundPosition = this.formatBackgroundPosition(
            this.currentConfig.avatar.position,
          );
          config.messageSentAvatar.rotation = this.currentConfig.avatar.rotation.toString();
          config.messageSentAvatar.scale = this.currentConfig.avatar.scale.toString();
        }

        // Сообщения
        if (this.currentConfig.background.image) {
          if (!config.messagesApp) {
            config.messagesApp = {
              backgroundImage: '',
              backgroundImageUrl: '',
              backgroundPosition: 'center center',
              rotation: '0',
              scale: '1',
              description: 'Сообщения/* Приложение */...',
            };
          }

          config.messagesApp.backgroundImage = this.currentConfig.background.image.startsWith('data:')
            ? this.currentConfig.background.image
            : '';
          config.messagesApp.backgroundImageUrl = !this.currentConfig.background.image.startsWith('data:')
            ? this.currentConfig.background.image
            : '';
          config.messagesApp.backgroundPosition = this.formatBackgroundPosition(this.currentConfig.background.position);
          config.messagesApp.rotation = this.currentConfig.background.rotation.toString();
          config.messagesApp.scale = this.currentConfig.background.scale.toString();
        }

        // StyleConfigManager
        window.styleConfigManager.currentConfig = config;

        // Сохранить
        const success = await window.styleConfigManager.saveConfig();

        if (success) {
          console.log('[Image Config Modal] ...Сохранить...');
          if (window.MobilePhone && window.MobilePhone.showToast) {
            window.MobilePhone.showToast('Настройки...Сохранить', 'success');
          }
          this.hide();
        } else {
          throw new Error('Сохранитьerror');
        }
      } catch (error) {
        console.error('[Image Config Modal] Сохранитьerror:', error);
        if (window.MobilePhone && window.MobilePhone.showToast) {
          window.MobilePhone.showToast('Сохранить...，...', 'error');
        }
      }
    }
  }

  // Сохранить，
  window.ImageConfigModalClass = ImageConfigModal;
  window.ImageConfigModal = new ImageConfigModal();

  console.log('[Image Config Modal] ...');
}

// ДрузьяОК
(function () {
  console.log('[Friend Image Config Modal] ......');
  console.log('[Friend Image Config Modal] ImageConfigModalClass...:', typeof window.ImageConfigModalClass);
  console.log('[Friend Image Config Modal] ImageConfigModal...:', typeof window.ImageConfigModal);
  console.log('[Friend Image Config Modal] FriendImageConfigModal...:', typeof window.FriendImageConfigModal);

  // Друзья
  if (typeof window.ImageConfigModalClass !== 'undefined' && typeof window.FriendImageConfigModal === 'undefined') {
    console.log('[Friend Image Config Modal] ...Друзья...，...:', typeof window.ImageConfigModalClass);

    class FriendImageConfigModal extends window.ImageConfigModalClass {
      constructor() {
        super(); // ...

        // Друзья
        this.currentFriendId = null;
        this.currentFriendName = null;

        console.log('[Friend Image Config Modal] Друзья...');
      }

      show(friendId, friendName) {
        console.log('[Friend Image Config Modal] ...:', friendId, friendName);
        console.log('[Friend Image Config Modal] ДрузьяID...:', typeof friendId);
        console.log('[Friend Image Config Modal] Друзья...:', typeof friendName);

        this.currentFriendId = friendId;
        this.currentFriendName = friendName;

        console.log('[Friend Image Config Modal] Настройки...ДрузьяID:', this.currentFriendId);
        console.log('[Friend Image Config Modal] Настройки...Друзья...:', this.currentFriendName);

        // Друзья
        this.loadFriendConfig();

        // HTML
        this.createModal();

        this.bindEvents();

        this.isVisible = true;
        this.modalElement.style.display = 'flex';

        setTimeout(() => {
          this.modalElement.classList.add('show');
        }, 10);

        this.updatePreview();
      }

      hide() {
        console.log('[Friend Image Config Modal] ...');

        if (!this.modalElement) return;

        this.cleanupDragEvents();

        this.modalElement.classList.remove('show');

        setTimeout(() => {
          if (this.modalElement && this.modalElement.parentNode) {
            this.modalElement.parentNode.removeChild(this.modalElement);
          }
          this.modalElement = null;
          this.isVisible = false;
        }, 300);
      }

      // Друзья
      loadFriendConfig() {
        if (!window.styleConfigManager || !window.styleConfigManager.isReady) {
          console.warn('[Friend Image Config Modal] StyleConfigManagererror');
          return;
        }

        const config = window.styleConfigManager.getConfig();
        console.log('[Friend Image Config Modal] ...，ДрузьяID:', this.currentFriendId);
        console.log('[Friend Image Config Modal] ...:', config);

        // ДрузьяАватар
        if (config.messageReceivedAvatars) {
          console.log('[Friend Image Config Modal] messageReceivedAvatars...:', config.messageReceivedAvatars);
          const friendAvatar = config.messageReceivedAvatars.find(avatar => avatar.friendId === this.currentFriendId);
          console.log('[Friend Image Config Modal] ...ДрузьяАватар...:', friendAvatar);

          if (friendAvatar) {
            this.currentConfig.avatar = {
              image: friendAvatar.backgroundImage || friendAvatar.backgroundImageUrl || '',
              position: this.parseBackgroundPosition(friendAvatar.backgroundPosition || 'center center'),
              rotation: parseFloat(friendAvatar.rotation || 0),
              scale: parseFloat(friendAvatar.scale || 1),
            };
            console.log('[Friend Image Config Modal] ...Аватар...:', this.currentConfig.avatar);
          } else {
            console.log('[Friend Image Config Modal] ...ДрузьяАватар...，...');
          }
        } else {
          console.log('[Friend Image Config Modal] messageReceivedAvatars...');
        }

        // Друзья
        if (config.friendBackgrounds) {
          const friendBackground = config.friendBackgrounds.find(bg => bg.friendId === this.currentFriendId);
          if (friendBackground) {
            this.currentConfig.background = {
              image: friendBackground.backgroundImage || friendBackground.backgroundImageUrl || '',
              position: this.parseBackgroundPosition(friendBackground.backgroundPosition || 'center center'),
              rotation: parseFloat(friendBackground.rotation || 0),
              scale: parseFloat(friendBackground.scale || 1),
            };
          }
        }
      }

      // HTML
      createModal() {
        const existingModal = document.querySelector('.friend-image-config-modal');
        if (existingModal) {
          existingModal.remove();
        }

        this.modalElement = document.createElement('div');
        this.modalElement.className = 'image-config-modal friend-image-config-modal';
        this.modalElement.innerHTML = this.getModalHTML();

        // ，
        const phoneContainer =
          document.querySelector('#mobile-phone-container .mobile-phone-frame') ||
          document.querySelector('.mobile-phone-frame') ||
          document.querySelector('#mobile-phone-container') ||
          document.querySelector('.mobile-phone-container');

        if (phoneContainer) {
          phoneContainer.appendChild(this.modalElement);
          console.log('[Friend Image Config Modal] ...');
        } else {
          document.body.appendChild(this.modalElement);
          console.log('[Friend Image Config Modal] ...body');
        }
      }

      // HTML
      getModalHTML() {
        return `
        <div class="modal-backdrop"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">${this.currentFriendName || 'Друзья'} - ...Настройки</h3>
            <button class="modal-close-btn" type="button">×</button>
          </div>

          <div class="modal-tabs">
            <button class="tab-btn ${this.currentTab === 'avatar' ? 'active' : ''}" data-tab="avatar">
              АватарНастройки
            </button>
            <button class="tab-btn ${this.currentTab === 'background' ? 'active' : ''}" data-tab="background">
              ...
            </button>
          </div>

          <div class="modal-body">
            ${this.getTabContent()}
          </div>

          <div class="modal-footer">
            <button class="save-btn" type="button">СохранитьНастройки</button>
          </div>
        </div>
      `;
      }

      // -
      getTabContent() {
        if (this.currentTab === 'avatar') {
          return this.getAvatarTabContent();
        } else {
          return this.getBackgroundTabContent();
        }
      }

      // Аватар
      getAvatarTabContent() {
        const config = this.currentConfig.avatar;
        return `
        <div class="config-section">
          <div class="upload-section">
            <div class="upload-controls">
              <input type="file" id="friend-avatar-file-input" accept="image/*" style="display: none;">
              <button class="upload-btn" data-target="friend-avatar-file-input">...</button>
              <input type="url" class="url-input" placeholder="......" data-type="avatar" value="${
                config.image
              }">
            </div>
          </div>

          <div class="preview-section">
            <div class="preview-container avatar-preview">
              <div class="preview-image" id="avatar-preview"></div>
              <div class="drag-hint">...</div>
            </div>
          </div>

          <div class="controls-section">
            <div class="control-row">
              <label>...:</label>
              <input type="range" class="control-slider" min="0" max="360" step="1" value="${
                config.rotation
              }" data-type="avatar" data-property="rotation">
              <span class="control-value">${config.rotation}°</span>
            </div>
            <div class="control-row">
              <label>...:</label>
              <input type="range" class="control-slider" min="0.5" max="2" step="0.1" value="${
                config.scale
              }" data-type="avatar" data-property="scale">
              <span class="control-value">${config.scale.toFixed(1)}x</span>
            </div>
          </div>
        </div>
      `;
      }

      getBackgroundTabContent() {
        const config = this.currentConfig.background;
        return `
        <div class="config-section">
          <div class="upload-section">
            <div class="upload-controls">
              <input type="file" id="friend-background-file-input" accept="image/*" style="display: none;">
              <button class="upload-btn" data-target="friend-background-file-input">...</button>
              <input type="url" class="url-input" placeholder="......" data-type="background" value="${
                config.image
              }">
            </div>
          </div>

          <div class="preview-section">
            <div class="preview-container background-preview">
              <div class="preview-image" id="background-preview"></div>
              <div class="drag-hint">...</div>
            </div>
          </div>

          <div class="controls-section">
            <div class="control-row">
              <label>...:</label>
              <input type="range" class="control-slider" min="0" max="360" step="1" value="${
                config.rotation
              }" data-type="background" data-property="rotation">
              <span class="control-value">${config.rotation}°</span>
            </div>
            <div class="control-row">
              <label>...:</label>
              <input type="range" class="control-slider" min="0.5" max="2" step="0.1" value="${
                config.scale
              }" data-type="background" data-property="scale">
              <span class="control-value">${config.scale.toFixed(1)}x</span>
            </div>
          </div>
        </div>
      `;
      }

      // -
      bindEvents() {
        if (!this.modalElement) return;

        // Закрыть
        const closeBtn = this.modalElement.querySelector('.modal-close-btn');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => this.hide());
        }

        // Закрыть
        const backdrop = this.modalElement.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.addEventListener('click', () => this.hide());
        }

        const tabBtns = this.modalElement.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
          btn.addEventListener('click', e => {
            const tab = e.target.getAttribute('data-tab');
            this.switchTab(tab);
          });
        });

        // Загрузить
        const uploadBtns = this.modalElement.querySelectorAll('.upload-btn');
        uploadBtns.forEach(btn => {
          btn.addEventListener('click', e => {
            const targetId = e.target.getAttribute('data-target');
            const fileInput = this.modalElement.querySelector(`#${targetId}`);
            if (fileInput) {
              fileInput.click();
            }
          });
        });

        const fileInputs = this.modalElement.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
          input.addEventListener('change', e => this.handleFileUpload(e));
        });

        // URL
        const urlInputs = this.modalElement.querySelectorAll('.url-input');
        urlInputs.forEach(input => {
          input.addEventListener('input', e => this.handleUrlInput(e));
        });

        const sliders = this.modalElement.querySelectorAll('.control-slider');
        sliders.forEach(slider => {
          slider.addEventListener('input', e => this.handleSliderChange(e));
        });

        // Сохранить
        const saveBtn = this.modalElement.querySelector('.save-btn');
        if (saveBtn) {
          saveBtn.addEventListener('click', () => this.saveConfig());
        }

        this.bindDragEvents();
      }

      switchTab(tab) {
        this.currentTab = tab;

        // Статус
        const tabBtns = this.modalElement.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
          btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
        });

        const modalBody = this.modalElement.querySelector('.modal-body');
        if (modalBody) {
          modalBody.innerHTML = this.getTabContent();

          this.bindEvents();

          this.updatePreview();
        }
      }

      // Загрузить -
      async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
          console.log(`[Friend Image Config Modal] ...Загрузить...:`, file.name);

          // Base64
          const imageUrl = await this.fileToBase64(file);

          this.currentConfig[this.currentTab].image = imageUrl;

          this.updatePreview();

          console.log(`[Friend Image Config Modal] ...Загрузить...`);
        } catch (error) {
          console.error('[Friend Image Config Modal] errorЗагрузитьerror:', error);
          if (window.MobilePhone && window.MobilePhone.showToast) {
            window.MobilePhone.showToast('...Загрузить...', 'error');
          }
        }
      }

      // URL -
      handleUrlInput(event) {
        const url = event.target.value.trim();
        const type = event.target.dataset.type;

        if (url && this.isValidImageUrl(url)) {
          console.log(`[Friend Image Config Modal] Настройки${type}...URL:`, url);
          this.currentConfig[type].image = url;
          this.updatePreview();
        }
      }

      // URL -
      isValidImageUrl(url) {
        try {
          new URL(url);
          return /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url) || url.startsWith('data:image/');
        } catch {
          return url.startsWith('data:image/');
        }
      }

      // Base64 -
      fileToBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      handleScaleChange(e) {
        const scale = parseFloat(e.target.value);
        this.currentConfig[this.currentTab].scale = scale;

        const scaleValue = this.modalElement.querySelector('.scale-value');
        if (scaleValue) {
          scaleValue.textContent = scale.toFixed(1) + 'x';
        }

        this.updatePreview();
      }

      handleRotationChange(e) {
        const rotation = parseInt(e.target.value);
        this.currentConfig[this.currentTab].rotation = rotation;

        const rotationValue = this.modalElement.querySelector('.rotation-value');
        if (rotationValue) {
          rotationValue.textContent = rotation + '°';
        }

        this.updatePreview();
      }

      // -
      handleSliderChange(e) {
        const slider = e.target;
        const type = slider.getAttribute('data-type');
        const property = slider.getAttribute('data-property');
        const value = parseFloat(slider.value);

        if (!type || !property) return;

        this.currentConfig[type][property] = value;

        const controlRow = slider.closest('.control-row');
        const valueSpan = controlRow.querySelector('.control-value');
        if (valueSpan) {
          if (property === 'rotation') {
            valueSpan.textContent = `${value}°`;
          } else if (property === 'scale') {
            valueSpan.textContent = `${value.toFixed(1)}x`;
          }
        }

        this.updatePreview();

        console.log(`[Friend Image Config Modal] ...${type}...${property}:`, value);
      }

      // - CSS
      updatePreview() {
        const config = this.currentConfig[this.currentTab];
        const previewElement = this.modalElement.querySelector(`#${this.currentTab}-preview`);

        if (!previewElement || !config.image) return;

        const backgroundPosition = this.formatBackgroundPosition(config.position);

        previewElement.style.backgroundImage = `url(${config.image})`;
        previewElement.style.backgroundPosition = backgroundPosition;
        previewElement.style.backgroundRepeat = 'no-repeat';

        // ：CSS
        if (this.currentTab === 'avatar') {
          // Аватар：background-size，transform
          previewElement.style.backgroundSize = `${config.scale * 100}%`;
          previewElement.style.transform = `rotate(${config.rotation}deg)`;
        } else {
          // ：transform
          previewElement.style.backgroundSize = 'cover';
          previewElement.style.transform = `rotate(${config.rotation}deg) scale(${config.scale})`;
        }

        this.updateControlValues();

        // URL/* Поле ввода */
        this.updateUrlInput();

        console.log(`[Friend Image Config Modal] ...${this.currentTab}...:`, {
          image: config.image.substring(0, 50) + '...',
          position: backgroundPosition,
          transform,
        });
      }

      // -
      bindDragEvents() {
        const previewContainers = this.modalElement.querySelectorAll('.preview-container');

        previewContainers.forEach(container => {
          container.addEventListener('mousedown', e => this.startDrag(e, container));

          container.addEventListener('touchstart', e => this.startDrag(e, container), { passive: false });

          container.addEventListener('dragstart', e => e.preventDefault());
        });

        // （document）
        this.dragMoveHandler = e => this.handleDrag(e);
        this.dragEndHandler = () => this.endDrag();

        document.addEventListener('mousemove', this.dragMoveHandler);
        document.addEventListener('mouseup', this.dragEndHandler);
        document.addEventListener('touchmove', this.dragMoveHandler, { passive: false });
        document.addEventListener('touchend', this.dragEndHandler);
      }

      // -
      startDrag(event, container) {
        event.preventDefault();

        this.isDragging = true;
        this.dragContainer = container;

        const rect = container.getBoundingClientRect();
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;

        this.dragStartPos = {
          x: clientX - rect.left,
          y: clientY - rect.top,
        };

        this.dragStartImagePos = { ...this.currentConfig[this.currentTab].position };

        container.style.cursor = 'grabbing';
        console.log('[Friend Image Config Modal] ...');
      }

      // -
      handleDrag(event) {
        if (!this.isDragging || !this.dragContainer) return;

        event.preventDefault();

        const rect = this.dragContainer.getBoundingClientRect();
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;

        // （）
        const currentX = ((clientX - rect.left) / rect.width) * 100;
        const currentY = ((clientY - rect.top) / rect.height) * 100;

        // （）
        const startX = (this.dragStartPos.x / rect.width) * 100;
        const startY = (this.dragStartPos.y / rect.height) * 100;

        const deltaX = currentX - startX;
        const deltaY = currentY - startY;

        // （：background-position）
        // = = background-position X
        // = = background-position Y
        const newX = Math.max(0, Math.min(100, this.dragStartImagePos.x - deltaX));
        const newY = Math.max(0, Math.min(100, this.dragStartImagePos.y - deltaY));

        this.currentConfig[this.currentTab].position = { x: newX, y: newY };

        // （，）
        const previewElement = this.modalElement.querySelector(`#${this.currentTab}-preview`);
        if (previewElement) {
          previewElement.style.backgroundPosition = this.formatBackgroundPosition({ x: newX, y: newY });
        }
      }

      // -
      endDrag() {
        if (this.isDragging) {
          this.isDragging = false;
          if (this.dragContainer) {
            this.dragContainer.style.cursor = 'grab';
            this.dragContainer = null;
          }
          console.log('[Friend Image Config Modal] ...');
        }
      }

      // -
      cleanupDragEvents() {
        if (this.dragMoveHandler) {
          document.removeEventListener('mousemove', this.dragMoveHandler);
          document.removeEventListener('touchmove', this.dragMoveHandler);
        }
        if (this.dragEndHandler) {
          document.removeEventListener('mouseup', this.dragEndHandler);
          document.removeEventListener('touchend', this.dragEndHandler);
        }
      }

      // Сохранить
      async saveConfig() {
        console.log('[Friend Image Config Modal] Сохранить...');

        if (!window.styleConfigManager || !window.styleConfigManager.isReady) {
          console.error('[Friend Image Config Modal] StyleConfigManagererror');
          if (window.MobilePhone && window.MobilePhone.showToast) {
            window.MobilePhone.showToast('...', 'error');
          }
          return;
        }

        try {
          const config = JSON.parse(JSON.stringify(window.styleConfigManager.currentConfig));

          // СохранитьДрузьяАватар
          if (this.currentConfig.avatar.image) {
            console.log('[Friend Image Config Modal] ...СохранитьДрузьяАватар...');
            console.log('[Friend Image Config Modal] ...Аватар...:', this.currentConfig.avatar);
            console.log('[Friend Image Config Modal] ДрузьяID:', this.currentFriendId);

            // messageReceivedAvatars
            if (!config.messageReceivedAvatars) {
              config.messageReceivedAvatars = [];
            }

            // ДрузьяАватар
            let friendAvatarIndex = config.messageReceivedAvatars.findIndex(
              avatar => avatar.friendId === this.currentFriendId,
            );

            console.log('[Friend Image Config Modal] ...ДрузьяАватар...:', friendAvatarIndex);

            const avatarConfig = {
              id:
                friendAvatarIndex >= 0
                  ? config.messageReceivedAvatars[friendAvatarIndex].id
                  : `friend_${this.currentFriendId}_${Date.now()}`,
              friendId: this.currentFriendId,
              name: this.currentFriendName || `Друзья${this.currentFriendId}`,
              description: `${this.currentFriendName || 'Друзья'}...Аватар`,
              backgroundImage: this.currentConfig.avatar.image.startsWith('data:')
                ? this.currentConfig.avatar.image
                : '',
              backgroundImageUrl: !this.currentConfig.avatar.image.startsWith('data:')
                ? this.currentConfig.avatar.image
                : '',
              backgroundPosition: this.formatBackgroundPosition(this.currentConfig.avatar.position),
              rotation: this.currentConfig.avatar.rotation.toString(),
              scale: this.currentConfig.avatar.scale.toString(),
            };

            console.log('[Friend Image Config Modal] ...Аватар...:', avatarConfig);

            if (friendAvatarIndex >= 0) {
              config.messageReceivedAvatars[friendAvatarIndex] = avatarConfig;
              console.log('[Friend Image Config Modal] ...Аватар...');
            } else {
              config.messageReceivedAvatars.push(avatarConfig);
              console.log('[Friend Image Config Modal] ...Аватар...');
            }

            console.log('[Friend Image Config Modal] ...messageReceivedAvatars:', config.messageReceivedAvatars);
          } else {
            console.log('[Friend Image Config Modal] ...АватарСохранить - ...');
          }

          // СохранитьДрузья
          if (this.currentConfig.background.image) {
            // friendBackgrounds
            if (!config.friendBackgrounds) {
              config.friendBackgrounds = [];
            }

            // Друзья
            let friendBgIndex = config.friendBackgrounds.findIndex(bg => bg.friendId === this.currentFriendId);

            const backgroundConfig = {
              id:
                friendBgIndex >= 0
                  ? config.friendBackgrounds[friendBgIndex].id
                  : `friend_bg_${this.currentFriendId}_${Date.now()}`,
              friendId: this.currentFriendId,
              name: `${this.currentFriendName || 'Друзья'}...`,
              description: `${this.currentFriendName || 'Друзья'}...`,
              backgroundImage: this.currentConfig.background.image.startsWith('data:')
                ? this.currentConfig.background.image
                : '',
              backgroundImageUrl: !this.currentConfig.background.image.startsWith('data:')
                ? this.currentConfig.background.image
                : '',
              backgroundPosition: this.formatBackgroundPosition(this.currentConfig.background.position),
              rotation: this.currentConfig.background.rotation.toString(),
              scale: this.currentConfig.background.scale.toString(),
            };

            if (friendBgIndex >= 0) {
              config.friendBackgrounds[friendBgIndex] = backgroundConfig;
            } else {
              config.friendBackgrounds.push(backgroundConfig);
            }

            console.log(`[Friend Image Config Modal] СохранитьДрузья...:`, backgroundConfig);
          }

          // Сохранить - ：styleConfigManagercurrentConfig，Сохранить
          console.log('[Friend Image Config Modal] ...Сохранить...styleConfigManager');
          console.log('[Friend Image Config Modal] Сохранить...:', JSON.stringify(config, null, 2));

          // ：styleConfigManagercurrentConfig
          window.styleConfigManager.currentConfig = config;
          console.log('[Friend Image Config Modal] ...styleConfigManager.currentConfig');

          // saveConfig
          const saveResult = await window.styleConfigManager.saveConfig();
          console.log('[Friend Image Config Modal] Сохранить...:', saveResult);

          // Сохранить
          const savedConfig = window.styleConfigManager.getConfig();
          console.log(
            '[Friend Image Config Modal] Сохранить...messageReceivedAvatars:',
            savedConfig.messageReceivedAvatars,
          );
          console.log('[Friend Image Config Modal] Сохранить...friendBackgrounds:', savedConfig.friendBackgrounds);

          // Сообщения
          if (window.MobilePhone && window.MobilePhone.showToast) {
            window.MobilePhone.showToast('...Сохранить...', 'success');
          }

          // Закрыть
          this.hide();
        } catch (error) {
          console.error('[Friend Image Config Modal] Сохранитьerror:', error);
          if (window.MobilePhone && window.MobilePhone.showToast) {
            window.MobilePhone.showToast('Сохранить...，...', 'error');
          }
        }
      }

      parseBackgroundPosition(position) {
        const parts = position.split(' ');
        let x = 50,
          y = 50;

        if (parts.length >= 2) {
          x = parseFloat(parts[0]) || 50;
          y = parseFloat(parts[1]) || 50;
        }

        return { x, y };
      }

      // CSS background-position -
      formatBackgroundPosition(position) {
        return `${position.x}% ${position.y}%`;
      }

      updateControlValues() {
        const config = this.currentConfig[this.currentTab];

        const rotationSlider = this.modalElement.querySelector(
          `[data-type="${this.currentTab}"][data-property="rotation"]`,
        );
        if (rotationSlider) {
          rotationSlider.value = config.rotation;
        }

        const scaleSlider = this.modalElement.querySelector(`[data-type="${this.currentTab}"][data-property="scale"]`);
        if (scaleSlider) {
          scaleSlider.value = config.scale;
        }

        const controlValues = this.modalElement.querySelectorAll('.control-value');
        controlValues.forEach((valueSpan, index) => {
          if (index === 0) {
            valueSpan.textContent = `${config.rotation}°`;
          } else if (index === 1) {
            valueSpan.textContent = `${config.scale.toFixed(1)}x`;
          }
        });
      }

      // URL/* Поле ввода */
      updateUrlInput() {
        const urlInput = this.modalElement.querySelector(`[data-type="${this.currentTab}"].url-input`);
        if (urlInput) {
          urlInput.value = this.currentConfig[this.currentTab].image;
        }
      }
    }

    // ，DOM
    setTimeout(() => {
      try {
        console.log('[Friend Image Config Modal] ...Друзья...');
        window.FriendImageConfigModal = new FriendImageConfigModal();
        console.log('[Friend Image Config Modal] Друзья...:', typeof window.FriendImageConfigModal);
        console.log('[Friend Image Config Modal] Друзья...');
      } catch (error) {
        console.error('[Friend Image Config Modal] errorДрузьяerror:', error);
      }
    }, 100);
  } else {
    console.log(
      '[Friend Image Config Modal] ...Друзья... - ImageConfigModalClass:',
      typeof window.ImageConfigModalClass,
      'ImageConfigModal...:',
      typeof window.ImageConfigModal,
      'FriendImageConfigModal:',
      typeof window.FriendImageConfigModal,
    );
  }
})(); // ...
