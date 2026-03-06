/**
 * Status App - Статус/* Приложение */
 * ...mobile-phone.js...Статус...
 */

// @ts-nocheck
if (typeof window.RuApp_status === 'undefined') {
  class RuApp_status {
    constructor() {
      this.currentView = 'user'; // 'user', 'npc'
      this.userData = null;
      this.npcList = [];
      this.eventListenersSetup = false;
      this.messageReceivedHandler = null;

      this.init();
    }

    init() {
      console.log('[Статус] Статус/* Приложение */... - ... 2.0');

      // Статус
      this.parseStatusFromContext();

      // ，
      setTimeout(() => {
        this.setupContextMonitor();
      }, 100);

      console.log('[Статус] Статус/* Приложение */...');
    }

    // Настройка мониторинга контекста
    setupContextMonitor() {
      console.log('[Статус] Настройки......');
      this.setupSillyTavernEventListeners();
    }

    // ОбновитьСтатус
    refreshStatusData() {
      console.log('[Статус] 🔄 ...ОбновитьСтатус......');
      this.parseStatusFromContext();
    }

    // НастройкиSillyTavern
    setupSillyTavernEventListeners() {
      if (this.eventListenersSetup) {
        return;
      }

      try {
        const eventSource = window['eventSource'];
        const event_types = window['event_types'];

        if (eventSource && event_types) {
          this.eventListenersSetup = true;

          const handleMessageReceived = () => {
            console.log('[Статус] 📨 ... MESSAGE_RECEIVED ...，ОбновитьСтатус......');
            setTimeout(() => {
              this.parseStatusFromContext();

              // Если/* Приложение */Статус，ОбновитьUI
              const appContent = document.getElementById('app-content');
              if (appContent && appContent.querySelector('.cd-status-app')) {
                console.log('[Статус] 🔄 ...ОбновитьСтатус/* Приложение */UI...');
                appContent.innerHTML = this.getAppContent();
                this.bindEvents();
              }
            }, 500);
          };

          if (event_types.MESSAGE_RECEIVED) {
            eventSource.on(event_types.MESSAGE_RECEIVED, handleMessageReceived);
            console.log('[Статус] ✅ ... MESSAGE_RECEIVED ...');
          }

          if (event_types.CHAT_CHANGED) {
            eventSource.on(event_types.CHAT_CHANGED, () => {
              console.log('[Статус] 📨 ...，ОбновитьСтатус......');
              setTimeout(() => {
                this.parseStatusFromContext();
              }, 500);
            });
            console.log('[Статус] ✅ ... CHAT_CHANGED ...');
          }

          this.messageReceivedHandler = handleMessageReceived;
        } else {
          setTimeout(() => {
            this.setupSillyTavernEventListeners();
          }, 5000);
        }
      } catch (error) {
        console.warn('[Статус] НастройкиSillyTavernerror:', error);
      }
    }

    // Статус
    parseStatusFromContext() {
      try {
        const statusData = this.getCurrentStatusData();
        this.userData = statusData.userData;
        this.npcList = statusData.npcList;
        console.log('[Статус] 📊 Статус...');

        // Статус/* Приложение */UI
        if (this.isCurrentlyActive()) {
          console.log('[Статус] 🎨 Статус/* Приложение */...Статус，...UI...');
          this.updateAppContent();
        } else {
          console.log('[Статус] 💤 Статус/* Приложение */...，...UI...');
        }
      } catch (error) {
        console.error('[Статус] errorСтатусerror:', error);
      }
    }

    // Статус/* Приложение */
    isCurrentlyActive() {
      const appContent = document.getElementById('app-content');
      if (!appContent) return false;

      // Статус/* Приложение */
      return appContent.querySelector('.cd-status-container') !== null;
    }

    /**
     * ...Статус...
     */
    getCurrentStatusData() {
      try {
        if (window.Mvu && typeof window.Mvu.getMvuData === 'function') {
          let targetMessageId = 'latest';

          if (typeof window.getLastMessageId === 'function' && typeof window.getChatMessages === 'function') {
            let currentId = window.getLastMessageId();

            while (currentId >= 0) {
              const message = window.getChatMessages(currentId).at(-1);
              if (message && message.role !== 'user') {
                targetMessageId = currentId;
                break;
              }
              currentId--;
            }

            if (currentId < 0) {
              targetMessageId = 'latest';
            }
          }

          const mvuData = window.Mvu.getMvuData({ type: 'message', message_id: targetMessageId });
          console.log('[Статус] ... Mvu ...:', mvuData);
          console.log('[Статус] stat_data ...:', !!mvuData?.stat_data);
          if (mvuData?.stat_data) {
            console.log('[Статус] stat_data ...:', Object.keys(mvuData.stat_data));
            console.log('[Статус] Пользователь...:', !!mvuData.stat_data['Пользователь']);
            console.log('[Статус] NPC...:', !!mvuData.stat_data['NPC']);
            if (mvuData.stat_data['Пользователь']) {
              console.log('[Статус] Пользователь...:', mvuData.stat_data['Пользователь']);
            }
            if (mvuData.stat_data['NPC']) {
              console.log('[Статус] NPC...:', mvuData.stat_data['NPC']);
            }
          }

          let userData = null;
          let npcList = [];

          // stat_data Пользователь
          if (mvuData && mvuData.stat_data && mvuData.stat_data['Пользователь']) {
            userData = this.parseUserData(mvuData.stat_data['Пользователь']);
            console.log('[Статус] ✅ ... stat_data ...Пользователь...:', userData);
          } else if (mvuData && mvuData['Пользователь']) {
            userData = this.parseUserData(mvuData['Пользователь']);
            console.log('[Статус] ✅ ...Пользователь...:', userData);
          } else {
            console.warn('[Статус] ⚠️ errorПользовательerror');
          }

          // stat_data NPC
          if (mvuData && mvuData.stat_data && mvuData.stat_data['NPC']) {
            npcList = this.parseNPCData(mvuData.stat_data['NPC']);
            console.log('[Статус] ✅ ... stat_data ...NPC...，...:', npcList.length);
          } else if (mvuData && mvuData['NPC']) {
            npcList = this.parseNPCData(mvuData['NPC']);
            console.log('[Статус] ✅ ...NPC...，...:', npcList.length);
          } else {
            console.warn('[Статус] ⚠️ errorNPCerror');
          }

          return { userData, npcList };
        }

        if (window.SillyTavern) {
          const context = window.SillyTavern.getContext ? window.SillyTavern.getContext() : window.SillyTavern;
          if (context && context.chatMetadata && context.chatMetadata.variables) {
            const userData = context.chatMetadata.variables['Пользователь']
              ? this.parseUserData(context.chatMetadata.variables['Пользователь'])
              : null;
            const npcList = context.chatMetadata.variables['NPC']
              ? this.parseNPCData(context.chatMetadata.variables['NPC'])
              : [];
            return { userData, npcList };
          }
        }

        console.log('[Статус] ...Статус...');
      } catch (error) {
        console.warn('[Статус] errorСтатусerror:', error);
      }

      return { userData: null, npcList: [] };
    }

    /**
     * ...Пользователь...
     */
    parseUserData(userData) {
      if (!userData || typeof userData !== 'object') return null;

      const getValue = (field) => userData[field] && Array.isArray(userData[field]) ? userData[field][0] : null;
      const getClothingValue = (field) => {
        const clothing = userData['...'];
        if (!clothing || typeof clothing !== 'object') return '';
        const item = clothing[field];
        return item && Array.isArray(item) ? item[0] : '';
      };

      return {
        ...: getValue('...') || '...',
        ...: getValue('...') || 0,
        ...: getValue('...') || '...',
        ...: getValue('...') || 0,
        ...: getValue('...') || '...',
        ...: getValue('...') || '...',
        ...: getValue('...') || '...',
        ...: getValue('...') || '...',
        ...: getValue('...') || '...',
        ...: {
          ...: getClothingValue('...'),
          ...: getClothingValue('...'),
          ...: getClothingValue('...'),
          ...: getClothingValue('...'),
          ...: getClothingValue('...'),
          ...: getClothingValue('...'),
          ...: getClothingValue('...'),
          ...: getClothingValue('...'),
        }
      };
    }

    /**
     * ...NPC...
     */
    parseNPCData(npcData) {
      if (!npcData || typeof npcData !== 'object') return [];

      const npcList = [];

      Object.keys(npcData).forEach(npcKey => {
        if (npcKey === '$meta') return;

        const npc = npcData[npcKey];
        if (!npc || typeof npc !== 'object') return;

        const getValue = (field) => npc[field] && Array.isArray(npc[field]) ? npc[field][0] : null;
        const getClothingValue = (field) => {
          const clothing = npc['...'];
          if (!clothing || typeof clothing !== 'object') return '';
          const item = clothing[field];
          return item && Array.isArray(item) ? item[0] : '';
        };

        const memories = [];
        const memoryData = npc['...'];
        if (memoryData && Array.isArray(memoryData) && memoryData[0] && Array.isArray(memoryData[0])) {
          const memoryArray = memoryData[0];
          memoryArray.forEach(memory => {
            if (memory && memory !== '$__META_EXTENSIBLE__$') {
              memories.push(memory);
            }
          });
        }

        npcList.push({
          id: npcKey,
          ...: getValue('...') || npcKey,
          ДрузьяID: getValue('ДрузьяID') || '',
          ...: getValue('...') || '...',
          ...: getValue('...') || 0,
          ...: getValue('...') || 0,
          ...: getValue('...') || '...',
          ...: getValue('...') || '...',
          ...: getValue('...') || '...',
          ...: getValue('...') || '...',
          ...: getValue('...') || '...',
          ...: getValue('...') || '',
          ...: {
            ...: getClothingValue('...'),
            ...: getClothingValue('...'),
            ...: getClothingValue('...'),
            ...: getClothingValue('...'),
            ...: getClothingValue('...'),
            ...: getClothingValue('...'),
            ...: getClothingValue('...'),
            ...: getClothingValue('...'),
          },
          ...: memories
        });
      });

      console.log('[Статус] ...NPC...，...:', npcList.length);
      return npcList;
    }

    // /* Приложение */
    getAppContent() {
      // Открыть/* Приложение */（Новое）
      const statusData = this.getCurrentStatusData();
      this.userData = statusData.userData;
      this.npcList = statusData.npcList;
      console.log('[Статус] 📊 Открыть/* Приложение */...Статус...，Пользователь:', !!this.userData, 'NPC...:', this.npcList.length);

      return `
        <div class="cd-status-app">
          ${this.renderTabs()}
          <div class="cd-status-content">
            ${this.currentView === 'user' ? this.renderUserStatus() : this.renderNPCList()}
          </div>
        </div>
      `;
    }

    renderTabs() {
      return `
        <div class="cd-status-tabs">
          <button class="cd-status-tab ${this.currentView === 'user' ? 'cd-active' : ''}" data-view="user">
            ...Статус
          </button>
          <button class="cd-status-tab ${this.currentView === 'npc' ? 'cd-active' : ''}" data-view="npc">
            Статус NPC (${this.npcList.length})
          </button>
        </div>
      `;
    }

    // Статус пользователя
    renderUserStatus() {
      if (!this.userData) {
        return `
          <div class="cd-status-empty">
            <div class="cd-empty-icon">👤</div>
            <div class="cd-empty-text">...Статус...</div>
          </div>
        `;
      }

      return `
        <div class="cd-user-status-card">
          <div class="cd-status-header">
            <div class="cd-status-avatar">👤</div>
            <div class="cd-status-name">${this.userData....}</div>
            <div class="cd-status-currency">💰 ${this.userData....}</div>
          </div>

          <div class="cd-info-section">
            <div class="cd-info-title">...</div>
            <div class="cd-info-grid">
              <div class="cd-info-item">
                <span class="cd-info-label">...</span>
                <span class="cd-info-value">${this.userData....}</span>
              </div>
              <div class="cd-info-item">
                <span class="cd-info-label">...</span>
                <span class="cd-info-value">${this.userData....}...</span>
              </div>
              <div class="cd-info-item">
                <span class="cd-info-label">...</span>
                <span class="cd-info-value">${this.userData....}</span>
              </div>
              <div class="cd-info-item">
                <span class="cd-info-label">...</span>
                <span class="cd-info-value">${this.userData....}</span>
              </div>
              <div class="cd-info-item">
                <span class="cd-info-label">...</span>
                <span class="cd-info-value">${this.userData....}</span>
              </div>
            </div>
          </div>

          <div class="cd-info-section">
            <div class="cd-info-title">...</div>
            <div class="cd-info-text">${this.userData....}</div>
          </div>

          <div class="cd-info-section">
            <div class="cd-info-title">...</div>
            <div class="cd-info-text">${this.userData....}</div>
          </div>

          <div class="cd-info-section">
            <div class="cd-info-title">...</div>
            <div class="cd-clothing-list">
              ${this.renderClothingItem('...', this.userData........, true)}
              ${this.renderClothingItem('...', this.userData........, true)}
              ${this.renderClothingItem('...', this.userData........, true)}
              ${this.renderClothingItem('...', this.userData........, true)}
              ${this.renderClothingItem('...', this.userData........, true)}
              ${this.renderClothingItem('...', this.userData........, true)}
              ${this.renderClothingItem('...', this.userData........, true)}
              ${this.renderClothingItem('...', this.userData........, true)}
            </div>
          </div>
        </div>
      `;
    }

    // Одежда（isUser=true）
    renderClothingItem(slot, item, isUser = false) {
      const isEmpty = !item || item.trim() === '';
      const displayText = isEmpty ? '...' : item;

      if (isUser) {
        return `
          <div class="cd-clothing-item">
            <div class="cd-clothing-info">
              <span class="cd-clothing-slot">${slot}</span>
              <span class="cd-clothing-name ${isEmpty ? 'cd-empty' : ''}">${displayText}</span>
            </div>
            ${!isEmpty ? `<button class="cd-clothing-btn cd-remove" data-slot="${slot}">...</button>` : ''}
          </div>
        `;
      } else {
        return `
          <div class="cd-clothing-item">
            <span class="cd-clothing-slot">${slot}</span>
            <span class="cd-clothing-name ${isEmpty ? 'cd-empty' : ''}">${displayText}</span>
          </div>
        `;
      }
    }

    // NPC/* Список */
    renderNPCList() {
      if (!this.npcList.length) {
        return `
          <div class="cd-status-empty">
            <div class="cd-empty-icon">👥</div>
            <div class="cd-empty-text">...NPC...</div>
          </div>
        `;
      }

      const npcCards = this.npcList.map(npc => {
        const favorClass = this.getFavorClass(npc....);

        return `
          <div class="cd-npc-card">
            <div class="cd-npc-header" data-npc-id="${npc.id}">
              <div class="cd-npc-avatar">🧑</div>
              <div class="cd-npc-name">${npc....}</div>
              <div class="cd-npc-favor ${favorClass}">💕 ${npc....}</div>
                <div class="cd-npc-toggle">▶</div>
            </div>

            <div class="cd-npc-content cd-collapsed">
            <div class="cd-info-section cd-inner-thought-section">
              <div class="cd-info-title">💭 ...</div>
              <div class="cd-inner-thought">${npc.... || '...'}</div>
            </div>
            ${npc.ДрузьяID ? `<div class="cd-info-section">
              <div class="cd-info-title">ДрузьяID</div>
              <div class="cd-friend-id">${npc.ДрузьяID}</div>
            </div>` : ''}
            <div class="cd-info-section">
              <div class="cd-info-title">...</div>
              <div class="cd-info-grid">
                <div class="cd-info-item">
                  <span class="cd-info-label">...</span>
                  <span class="cd-info-value">${npc....}</span>
                </div>
                <div class="cd-info-item">
                  <span class="cd-info-label">...</span>
                  <span class="cd-info-value">${npc....}...</span>
                </div>
                <div class="cd-info-item">
                  <span class="cd-info-label">...</span>
                  <span class="cd-info-value">${npc....}</span>
                </div>
                <div class="cd-info-item">
                  <span class="cd-info-label">...</span>
                  <span class="cd-info-value">${npc....}</span>
                </div>
                <div class="cd-info-item">
                  <span class="cd-info-label">...</span>
                  <span class="cd-info-value">${npc....}</span>
                </div>
              </div>
            </div>

            <div class="cd-info-section">
              <div class="cd-info-title">...</div>
              <div class="cd-info-text">${npc....}</div>
            </div>

            <div class="cd-info-section">
              <div class="cd-info-title">...</div>
              <div class="cd-info-text">${npc....}</div>
            </div>

            <div class="cd-info-section">
              <div class="cd-info-title">...</div>
              <div class="cd-clothing-list">
                ${this.renderClothingItem('...', npc........, false)}
                ${this.renderClothingItem('...', npc........, false)}
                ${this.renderClothingItem('...', npc........, false)}
                ${this.renderClothingItem('...', npc........, false)}
                ${this.renderClothingItem('...', npc........, false)}
                ${this.renderClothingItem('...', npc........, false)}
                ${this.renderClothingItem('...', npc........, false)}
                ${this.renderClothingItem('...', npc........, false)}
              </div>
            </div>

            ${npc.....length > 0 ? `
              <div class="cd-info-section">
                <div class="cd-info-title">...</div>
                <div class="cd-memory-list">
                  ${npc.....map(memory => `
                    <div class="cd-memory-item">📝 ${memory}</div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="cd-npc-list">
          ${npcCards}
        </div>
      `;
    }

    getFavorClass(favor) {
      if (favor >= 60) return 'cd-favor-high';
      if (favor >= 20) return 'cd-favor-mid';
      if (favor >= -20) return 'cd-favor-neutral';
      if (favor >= -60) return 'cd-favor-low';
      return 'cd-favor-hostile';
    }

    // /* Приложение */
    updateAppContent() {
      const appContent = document.getElementById('app-content');
      if (appContent) {
        appContent.innerHTML = this.getAppContent();
        this.bindEvents();
      }
    }

    bindEvents() {
      document.querySelectorAll('.cd-status-tab').forEach(btn => {
        btn.addEventListener('click', e => {
          const view = e.target.getAttribute('data-view');
          this.switchView(view);
        });
      });

      document.querySelectorAll('.cd-clothing-btn.cd-remove').forEach(btn => {
        btn.addEventListener('click', e => {
          const slot = e.target.getAttribute('data-slot');
          this.removeClothing(slot);
        });
      });

      // NPC/
      document.querySelectorAll('.cd-npc-header').forEach(header => {
        header.addEventListener('click', e => {
          // Если，
          if (e.target.classList.contains('cd-npc-favor')) {
            return;
          }

          const npcCard = header.closest('.cd-npc-card');
          const content = npcCard.querySelector('.cd-npc-content');
          const toggle = header.querySelector('.cd-npc-toggle');

          if (content.classList.contains('cd-expanded')) {
            content.classList.remove('cd-expanded');
            content.classList.add('cd-collapsed');
            toggle.textContent = '▶';
          } else {
            content.classList.remove('cd-collapsed');
            content.classList.add('cd-expanded');
            toggle.textContent = '▼';
          }
        });
      });
    }

    // （Рюкзак）
    async removeClothing(slot) {
      try {
        console.log('[Статус] ...:', slot);

        // СообщенияID
        let targetMessageId = 'latest';
        if (typeof window.getLastMessageId === 'function' && typeof window.getChatMessages === 'function') {
          let currentId = window.getLastMessageId();
          while (currentId >= 0) {
            const message = window.getChatMessages(currentId).at(-1);
            if (message && message.role !== 'user') {
              targetMessageId = currentId;
              break;
            }
            currentId--;
          }
        }

        // Mvu
        const mvuData = window.Mvu.getMvuData({ type: 'message', message_id: targetMessageId });
        if (!mvuData || !mvuData.stat_data) {
          throw new Error('errorMvuerror');
        }

        const clothingItem = mvuData.stat_data['Пользователь']?.['...']?.[slot]?.[0];
        if (!clothingItem || clothingItem.trim() === '') {
          throw new Error('error');
        }

        console.log('[Статус] ...:', clothingItem);

        // 1. （）
        await window.Mvu.setMvuVariable(mvuData, `Пользователь.....${slot}[0]`, '', {
          reason: `...${slot}`,
          is_recursive: false
        });

        // 2. Рюкзак（）
        const backpackCategory = this.mapSlotToBackpackCategory(slot);
        const backpackPath = `....${backpackCategory}`;
        const backpackItems = mvuData.stat_data['...']?.[backpackCategory] || {};

        // Рюкзак
        const newBackpackCategory = { ...backpackItems };

        if (newBackpackCategory[clothingItem]) {
          // ，
          const currentCount = newBackpackCategory[clothingItem]['...']?.[0] || 0;
          newBackpackCategory[clothingItem] = {
            ...newBackpackCategory[clothingItem],
            ...: [currentCount + 1, newBackpackCategory[clothingItem]['...']?.[1] || '']
          };
          console.log('[Статус] ...，...:', clothingItem, '...:', currentCount + 1);
        } else {
          // ，
          newBackpackCategory[clothingItem] = {
            ...: [clothingItem, ''],
            ...: [1, ''],
            ...: [`${slot}...`, ''],
            ...: ['...', '']
          };
          console.log('[Статус] ...Рюкзак:', clothingItem);
        }

        // Настройки
        await window.Mvu.setMvuVariable(mvuData, backpackPath, newBackpackCategory, {
          reason: `${clothingItem}...Рюкзак`,
          is_recursive: false
        });

        // 3. （AI）
        // AIОтветить

        // Сохранить
        await window.Mvu.replaceMvuData(mvuData, { type: 'message', message_id: targetMessageId });

        console.log('[Статус] ✅ ...，...Рюкзак');

        // Обновить（ОбновитьUI）
        setTimeout(() => {
          this.parseStatusFromContext();
          // ЕслиСтатусapp，ОбновитьUI
          const appContent = document.getElementById('app-content');
          if (appContent && appContent.querySelector('.cd-status-app')) {
            console.log('[Статус] 🔄 ...ОбновитьСтатус/* Приложение */UI（...）...');
            appContent.innerHTML = this.getAppContent();
            this.bindEvents();
          }
          // УведомлениеРюкзакОбновить
          if (window.backpackApp && typeof window.backpackApp.refreshItemsData === 'function') {
            window.backpackApp.refreshItemsData();
          }
        }, 300);

      } catch (error) {
        console.error('[Статус] error:', error);
        alert('...: ' + error.message);
      }
    }

    // Рюкзак
    mapSlotToBackpackCategory(slot) {
      const mapping = {
        '...': '...',
        '...': '...',
        '...': '...',
        '...': '...',
        '...': '...',
        '...': '...',
        '...': '...',
        '...': '...'
      };
      return mapping[slot] || '...';
    }

    switchView(view) {
      this.currentView = view;
      this.updateAppContent();
    }

    // /* Приложение */
    destroy() {
      console.log('[Статус] .../* Приложение */，...');

      if (this.eventListenersSetup && this.messageReceivedHandler) {
        const eventSource = window['eventSource'];
        if (eventSource && eventSource.removeListener) {
          eventSource.removeListener('MESSAGE_RECEIVED', this.messageReceivedHandler);
          console.log('[Статус] 🗑️ ... MESSAGE_RECEIVED ...');
        }
      }

      this.eventListenersSetup = false;
      this.userData = null;
      this.npcList = [];
    }
  }

  window.RuApp_status = StatusApp;
  window.statusApp = new StatusApp();
}

// mobile-phone.js
window.getStatusAppContent = function () {
  console.log('[Статус] ...Статус/* Приложение */...');

  if (!window.statusApp) {
    console.error('[Статус] statusApperror');
    return '<div class="error-message">Статус/* Приложение */...</div>';
  }

  try {
    return window.statusApp.getAppContent();
  } catch (error) {
    console.error('[Статус] error/* Приложение */error:', error);
    return '<div class="error-message">...</div>';
  }
};

window.bindStatusAppEvents = function () {
  console.log('[Статус] ...Статус/* Приложение */...');

  if (!window.statusApp) {
    console.error('[Статус] statusApperror');
    return;
  }

  try {
    window.statusApp.bindEvents();
  } catch (error) {
    console.error('[Статус] error:', error);
  }
};

window.statusAppRefresh = function () {
  if (window.statusApp) {
    window.statusApp.refreshStatusData();
  }
};

window.statusAppDestroy = function () {
  if (window.statusApp) {
    window.statusApp.destroy();
    console.log('[Статус] /* Приложение */...');
  }
};

window.statusAppDebugInfo = function () {
  if (window.statusApp) {
    console.log('[Status App Debug] ===== ... =====');
    console.log('[Status App Debug] ...:', window.statusApp.currentView);
    console.log('[Status App Debug] Пользователь...:', window.statusApp.userData);
    console.log('[Status App Debug] NPC/* Список */:', window.statusApp.npcList);
    console.log('[Status App Debug] NPC...:', window.statusApp.npcList.length);

    console.log('[Status App Debug] ===== ... =====');
    console.log('[Status App Debug] Mvu ...:', !!window.Mvu);
    console.log('[Status App Debug] Mvu.getMvuData ...:', typeof window.Mvu?.getMvuData === 'function');
    console.log('[Status App Debug] getLastMessageId ...:', typeof window.getLastMessageId === 'function');
    console.log('[Status App Debug] getChatMessages ...:', typeof window.getChatMessages === 'function');

    if (window.Mvu && typeof window.Mvu.getMvuData === 'function') {
      try {
        let targetMessageId = 'latest';

        if (typeof window.getLastMessageId === 'function' && typeof window.getChatMessages === 'function') {
          let currentId = window.getLastMessageId();
          console.log('[Status App Debug] НовоеСообщения...:', currentId);

          // AIСообщения
          let searchCount = 0;
          while (currentId >= 0 && searchCount < 20) {
            const message = window.getChatMessages(currentId).at(-1);
            console.log(`[Status App Debug] ... ${currentId} ...:`, message ? `role=${message.role}` : '...Сообщения');

            if (message && message.role !== 'user') {
              targetMessageId = currentId;
              console.log(`[Status App Debug] ✅ ...AIСообщения...: ${currentId} (... ${searchCount} ...)`);
              break;
            }

            currentId--;
            searchCount++;
          }

          if (currentId < 0) {
            console.warn('[Status App Debug] ⚠️ errorПользовательСообщения，error latest');
          }
        }

        console.log('[Status App Debug] ...СообщенияID:', targetMessageId);

        // Mvu
        const mvuData = window.Mvu.getMvuData({ type: 'message', message_id: targetMessageId });
        console.log('[Status App Debug] Mvu ...:', mvuData);

        if (mvuData && mvuData.stat_data) {
          console.log('[Status App Debug] stat_data .../* Список */:', Object.keys(mvuData.stat_data));

          if (mvuData.stat_data['Пользователь']) {
            console.log('[Status App Debug] Пользователь...:', mvuData.stat_data['Пользователь']);
          } else {
            console.warn('[Status App Debug] ❌ errorПользовательerror');
          }

          if (mvuData.stat_data['NPC']) {
            const npcData = mvuData.stat_data['NPC'];
            console.log('[Status App Debug] NPC...:', npcData);
            const npcKeys = Object.keys(npcData).filter(k => k !== '$meta');
            console.log('[Status App Debug] NPC.../* Список */:', npcKeys);
            npcKeys.forEach(key => {
              console.log(`[Status App Debug] - NPC ${key}:`, npcData[key]);
            });
          } else {
            console.warn('[Status App Debug] ❌ errorNPCerror');
          }
        } else {
          console.error('[Status App Debug] ❌ stat_data error');
        }
      } catch (error) {
        console.error('[Status App Debug] error Mvu error:', error);
      }
    } else {
      console.warn('[Status App Debug] Mvu error');
    }

    // SillyTavern context（）
    if (window.SillyTavern) {
      const context = window.SillyTavern.getContext ? window.SillyTavern.getContext() : window.SillyTavern;
      console.log('[Status App Debug] SillyTavern context ...:', !!context);
      if (context && context.chatMetadata) {
        console.log('[Status App Debug] chatMetadata ...:', !!context.chatMetadata);
        console.log('[Status App Debug] variables ...:', !!context.chatMetadata.variables);
        if (context.chatMetadata.variables) {
          console.log('[Status App Debug] .../* Список */:', Object.keys(context.chatMetadata.variables));
        }
      }
    }
  }
};

console.log('[Статус] Статус/* Приложение */... - ... 2.0 (... + ...)');
console.log('[Статус] 💡 ...：... statusAppDebugInfo() ...');
