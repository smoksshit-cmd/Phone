/**
 * Forum Control App - Форум.../* Приложение */
 * ...mobile-phone.js...Форум...
 */

class ForumControlApp {
  constructor() {
    this.currentView = 'control'; // 'control'
    this.init();
  }

  init() {
    console.log('[Reddit/Forum Control App] Форум.../* Приложение */...');
  }

  // /* Приложение */
  getAppContent() {
    switch (this.currentView) {
      case 'control':
        return this.renderForumControl();
      default:
        return this.renderForumControl();
    }
  }

  // Форум
  renderForumControl() {
    // Настройки
    const currentSettings = window.forumManager
      ? window.forumManager.currentSettings
      : {
          selectedStyle: 'Аноним',
          threshold: 5,
          autoUpdate: true,
        };

    const customPrefix = window.forumStyles ? window.forumStyles.getCustomPrefix() : '';

    return `
            <div class="forum-control-app">
                <div class="control-section">
                    <h3 class="section-title">📰 ФорумНастройки</h3>

                    <div class="form-group">
                        <label class="form-label">...Форум...</label>
                        <select id="forum-style-select" class="form-select">
                            <!-- ...JavaScript... -->
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">...</label>
                        <textarea id="forum-custom-prefix" class="form-textarea" placeholder="...，......">${customPrefix}</textarea>
                        <div class="form-hint">...: ...、...</div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Сообщения...</label>
                        <input type="number" id="forum-threshold" class="form-input" value="${
                          currentSettings.threshold
                        }" min="1" max="100" placeholder="...Форум...Сообщения...">
                        <div class="form-hint">...Сообщения...Форум...</div>
                    </div>

                    <div class="form-group">
                        <label class="form-checkbox">
                            <input type="checkbox" id="forum-auto-update" ${
                              currentSettings.autoUpdate ? 'checked' : ''
                            }>
                            <span class="checkbox-label">...Форум...</span>
                        </label>
                    </div>
                </div>

                <div class="control-section">
                    <h3 class="section-title">🔧 ...</h3>

                    <div class="button-group">
                        <button id="generate-forum-now" class="control-btn primary">
                            <span class="btn-icon">🚀</span>
                            <span>...Форум</span>
                        </button>
                        <button id="clear-forum-content" class="control-btn danger">
                            <span class="btn-icon">🗑️</span>
                            <span>...Форум...</span>
                        </button>
                        <button id="forum-settings" class="control-btn secondary">
                            <span class="btn-icon">⚙️</span>
                            <span>APIНастройки</span>
                        </button>
                    </div>
                </div>

                <div class="control-section">
                    <h3 class="section-title">📊 Статус...</h3>
                    <div id="forum-status" class="status-display">
                        Статус: ...
                    </div>
                </div>
            </div>
        `;
  }

  bindEvents() {
    this.initializeStyleSelector();

    // Стиль
    const styleSelect = document.getElementById('forum-style-select');
    if (styleSelect) {
      styleSelect.addEventListener('change', e => {
        if (window.forumManager) {
          window.forumManager.currentSettings.selectedStyle = e.target.value;
          window.forumManager.saveSettings();
        }
      });
    }

    const customPrefixTextarea = document.getElementById('forum-custom-prefix');
    if (customPrefixTextarea) {
      customPrefixTextarea.addEventListener('input', e => {
        if (window.forumStyles) {
          window.forumStyles.setCustomPrefix(e.target.value);
        }
      });
    }

    // Сообщения
    const thresholdInput = document.getElementById('forum-threshold');
    if (thresholdInput) {
      thresholdInput.addEventListener('change', e => {
        if (window.forumManager) {
          window.forumManager.currentSettings.threshold = parseInt(e.target.value);
          window.forumManager.saveSettings();
        }
      });
    }

    const autoUpdateCheckbox = document.getElementById('forum-auto-update');
    if (autoUpdateCheckbox) {
      autoUpdateCheckbox.addEventListener('change', e => {
        if (window.forumManager) {
          window.forumManager.currentSettings.autoUpdate = e.target.checked;
          window.forumManager.saveSettings();
        }
      });
    }

    // Форум
    const generateBtn = document.getElementById('generate-forum-now');
    if (generateBtn) {
      generateBtn.addEventListener('click', async () => {
        console.log('[Reddit/Forum Control] 🔘 ...');
        console.log('[Reddit/Forum Control] 🔍 ...MobileContext:', !!window.MobileContext);
        console.log('[Reddit/Forum Control] 🔍 ...forceGenerateForum:', !!window.MobileContext?.forceGenerateForum);
        console.log('[Reddit/Forum Control] 🔍 ...forumManager:', !!window.forumManager);

        try {
          generateBtn.disabled = true;
          generateBtn.textContent = '......';

          if (window.MobileContext && window.MobileContext.forceGenerateForum) {
            console.log('[Reddit/Forum Control] 🚀 ...');
            const result = await window.MobileContext.forceGenerateForum();
            if (!result) {
              console.warn('[Reddit/Forum Control] errorНазадfalse');
            } else {
              console.log('[Reddit/Forum Control] ✅ ...');
            }
          } else if (window.forumManager) {
            console.log('[Reddit/Forum Control] 🚀 ...，force=true');
            const result = await window.forumManager.generateForumContent(true); // ...，...Сообщения...
            if (!result) {
              console.warn('[Reddit/Forum Control] errorФорумerrorНазадfalse');
            } else {
              console.log('[Reddit/Forum Control] ✅ ...');
            }
          } else {
            console.error('[Reddit/Forum Control] Форумerror');
            alert('Форум...，...Обновить...');
          }
        } catch (error) {
          console.error('[Reddit/Forum Control] error:', error);
          alert(`...: ${error.message}`);
        } finally {
          // Статус
          generateBtn.disabled = false;
          generateBtn.innerHTML = '<span class="btn-icon">🚀</span><span>...Форум</span>';

          // forumManagerСтатус，
          setTimeout(() => {
            if (window.forumManager && window.forumManager.isProcessing) {
              console.warn('[Reddit/Forum Control] errorСтатус');
              window.forumManager.isProcessing = false;
            }
          }, 3000);
        }
      });
    }

    // Форум
    const clearBtn = document.getElementById('clear-forum-content');
    if (clearBtn) {
      clearBtn.addEventListener('click', async () => {
        try {
          if (!confirm('ОК...Форум...？...。')) {
            return;
          }

          clearBtn.disabled = true;
          clearBtn.textContent = '......';

          if (window.forumManager) {
            await window.forumManager.clearForumContent();
          } else {
            console.error('[Reddit/Forum Control] forumManagererror');
            alert('Форум...，...Обновить...');
          }
        } catch (error) {
          console.error('[Reddit/Forum Control] errorФорумerror:', error);
          alert(`...: ${error.message}`);
        } finally {
          // Статус
          clearBtn.disabled = false;
          clearBtn.innerHTML = '<span class="btn-icon">🗑️</span><span>...Форум...</span>';

          // forumManagerСтатус，
          setTimeout(() => {
            if (window.forumManager && window.forumManager.isProcessing) {
              console.warn('[Reddit/Forum Control] errorСтатус');
              window.forumManager.isProcessing = false;
            }
          }, 3000);
        }
      });
    }

    // APIНастройки
    const settingsBtn = document.getElementById('forum-settings');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        if (window.mobileCustomAPIConfig) {
          window.mobileCustomAPIConfig.showAPIPanel();
        } else {
          alert('API...');
        }
      });
    }
  }

  // /* Отображение статуса */
  updateStatus(message, type = 'info') {
    const statusEl = document.getElementById('forum-status');
    if (statusEl) {
      const colors = {
        info: '#3498db',
        success: '#27ae60',
        warning: '#f39c12',
        error: '#e74c3c',
      };

      statusEl.textContent = `Статус: ${message}`;
      statusEl.style.color = colors[type] || colors.info;
    }
  }

  // Статус
  getStatus() {
    return {
      currentView: this.currentView,
      forumManagerAvailable: !!window.forumManager,
      forumStylesAvailable: !!window.forumStyles,
      apiConfigAvailable: !!window.mobileCustomAPIConfig,
    };
  }

  initializeStyleSelector() {
    const styleSelect = document.getElementById('forum-style-select');
    if (!styleSelect) return;

    try {
      const currentStyle = window.forumManager?.currentSettings?.selectedStyle || 'Аноним';

      styleSelect.innerHTML = '';

      if (window.forumStyles && window.forumStyles.styles) {
        const presetStyles = Object.keys(window.forumStyles.styles);
        if (presetStyles.length > 0) {
          const presetGroup = document.createElement('optgroup');
          presetGroup.label = '...';

          presetStyles.forEach(styleName => {
            const option = document.createElement('option');
            option.value = styleName;
            option.textContent = styleName;
            if (styleName === currentStyle) {
              option.selected = true;
            }
            presetGroup.appendChild(option);
          });

          styleSelect.appendChild(presetGroup);
        }
      }

      if (window.forumStyles && window.forumStyles.getAllCustomStyles) {
        const customStyles = window.forumStyles.getAllCustomStyles();
        if (customStyles.length > 0) {
          const customGroup = document.createElement('optgroup');
          customGroup.label = '...';

          customStyles.forEach(style => {
            const option = document.createElement('option');
            option.value = style.name;
            option.textContent = `${style.name} (...)`;
            if (style.name === currentStyle) {
              option.selected = true;
            }
            customGroup.appendChild(option);
          });

          styleSelect.appendChild(customGroup);
        }
      }

      // Если，
      if (!styleSelect.value && styleSelect.options.length > 0) {
        styleSelect.selectedIndex = 0;
        if (window.forumManager) {
          window.forumManager.currentSettings.selectedStyle = styleSelect.value;
          window.forumManager.saveSettings();
        }
      }

      console.log('[Reddit/ForumControlApp] ...，...', styleSelect.options.length, '...');
    } catch (error) {
      console.error('[Reddit/ForumControlApp] error:', error);

      // ：
      styleSelect.innerHTML = '<option value="Аноним">Аноним</option>';
      styleSelect.value = 'Аноним';
    }
  }

  // Обновить（）
  refreshStyleSelector() {
    this.initializeStyleSelector();
  }
}

window.forumControlApp = new ForumControlApp();

// Форум/* Приложение */
window.getForumControlAppContent = function () {
  return window.forumControlApp.getAppContent();
};

// Форум/* Приложение */
window.bindForumControlEvents = function () {
  window.forumControlApp.bindEvents();
};

window.ForumControlApp = ForumControlApp;
window.forumControlApp = new ForumControlApp();

// Экспорт класса
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ForumControlApp;
}

console.log('[Reddit/Forum Control App] Форум.../* Приложение */...');
