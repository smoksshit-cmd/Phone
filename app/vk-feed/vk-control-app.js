// ==SillyTavern VkFeed Control App==
// @name         VkFeed Control App for Mobile Extension
// @version      1.0.0
// @description ВКонтакте/* Приложение */，、Пользователь
// @author       Assistant

/**
 * ВКонтакте.../* Приложение */...
 * ...、Пользователь...、...
 */
class VkFeedControlApp {
  constructor() {
    this.isDialogOpen = false;
    this.currentDialog = null;
    this.isProcessing = false;

    this.init();
  }

  init() {
    console.log('[VkFeed Control] ВКонтакте.../* Приложение */...');
    this.createDialogContainer();
  }

  /**
   * ...
   */
  createDialogContainer() {
    if (document.getElementById('vk_feed-dialog-container')) {
      return;
    }

    const container = document.createElement('div');
    container.id = 'vk_feed-dialog-container';
    container.className = 'vk_feed-dialog-container';
    container.style.display = 'none';

    const phoneContainer = document.querySelector('.mobile-phone-container');
    if (phoneContainer) {
      phoneContainer.appendChild(container);
    } else {
      document.body.appendChild(container);
    }

    console.log('[VkFeed Control] ...');
  }

  /**
   * ...
   */
  showPostDialog() {
    if (this.isDialogOpen) {
      console.log('[VkFeed Control] ...Открыть，...');
      return;
    }

    try {
      console.log('[VkFeed Control] ...');

      const currentUsername = this.getCurrentUsername();
      const accountType = this.getCurrentAccountType();

      const dialogHTML = `
        <div class="vk_feed-dialog-overlay">
          <div class="vk_feed-dialog">
            <div class="dialog-header">
              <h3>...ВКонтакте</h3>
              <button class="close-btn" onclick="window.vk_feedControlApp.closeDialog()">
                <i class="fas fa-times"></i>
              </button>
            </div>

            <div class="dialog-content">
              <div class="user-info">
                <div class="user-avatar">
                  ${this.generateAvatarHTML(currentUsername)}
                </div>
                <div class="user-details">
                  <div class="username">${currentUsername}</div>
                  <div class="account-badge">${accountType}</div>
                </div>
              </div>

              <div class="post-input-section">
                <textarea
                  id="vk_feed-post-content"
                  placeholder="Поделиться......"
                  maxlength="140"
                  rows="4"
                ></textarea>
                <div class="char-count">
                  <span id="char-counter">0</span>/140
                </div>
              </div>

              <div class="post-options">
                <div class="option-item">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>...</span>
                </div>
                <div class="option-item">
                  <i class="fas fa-hashtag"></i>
                  <span>...</span>
                </div>
                <div class="option-item">
                  <i class="fas fa-at"></i>
                  <span>@Друзья</span>
                </div>
              </div>
            </div>

            <div class="dialog-footer">
              <button class="cancel-btn" onclick="window.vk_feedControlApp.closeDialog()">
                Отменить
              </button>
              <button class="post-btn" onclick="window.vk_feedControlApp.submitPost()" disabled>
                Опубликовать
              </button>
            </div>
          </div>
        </div>
      `;

      this.showDialog(dialogHTML);
      this.bindPostDialogEvents();
    } catch (error) {
      console.error('[VkFeed Control] error:', error);
      this.showErrorToast('...');
    }
  }

  /**
   * ...
   */
  showDialog(html) {
    const container = document.getElementById('vk_feed-dialog-container');
    if (!container) {
      console.error('[VkFeed Control] error');
      return;
    }

    container.innerHTML = html;
    container.style.display = 'block';
    this.isDialogOpen = true;

    // /* Анимации */
    setTimeout(() => {
      const dialog = container.querySelector('.vk_feed-dialog');
      if (dialog) {
        dialog.classList.add('show');
      }
    }, 10);

    document.body.style.overflow = 'hidden';
  }

  /**
   * Закрыть...
   */
  closeDialog() {
    const container = document.getElementById('vk_feed-dialog-container');
    if (!container) return;

    const dialog = container.querySelector('.vk_feed-dialog');
    if (dialog) {
      dialog.classList.remove('show');
    }

    setTimeout(() => {
      container.style.display = 'none';
      container.innerHTML = '';
      this.isDialogOpen = false;
      this.currentDialog = null;

      document.body.style.overflow = '';
    }, 200);

    console.log('[VkFeed Control] ...Закрыть');
  }

  /**
   * ...
   */
  bindPostDialogEvents() {
    const textarea = document.getElementById('vk_feed-post-content');
    const charCounter = document.getElementById('char-counter');
    const postBtn = document.querySelector('.dialog-footer .post-btn');

    if (textarea && charCounter && postBtn) {
      textarea.addEventListener('input', () => {
        const length = textarea.value.length;
        charCounter.textContent = length;

        // Статус
        if (length > 0 && length <= 140) {
          postBtn.disabled = false;
          postBtn.classList.add('enabled');
        } else {
          postBtn.disabled = true;
          postBtn.classList.remove('enabled');
        }

        if (length > 140) {
          charCounter.style.color = '#ff4757';
        } else {
          charCounter.style.color = '#666';
        }
      });

      textarea.focus();
    }

    document.querySelectorAll('.post-options .option-item').forEach(item => {
      item.addEventListener('click', () => {
        const icon = item.querySelector('i');
        const text = item.querySelector('span').textContent;

        if (textarea) {
          let insertText = '';

          if (icon.classList.contains('fa-hashtag')) {
            insertText = '#...# ';
          } else if (icon.classList.contains('fa-at')) {
            insertText = '@Пользователь ';
          } else if (icon.classList.contains('fa-map-marker-alt')) {
            insertText = '[...] ';
          }

          if (insertText) {
            const cursorPos = textarea.selectionStart;
            const textBefore = textarea.value.substring(0, cursorPos);
            const textAfter = textarea.value.substring(cursorPos);

            textarea.value = textBefore + insertText + textAfter;
            textarea.selectionStart = textarea.selectionEnd = cursorPos + insertText.length;
            textarea.focus();

            // input
            textarea.dispatchEvent(new Event('input'));
          }
        }
      });
    });

    // ESCЗакрыть
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.isDialogOpen) {
        this.closeDialog();
      }
    });

    // Закрыть
    const overlay = document.querySelector('.vk_feed-dialog-overlay');
    if (overlay) {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) {
          this.closeDialog();
        }
      });
    }
  }

  /**
   * ...
   */
  async submitPost() {
    if (this.isProcessing) {
      console.log('[VkFeed Control] ...，...');
      return;
    }

    const textarea = document.getElementById('vk_feed-post-content');
    if (!textarea) {
      console.error('[VkFeed Control] error/* Поле ввода */');
      return;
    }

    const content = textarea.value.trim();
    if (!content) {
      this.showErrorToast('...ВКонтакте...');
      return;
    }

    if (content.length > 140) {
      this.showErrorToast('ВКонтакте...140...');
      return;
    }

    try {
      this.isProcessing = true;

      // Статус
      const postBtn = document.querySelector('.dialog-footer .post-btn');
      if (postBtn) {
        postBtn.disabled = true;
        postBtn.textContent = 'Опубликовать......';
      }

      console.log('[VkFeed Control] ...:', content);

      // ВКонтакте
      if (window.vk_feedManager && window.vk_feedManager.sendPostToAPI) {
        const result = await window.vk_feedManager.sendPostToAPI(content);

        if (result) {
          this.showSuccessToast('ВКонтактеОпубликовать...');
          this.closeDialog();

          // ，ОбновитьВКонтакте/* Список */
          setTimeout(() => {
            if (window.vk_feedUI) {
              window.vk_feedUI.refreshVkFeedList();
            }
          }, 1000);
        } else {
          throw new Error('ВКонтактеОпубликоватьerror');
        }
      } else {
        throw new Error('ВКонтактеerror');
      }
    } catch (error) {
      console.error('[VkFeed Control] error:', error);
      this.showErrorToast(`Опубликовать...: ${error.message}`);

      // Статус
      const postBtn = document.querySelector('.dialog-footer .post-btn');
      if (postBtn) {
        postBtn.disabled = false;
        postBtn.textContent = 'Опубликовать';
      }
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * ...Пользователь...
   */
  getCurrentUsername() {
    if (window.vk_feedManager && window.vk_feedManager.getCurrentUsername) {
      return window.vk_feedManager.getCurrentUsername();
    }
    return '{{user}}';
  }

  /**
   * ...
   */
  getCurrentAccountType() {
    if (window.vk_feedManager && window.vk_feedManager.currentAccount) {
      return window.vk_feedManager.currentAccount.isMainAccount ? '...' : '...';
    }
    return '...';
  }

  /**
   * ...АватарHTML
   */
  generateAvatarHTML(username) {
    if (window.vk_feedUI && window.vk_feedUI.generateAvatarHTML) {
      return window.vk_feedUI.generateAvatarHTML(username);
    }

    // Аватар
    const initial = username[0] || '?';
    return `<div class="author-avatar" style="background: #ff6b6b">${initial}</div>`;
  }

  /**
   * ...
   */
  showSuccessToast(message) {
    this.showToast(message, 'success');
  }

  /**
   * ...
   */
  showErrorToast(message) {
    this.showToast(message, 'error');
  }

  /**
   * ...Сообщения
   */
  showToast(message, type = 'info') {
    // Еслиtoast，
    if (window.showMobileToast) {
      window.showMobileToast(message, type);
      return;
    }

    const toast = document.createElement('div');
    toast.className = `vk_feed-toast vk_feed-toast-${type}`;
    toast.textContent = message;

    Object.assign(toast.style, {
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '12px 20px',
      borderRadius: '20px',
      color: 'white',
      fontSize: '14px',
      zIndex: '10000',
      opacity: '0',
      transition: 'opacity 0.3s ease',
    });

    // Настройки
    switch (type) {
      case 'success':
        toast.style.background = '#52c41a';
        break;
      case 'error':
        toast.style.background = '#ff4d4f';
        break;
      default:
        toast.style.background = '#1890ff';
    }

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '1';
    }, 10);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  /**
   * ...Подтвердить/* Диалог */
   */
  showConfirmDialog(title, message, onConfirm, onCancel) {
    const dialogHTML = `
      <div class="vk_feed-dialog-overlay">
        <div class="vk_feed-dialog confirm-dialog">
          <div class="dialog-header">
            <h3>${title}</h3>
          </div>

          <div class="dialog-content">
            <p>${message}</p>
          </div>

          <div class="dialog-footer">
            <button class="cancel-btn" onclick="window.vk_feedControlApp.handleConfirmCancel()">
              Отменить
            </button>
            <button class="confirm-btn" onclick="window.vk_feedControlApp.handleConfirmOk()">
              ОК
            </button>
          </div>
        </div>
      </div>
    `;

    this.confirmCallback = onConfirm;
    this.cancelCallback = onCancel;
    this.showDialog(dialogHTML);
  }

  /**
   * ...Подтвердить/* Диалог */...ОК...
   */
  handleConfirmOk() {
    if (this.confirmCallback) {
      this.confirmCallback();
    }
    this.closeDialog();
  }

  /**
   * ...Подтвердить/* Диалог */...Отменить...
   */
  handleConfirmCancel() {
    if (this.cancelCallback) {
      this.cancelCallback();
    }
    this.closeDialog();
  }

  /**
   * .../* Диалог */
   */
  showInputDialog(title, placeholder, defaultValue, onConfirm, onCancel) {
    const dialogHTML = `
      <div class="vk_feed-dialog-overlay">
        <div class="vk_feed-dialog input-dialog">
          <div class="dialog-header">
            <h3>${title}</h3>
          </div>

          <div class="dialog-content">
            <input
              type="text"
              id="input-dialog-value"
              placeholder="${placeholder}"
              value="${defaultValue || ''}"
              maxlength="20"
            />
          </div>

          <div class="dialog-footer">
            <button class="cancel-btn" onclick="window.vk_feedControlApp.handleInputCancel()">
              Отменить
            </button>
            <button class="confirm-btn" onclick="window.vk_feedControlApp.handleInputOk()">
              ОК
            </button>
          </div>
        </div>
      </div>
    `;

    this.inputConfirmCallback = onConfirm;
    this.inputCancelCallback = onCancel;
    this.showDialog(dialogHTML);

    setTimeout(() => {
      const input = document.getElementById('input-dialog-value');
      if (input) {
        input.focus();
        input.select();
      }
    }, 100);
  }

  /**
   * .../* Диалог */...ОК...
   */
  handleInputOk() {
    const input = document.getElementById('input-dialog-value');
    const value = input ? input.value.trim() : '';

    if (this.inputConfirmCallback) {
      this.inputConfirmCallback(value);
    }
    this.closeDialog();
  }

  /**
   * .../* Диалог */...Отменить...
   */
  handleInputCancel() {
    if (this.inputCancelCallback) {
      this.inputCancelCallback();
    }
    this.closeDialog();
  }
}

if (typeof window !== 'undefined') {
  window.vk_feedControlApp = new VkFeedControlApp();
  console.log('[VkFeed Control] ✅ ВКонтакте.../* Приложение */...');
}
