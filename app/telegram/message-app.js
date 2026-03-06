/**
 * Message App - .../* Приложение */
 * ...mobile-phone.js...Сообщения...
 */

// SillyTavern
let eventSource, event_types, chat, characters, this_chid, name1, name2;
let sillyTavernImportAttempted = false;

// /* Импорт */SillyTavern
async function importSillyTavernModules() {
  if (sillyTavernImportAttempted) {
    return;
  }
  sillyTavernImportAttempted = true;

  // ：
  if (window.DEBUG_MESSAGE_APP) {
    console.log('[Message App] 🔍 .../* Импорт */SillyTavern......');
    console.log('[Message App] 🔍 ...:');
    console.log('  - window.eventSource:', typeof window['eventSource'], !!window['eventSource']);
    console.log('  - window.event_types:', typeof window['event_types'], !!window['event_types']);
    console.log('  - window.chat:', typeof window['chat'], !!window['chat']);
  }

  try {
    eventSource = window['eventSource'];
    event_types = window['event_types'];
    chat = window['chat'];
    characters = window['characters'];
    this_chid = window['this_chid'];
    name1 = window['name1'];
    name2 = window['name2'];

    if (window.DEBUG_MESSAGE_APP) {
      console.log('[Message App] 🔍 ...:');
      console.log('  - eventSource:', !!eventSource, typeof eventSource);
      console.log('  - event_types:', !!event_types, typeof event_types);
    }

    if (eventSource && event_types) {
      if (window.DEBUG_MESSAGE_APP) {
        console.log('[Message App] ✅ ...SillyTavern...');
      }
      return;
    }
  } catch (error) {
    console.warn('[Message App] errorSillyTavernerror:', error);
  }

  try {
    // @ts-ignore - /* Импорт */，
    const scriptModule = await import('../../../script.js').catch(() => null);
    if (scriptModule) {
      if (window.DEBUG_MESSAGE_APP) {
        console.log('[Message App] 🔍 .../* Импорт */...:', Object.keys(scriptModule));
      }
      ({ eventSource, event_types, chat, characters, this_chid, name1, name2 } = scriptModule);
      if (window.DEBUG_MESSAGE_APP) {
        console.log('[Message App] ✅ .../* Импорт */...SillyTavern...');
      }
    }
  } catch (error) {
    console.warn('[Message App] error/* Импорт */errorSillyTavernerror:', error);
  }

  // Статус
  console.log('[Message App] 🔍 .../* Импорт */Статус:');
  console.log('  - eventSource:', !!eventSource, eventSource?.constructor?.name);
  console.log('  - event_types:', !!event_types, event_types ? Object.keys(event_types).length + ' events' : 'null');
}

if (typeof window.MessageApp === 'undefined') {
  class MessageApp {
    constructor() {
      this.currentView = 'list'; // 'list', 'addFriend', 'messageDetail', 'friendsCircle'
      this.currentTab = 'add'; // 'add', 'delete', 'createGroup', 'deleteGroup'
      this.currentMainTab = 'friends'; // 'friends', 'circle' - ...
      this.friendRenderer = null;
      this.currentFriendId = null;
      this.currentFriendName = null;
      this.currentIsGroup = null; // ...
      this.currentSelectedFriend = null; // ...Друзья，...Сообщения

      // Лента VK
      this.friendsCircle = null;
      this.friendsCircleInitialized = false;

      this.realtimeMonitor = null;
      this.lastMessageCount = 0;
      this.lastMessageId = null;
      this.isAutoRenderEnabled = true;
      this.lastRenderTime = 0;
      this.renderCooldown = 1000; // ...Время，...

      this.realTimeSync = null;
      this.syncEnabled = true;

      this.incrementalRenderer = null;
      this.useIncrementalRender = true; // ...
      this.fullRenderMode = false; // ...

      this.delayedRenderTimer = null; // ...
      this.delayedRenderDelay = 2000; // ...2...

      this.init();
    }

    init() {
      console.log('[Message App] .../* Приложение */...');

      // （Назад）
      this.bindEvents();

      // ，
      setTimeout(() => {
        this.loadFriendRenderer();
      }, 50);

      setTimeout(() => {
        this.setupIncrementalRenderer();
      }, 100);

      setTimeout(() => {
        this.setupRealtimeMonitor();
      }, 5000); // ...：...Время...5...，...SillyTavernЕщё...Время

      console.log('[Message App] .../* Приложение */...');

      setTimeout(() => {
        this.integrateRealTimeSync();
      }, 2000);

      // Лента VK
      setTimeout(() => {
        this.initFriendsCircle();
      }, 1000);

      // （，）
      setTimeout(() => {
        this.loadAttachmentSenderSilently();
      }, 1500);
    }

    // Настройки
    setupIncrementalRenderer() {
      console.log('[Message App] Настройки......');

      // ，
      setTimeout(() => {
        this.createIncrementalRenderer();
      }, 500);
    }

    createIncrementalRenderer() {
      try {
        // @ts-ignore -
        if (window['IncrementalRenderer']) {
          // @ts-ignore -
          this.incrementalRenderer = new window['IncrementalRenderer']();

          window.addEventListener('incrementalRenderUpdate', event => {
            // @ts-ignore -
            this.handleIncrementalUpdate(event.detail);
          });

          console.log('[Message App] ✅ ...');
        } else {
          console.log('[Message App] IncrementalRenderer ...，...');
          this.useIncrementalRender = false;
        }
      } catch (error) {
        console.warn('[Message App] error:', error);
        this.useIncrementalRender = false;
      }
    }

    handleIncrementalUpdate(detail) {
      if (window.DEBUG_MESSAGE_APP) {
        console.log('[Message App] ...:', detail);
      }

      if (!this.useIncrementalRender) {
        return;
      }

      // ：detailSillyTavern
      if (detail.eventType && detail.chatData) {
        // ：SillyTavern
        console.log('[Message App] ...SillyTavern...');

        // Если，Сообщения
        if (this.incrementalRenderer && detail.chatData.messages) {
          try {
            // SillyTavernСообщения
            this.incrementalRenderer.processNewMessages(detail.chatData.messages);
          } catch (error) {
            console.error('[Message App] error:', error);
          }
        }

        this.updateMessageListIncrementally();
      } else {
        // ：
        console.log('[Message App] ...');
        this.updateMessageListIncrementally();
      }
    }

    // Сообщения/* Список */
    updateMessageListIncrementally() {
      try {
        console.log('[Message App] 🔄 ...Сообщения/* Список */...');

        // ЕслиСообщения/* Список */，
        if (this.currentView !== 'list') {
          console.log('[Message App] ...Сообщения/* Список */...，...');
          return;
        }

        // Отменить/* Список */
        const messageListContainer = document.querySelector('.message-list');
        if (!messageListContainer) {
          console.warn('[Message App] errorСообщения/* Список */error');
          return;
        }

        // Друзья/* Список */
        this.refreshFriendListUI();

        console.log('[Message App] ✅ Сообщения/* Список */...');
      } catch (error) {
        console.error('[Message App] errorСообщения/* Список */error:', error);
      }
    }

    // ОбновитьДрузья/* Список */UI
    refreshFriendListUI() {
      try {
        if (window.DEBUG_MESSAGE_APP) {
          console.log('[Message App] 🔄 ОбновитьДрузья/* Список */UI...');
        }

        // Отменить/* Список */
        const messageListContainer = document.querySelector('.message-list');
        if (!messageListContainer) {
          console.warn('[Message App] errorСообщения/* Список */error');
          return;
        }

        // Друзья
        if (typeof window.renderFriendsFromContext !== 'function') {
          console.warn('[Message App] Друзьяerror，error...');
          this.loadFriendRenderer();
          return;
        }

        // Друзья/* Список */
        const friendsHTML = window.renderFriendsFromContext();
        messageListContainer.innerHTML = friendsHTML;

        this.bindMessageListEvents();

        console.log('[Message App] ✅ Друзья/* Список */UI...Обновить');
      } catch (error) {
        console.error('[Message App] ОбновитьДрузья/* Список */UIerror:', error);
      }
    }

    updateItemUnreadCount(item) {
      try {
        const unreadElement = item.querySelector('.unread-count');
        if (unreadElement) {
        }
      } catch (error) {
        console.error('[Message App] error:', error);
      }
    }

    // Время
    updateItemTimeDisplay(item) {
      try {
        const timeElement = item.querySelector('.time');
        if (timeElement) {
          // Время
          timeElement.textContent = new Date().toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
          });
        }
      } catch (error) {
        console.error('[Message App] errorВремяerror:', error);
      }
    }

    // Настройки
    setupRealtimeMonitor() {
      console.log('[Message App] НастройкиSillyTavern......');

      // SillyTavern
      this.setupSillyTavernEventListeners();
    }

    integrateRealTimeSync() {
      try {
        console.log('[Message App] 🔗 ......');

        if (!this.syncRetryCount) {
          this.syncRetryCount = 0;
        }

        if (!window.realTimeSync) {
          this.syncRetryCount++;

          if (this.syncRetryCount <= 3) {
            // 3
            console.warn(`[Message App] error，error${this.syncRetryCount}error...`);

            this.loadRealTimeSyncModule();

            setTimeout(() => {
              this.integrateRealTimeSync();
            }, 3000);
          } else {
            console.error('[Message App] ❌ error，error');
            this.setupFallbackSync(); // ...
          }
          return;
        }

        this.syncRetryCount = 0;

        // @ts-ignore -
        this.realTimeSync = window.realTimeSync;

        window.addEventListener('realTimeSyncUpdate', event => {
          // @ts-ignore -
          this.handleRealTimeSyncUpdate(event.detail);
        });

        console.log('[Message App] ✅ ...');
      } catch (error) {
        console.error('[Message App] error:', error);
      }
    }

    loadRealTimeSyncModule() {
      try {
        console.log('[Message App] 🔄 ......');

        const existingScript = document.querySelector('script[src*="real-time-sync.js"]');
        if (existingScript) {
          console.log('[Message App] ...');
          return;
        }

        const script = document.createElement('script');
        script.src = 'scripts/extensions/third-party/mobile/app/real-time-sync.js';
        script.onload = () => {
          console.log('[Message App] ✅ ...');
        };
        script.onerror = error => {
          console.error('[Message App] ❌ error:', error);
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error('[Message App] error:', error);
      }
    }

    // Настройки
    setupFallbackSync() {
      try {
        console.log('[Message App] 🔄 ......');

        if (this.fallbackSyncTimer) {
          clearInterval(this.fallbackSyncTimer);
        }

        this.fallbackSyncTimer = setInterval(() => {
          this.performFallbackSync();
        }, 5000); // 5...

        console.log('[Message App] ✅ ...');
      } catch (error) {
        console.error('[Message App] error:', error);
      }
    }

    async performFallbackSync() {
      try {
        // Сообщения/* Список */
        if (this.currentView !== 'list') {
          return;
        }

        if (window.contextMonitor) {
          // @ts-ignore -
          const chatData = await window.contextMonitor.getCurrentChatMessages();
          if (chatData && chatData.totalMessages !== this.lastMessageCount) {
            console.log('[Message App] 🔄 ...Сообщения...，Обновить/* Список */');
            this.updateMessageListIncrementally();
            this.lastMessageCount = chatData.totalMessages;
          }
        }
      } catch (error) {
        console.error('[Message App] error:', error);
      }
    }

    handleRealTimeSyncUpdate(detail) {
      try {
        if (window.DEBUG_MESSAGE_APP) {
          console.log('[Message App] 📡 ...:', detail);
        }

        if (!this.syncEnabled) {
          return;
        }

        if (this.currentView === 'list') {
          // Сообщения/* Список */，Друзья/* Список */
          this.handleFriendListUpdate(detail);
        } else if (this.currentView === 'messageDetail') {
          // Сообщения，Сообщения
          this.handleMessageDetailUpdate(detail);
        }
      } catch (error) {
        console.error('[Message App] error:', error);
      }
    }

    // Друзья/* Список */
    handleFriendListUpdate(detail) {
      try {
        console.log('[Message App] 👥 ...Друзья/* Список */...:', detail);

        // ДрузьяСообщения
        if (detail.hasNewFriends || detail.hasNewMessages) {
          console.log('[Message App] 🔄 ...Друзья...Сообщения，ОбновитьДрузья/* Список */');

          // ОбновитьДрузья/* Список */UI
          this.refreshFriendListUI();
        } else {
          console.log('[Message App] 🔄 ...');

          // Время
          this.updateExistingItemsOnly();
        }
      } catch (error) {
        console.error('[Message App] errorДрузья/* Список */error:', error);
      }
    }

    updateExistingItemsOnly() {
      try {
        const messageItems = document.querySelectorAll('.message-item');

        messageItems.forEach(item => {
          this.updateItemUnreadCount(item);

          // Время
          this.updateItemTimeDisplay(item);
        });

        console.log('[Message App] ✅ ...');
      } catch (error) {
        console.error('[Message App] error:', error);
      }
    }

    // Сообщения
    handleMessageDetailUpdate(detail) {
      try {
        if (detail.hasNewMessages) {
          if (window.DEBUG_MESSAGE_APP) {
            console.log('[Message App] 💬 ...Сообщения...');
          }

          // ОбновитьСообщения/* Страница деталей */
          this.refreshMessageDetail();
        }
      } catch (error) {
        console.error('[Message App] errorСообщенияerror:', error);
      }
    }

    // /
    setSyncEnabled(enabled) {
      this.syncEnabled = enabled;
      console.log(`[Message App] ... ${enabled ? '...' : '...'}`);
    }

    // Статус
    getRealTimeSyncStatus() {
      return {
        syncEnabled: this.syncEnabled,
        hasRealTimeSync: !!this.realTimeSync,
        realTimeSyncStatus: this.realTimeSync ? this.realTimeSync.getSyncStatus() : null,
      };
    }

    // НастройкиSillyTavern（Live App）
    async setupSillyTavernEventListeners() {
      try {
        console.log('[Message App] НастройкиSillyTavern......');

        const detectionResult = this.smartDetectEventSystem();
        if (detectionResult.found) {
          console.log('[Message App] ✅ ...:', detectionResult);

          const eventSource = detectionResult.eventSource;
          const event_types = detectionResult.event_types;

          // Сообщения
          if (event_types.MESSAGE_RECEIVED) {
            eventSource.on(event_types.MESSAGE_RECEIVED, this.onMessageReceived.bind(this));
            console.log('[Message App] ✅ ... MESSAGE_RECEIVED ...');

            // Сохранить
            this.eventSource = eventSource;
            this.event_types = event_types;
            this.isEventListening = true;

            // Сообщения
            this.updateMessageCount();
            return;
          }
        }

        // ：，Время
        if (!this.retryCount) this.retryCount = 0;
        this.retryCount++;

        if (this.retryCount <= 10) {
          // 510
          console.log(`[Message App] ...: ${this.retryCount}/10`);
          setTimeout(() => {
            this.setupSillyTavernEventListeners();
          }, 2000 + this.retryCount * 1000); // ...Время：2... + ...1...
        } else {
          console.warn('[Message App] error，error...');
          // ：，
          setTimeout(() => {
            this.retryCount = 0; // ...
            this.setupSillyTavernEventListeners();
          }, 10000); // 10...
        }
        return;
      } catch (error) {
        console.error('[Message App] НастройкиSillyTavernerror:', error);
        this.fallbackToPolling();
      }
    }

    // （Live App）
    smartDetectEventSystem() {
      console.log('[Message App] 🧠 ......');

      const detectionMethods = [
        // 1: SillyTavern.getContext().eventSource（Рекомендации，Live App）
        () => {
          if (
            typeof window !== 'undefined' &&
            window.SillyTavern &&
            typeof window.SillyTavern.getContext === 'function'
          ) {
            const context = window.SillyTavern.getContext();
            if (context && context.eventSource && typeof context.eventSource.on === 'function' && context.event_types) {
              return {
                eventSource: context.eventSource,
                event_types: context.event_types,
                foundIn: 'SillyTavern.getContext()',
              };
            }
          }
          return null;
        },

        // 2: eventOn （Live App）
        () => {
          if (typeof eventOn === 'function' && typeof tavern_events !== 'undefined' && tavern_events.MESSAGE_RECEIVED) {
            return {
              eventSource: { on: eventOn, off: eventOff || (() => {}) },
              event_types: tavern_events,
              foundIn: 'global eventOn',
            };
          }
          return null;
        },

        // 3: eventSource（Live App）
        () => {
          if (
            typeof window !== 'undefined' &&
            window.parent &&
            window.parent.eventSource &&
            typeof window.parent.eventSource.on === 'function'
          ) {
            if (window.parent.event_types && window.parent.event_types.MESSAGE_RECEIVED) {
              return {
                eventSource: window.parent.eventSource,
                event_types: window.parent.event_types,
                foundIn: 'parent.eventSource',
              };
            }
          }
          return null;
        },
      ];

      for (let i = 0; i < detectionMethods.length; i++) {
        try {
          const result = detectionMethods[i]();
          if (result && result.eventSource && result.event_types) {
            console.log(`[Message App] ✅ ...${i + 1}...:`, result);
            return {
              found: true,
              method: i + 1,
              ...result,
            };
          }
        } catch (error) {
          console.warn(`[Message App] error${i + 1}error:`, error);
        }
      }

      console.warn('[Message App] ❌ error');
      return { found: false };
    }

    /**
     * ...Сообщения...（...API）
     */
    getCurrentMessageCount() {
      try {
        // 1: SillyTavern.getContext().chat（）
        if (
          typeof window !== 'undefined' &&
          window.SillyTavern &&
          typeof window.SillyTavern.getContext === 'function'
        ) {
          const context = window.SillyTavern.getContext();
          if (context && context.chat && Array.isArray(context.chat)) {
            const count = context.chat.length;
            return count;
          }
        }

        // 2: mobileContextEditor
        const mobileContextEditor = window['mobileContextEditor'];
        if (mobileContextEditor && typeof mobileContextEditor.getCurrentChatData === 'function') {
          const chatData = mobileContextEditor.getCurrentChatData();
          if (chatData && chatData.messages && Array.isArray(chatData.messages)) {
            return chatData.messages.length;
          }
        }

        // 3: chat
        if (typeof window !== 'undefined' && window.parent && window.parent.chat && Array.isArray(window.parent.chat)) {
          const count = window.parent.chat.length;
          return count;
        }

        return 0;
      } catch (error) {
        console.warn('[Message App] errorОтменитьerror:', error);
        return 0;
      }
    }

    /**
     * ...Сообщения...
     */
    updateMessageCount() {
      this.lastMessageCount = this.getCurrentMessageCount();
      console.log(`[Message App] ...Сообщения...: ${this.lastMessageCount}`);
    }

    /**
     * ...Сообщения...
     */
    async onMessageReceived(messageId) {
      try {
        if (window.DEBUG_MESSAGE_APP) {
          console.log(`[Message App] 🎯 ...Сообщения...，ID: ${messageId}`);
        }

        // Сообщения
        const currentMessageCount = this.getCurrentMessageCount();

        if (currentMessageCount <= this.lastMessageCount) {
          return;
        }

        console.log(`[Message App] ✅ ...Сообщения: ${this.lastMessageCount} → ${currentMessageCount}`);
        this.lastMessageCount = currentMessageCount;

        // 2
        this.scheduleDelayedRender('...Сообщения');
      } catch (error) {
        console.error('[Message App] errorСообщенияerror:', error);
      }
    }

    // SillyTavernСообщения
    handleSillyTavernMessage(eventType, messageId) {
      if (!this.isAutoRenderEnabled) {
        return;
      }

      // - СообщенияВремя
      const now = Date.now();
      const cooldownTime = this.isGroupMessageEvent(eventType, messageId)
        ? Math.min(this.renderCooldown, 500)
        : this.renderCooldown;

      if (now - this.lastRenderTime < cooldownTime) {
        return;
      }

      this.lastRenderTime = now;

      console.log(`[Message App] ...SillyTavernСообщения...: ${eventType}, messageId: ${messageId}`);

      // Новое
      const chatData = this.getSillyTavernChatData();
      if (!chatData) {
        console.warn('[Message App] errorSillyTavernerror');
        return;
      }

      // Сообщения
      const hasGroupMessage = this.checkForGroupMessagesInChatData(chatData);
      if (hasGroupMessage) {
        console.log('[Message App] 🔄 ...Сообщения，...');
        // Сообщения，
        this.forceGroupChatRender();
      }

      // Статус
      this.lastMessageCount = chatData.messages.length;
      this.lastMessageId = chatData.lastMessageId;

      if (this.useIncrementalRender && this.incrementalRenderer && !hasGroupMessage) {
        console.log('[Message App] ...SillyTavern...');
        this.handleIncrementalUpdate({
          eventType,
          messageId,
          chatData,
          timestamp: now,
        });
      } else {
        console.log('[Message App] ...SillyTavern...');
        this.triggerAutoRender();
      }

      this.dispatchSillyTavernSyncEvent(eventType, messageId, chatData);
    }

    // Сообщения
    isGroupMessageEvent(eventType, messageId) {
      try {
        const chatData = this.getSillyTavernChatData();
        if (!chatData || !chatData.messages || chatData.messages.length === 0) {
          return false;
        }

        // Сообщения
        const recentMessages = chatData.messages.slice(-3); // ...3...Сообщения
        return recentMessages.some(message => {
          if (message.mes && typeof message.mes === 'string') {
            return message.mes.includes('[...Сообщения|') || message.mes.includes('[...Сообщения|');
          }
          return false;
        });
      } catch (error) {
        console.error('[Message App] errorСообщенияerror:', error);
        return false;
      }
    }

    // Сообщения
    checkForGroupMessagesInChatData(chatData) {
      try {
        if (!chatData || !chatData.messages || chatData.messages.length === 0) {
          return false;
        }

        // НовоеСообщения
        const recentMessages = chatData.messages.slice(-5);
        const hasGroupMessages = recentMessages.some(message => {
          if (message.mes && typeof message.mes === 'string') {
            // Сообщения
            const groupPatterns = [
              /\[...Сообщения\|[^|]+\|[^|]+\|[^|]+\|[^\]]+\]/,
              /\[...Сообщения\|...\|[^|]+\|[^|]+\|[^\]]+\]/,
              /\[...\|[^|]+\|[^|]+\|[^\]]+\]/,
            ];

            return groupPatterns.some(pattern => pattern.test(message.mes));
          }
          return false;
        });

        if (hasGroupMessages) {
          console.log('[Message App] 📱 ...Сообщения');
        }

        return hasGroupMessages;
      } catch (error) {
        console.error('[Message App] errorСообщенияerror:', error);
        return false;
      }
    }

    forceGroupChatRender() {
      try {
        console.log('[Message App] 🔄 ......');

        // 1.
        if (this.incrementalRenderer) {
          this.incrementalRenderer.clearCache();
        }

        // 2. ОбновитьДрузья
        if (window.friendRenderer && typeof window.friendRenderer.refresh === 'function') {
          window.friendRenderer.refresh();
        }

        // 3.
        if (this.currentView === 'list') {
          // ОбновитьСообщения/* Список */
          setTimeout(() => {
            this.forceRefreshMessageList();
          }, 100);
        } else if (this.currentView === 'messageDetail' && this.currentFriendId) {
          // ОбновитьСообщения
          setTimeout(() => {
            this.forceRefreshMessageDetail();
          }, 100);
        }

        // 4. Время，
        this.lastRenderTime = Date.now() - this.renderCooldown;

        console.log('[Message App] ✅ ...');
      } catch (error) {
        console.error('[Message App] error:', error);
      }
    }

    // ОбновитьСообщения/* Список */
    forceRefreshMessageList() {
      try {
        console.log('[Message App] 🔄 ...ОбновитьСообщения/* Список */...');

        const messageList = document.getElementById('message-list');
        if (messageList && window.renderFriendsFromContext) {
          const loadingDiv = document.createElement('div');
          loadingDiv.className = 'group-loading-hint';
          loadingDiv.innerHTML = '🔄 ...Сообщения...';
          loadingDiv.style.cssText = `
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: #2196F3;
                    color: white;
                    padding: 8px 12px;
                    border-radius: 15px;
                    font-size: 12px;
                    z-index: 1000;
                    animation: pulse 0.5s ease-in-out;
                `;
          messageList.appendChild(loadingDiv);

          // HTML
          const newFriendsHtml = window.renderFriendsFromContext();
          messageList.innerHTML = newFriendsHtml;

          this.bindMessageListEvents();

          setTimeout(() => {
            if (loadingDiv.parentNode) {
              loadingDiv.remove();
            }
          }, 1000);

          console.log('[Message App] ✅ Сообщения/* Список */...Обновить...');
        }
      } catch (error) {
        console.error('[Message App] errorОбновитьСообщения/* Список */error:', error);
      }
    }

    // ОбновитьСообщения
    forceRefreshMessageDetail() {
      try {
        console.log('[Message App] 🔄 ...ОбновитьСообщения......');

        if (this.currentView === 'messageDetail' && this.currentFriendId) {
          // Сообщения
          this.loadMessageDetailAsync();
          console.log('[Message App] ✅ Сообщения...Обновить...');
        }
      } catch (error) {
        console.error('[Message App] errorОбновитьСообщенияerror:', error);
      }
    }

    handleChatChanged(chatId) {
      console.log('[Message App] ...:', chatId);

      // Статус
      this.lastMessageCount = 0;
      this.lastMessageId = null;

      // Если，
      if (this.incrementalRenderer) {
        this.incrementalRenderer.clearCache();
      }

      if (this.currentView === 'list') {
        this.triggerAutoRender();
      }
    }

    // SillyTavern（API）
    getSillyTavernChatData() {
      try {
        // SillyTavern.getContext().chat
        if (
          typeof window !== 'undefined' &&
          window.SillyTavern &&
          typeof window.SillyTavern.getContext === 'function'
        ) {
          const context = window.SillyTavern.getContext();
          if (context && context.chat && Array.isArray(context.chat)) {
            const messages = context.chat;
            const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

            return {
              messages: messages,
              messageCount: messages.length,
              lastMessageId: lastMessage ? lastMessage.send_date || lastMessage.id || messages.length - 1 : null,
              currentCharacter:
                context.characters && context.this_chid !== undefined ? context.characters[context.this_chid] : null,
              userName: context.name1 || 'User',
              characterName: context.name2 || 'Assistant',
            };
          }
        }

        // （）
        const chat = window['chat'];
        if (chat && Array.isArray(chat)) {
          const messages = chat;
          const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

          return {
            messages: messages,
            messageCount: messages.length,
            lastMessageId: lastMessage ? lastMessage.send_date || lastMessage.id || messages.length - 1 : null,
            currentCharacter:
              window['characters'] && window['this_chid'] !== undefined
                ? window['characters'][window['this_chid']]
                : null,
            userName: window['name1'] || 'User',
            characterName: window['name2'] || 'Assistant',
          };
        }

        return null;
      } catch (error) {
        console.error('[Message App] errorSillyTavernerror:', error);
        return null;
      }
    }

    // SillyTavern
    dispatchSillyTavernSyncEvent(eventType, messageId, chatData) {
      try {
        const event = new CustomEvent('messageAppSillyTavernSync', {
          detail: {
            eventType,
            messageId,
            chatData,
            timestamp: Date.now(),
            view: this.currentView,
            renderMode: this.useIncrementalRender ? 'incremental' : 'full',
          },
        });
        window.dispatchEvent(event);
      } catch (error) {
        console.error('[Message App] errorSillyTavernerror:', error);
      }
    }

    // ：，Ещё
    fallbackToPolling() {
      console.warn('[Message App] error，error...');

      // ，ЕщёВремя
      setTimeout(() => {
        this.retryCount = 0;
        this.setupSillyTavernEventListeners();
      }, 15000); // 15...

      // Если，
      setTimeout(() => {
        if (!this.isEventListening) {
          console.warn('[Message App] error');
          this.startSimplePolling();
        }
      }, 30000); // 30...，...
    }

    startRealtimeMonitor() {
      // setupSillyTavernEventListeners
      console.log('[Message App] startRealtimeMonitor...setupSillyTavernEventListeners...');
    }

    startSimplePolling() {
      console.log('[Message App] ...（...）...');

      setInterval(() => {
        this.checkForNewMessages();
      }, 2000); // ...，...
    }

    // Сообщения（）
    checkForNewMessages() {
      try {
        const chatData = this.getSillyTavernChatData();
        if (!chatData) {
          return;
        }

        // Сообщения
        if (
          chatData.messageCount > this.lastMessageCount ||
          (chatData.lastMessageId && chatData.lastMessageId !== this.lastMessageId)
        ) {
          console.log('[Message App] ...Сообщения:', {
            oldCount: this.lastMessageCount,
            newCount: chatData.messageCount,
            oldId: this.lastMessageId,
            newId: chatData.lastMessageId,
          });

          this.lastMessageCount = chatData.messageCount;
          this.lastMessageId = chatData.lastMessageId;

          this.handleSillyTavernMessage('polling_detected', chatData.messageCount - 1);
        }
      } catch (error) {
        console.error('[Message App] errorСообщенияerror:', error);
      }
    }

    // Сообщения
    getCurrentMessageCount() {
      try {
        if (chat && Array.isArray(chat)) {
          return chat.length;
        }

        // SillyTavern
        const sillyTavern = window['SillyTavern'];
        if (sillyTavern && typeof sillyTavern.getContext === 'function') {
          const context = sillyTavern.getContext();
          if (context && context.chat) {
            return context.chat.length;
          }
        }

        return 0;
      } catch (error) {
        console.error('[Message App] errorОтменитьerror:', error);
        return 0;
      }
    }

    // СообщенияID
    getCurrentLastMessageId() {
      try {
        if (chat && Array.isArray(chat) && chat.length > 0) {
          const lastMessage = chat[chat.length - 1];
          return lastMessage.send_date || lastMessage.id || JSON.stringify(lastMessage).substring(0, 50);
        }

        // SillyTavern
        const sillyTavern = window['SillyTavern'];
        if (sillyTavern && typeof sillyTavern.getContext === 'function') {
          const context = sillyTavern.getContext();
          if (context && context.chat && context.chat.length > 0) {
            const lastMessage = context.chat[context.chat.length - 1];
            return lastMessage.send_date || lastMessage.id || JSON.stringify(lastMessage).substring(0, 50);
          }
        }

        return null;
      } catch (error) {
        console.error('[Message App] errorСообщенияIDerror:', error);
        return null;
      }
    }

    handleContextChange() {
      if (!this.isAutoRenderEnabled) {
        return;
      }

      const now = Date.now();

      // Время
      if (now - this.lastRenderTime < this.renderCooldown) {
        return;
      }

      this.lastRenderTime = now;

      console.log('[Message App] ...，......');

      if (this.useIncrementalRender && this.incrementalRenderer) {
        // （）
        console.log('[Message App] ...');
        // Сообщения，
        this.triggerLightweightUpdate();
      } else {
        console.log('[Message App] ...');
        this.triggerAutoRender();
      }
    }

    // （，Статус）
    triggerLightweightUpdate() {
      try {
        console.log('[Message App] ......');

        // 1. Сообщения（/* Список */）
        if (this.currentView === 'list') {
          this.updateMessageCountsOnly();
        }

        // 2. Сообщения/* Страница деталей */，Сообщения
        if (this.currentView === 'messageDetail' && this.currentFriendId) {
          this.checkForNewMessagesInCurrentChat();
        }

        // 3. Уведомление
        this.dispatchLightweightRenderEvent();

        console.log('[Message App] ✅ ...');
      } catch (error) {
        console.error('[Message App] error:', error);
      }
    }

    // Сообщения
    updateMessageCountsOnly() {
      try {
        const messageItems = document.querySelectorAll('.message-item');

        messageItems.forEach(item => {
          const unreadCount = item.querySelector('.unread-count');
          if (unreadCount) {
            // "Сообщения"
            unreadCount.classList.add('has-new-message');

            // 3
            setTimeout(() => {
              unreadCount.classList.remove('has-new-message');
            }, 3000);
          }

          // Время"только что"
          const timeElement = item.querySelector('.time');
          if (timeElement) {
            timeElement.textContent = 'только что';
            timeElement.classList.add('just-updated');

            // 5Время
            setTimeout(() => {
              timeElement.classList.remove('just-updated');
              timeElement.textContent = new Date().toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
              });
            }, 5000);
          }
        });

        console.log('[Message App] ✅ Сообщения...');
      } catch (error) {
        console.error('[Message App] errorСообщенияerror:', error);
      }
    }

    // Сообщения
    checkForNewMessagesInCurrentChat() {
      try {
        // Сообщения
        // ЕслиСообщения，
        const messageContainer = document.querySelector('.message-detail-content');
        if (messageContainer) {
          // Сообщения
          const newMessageHint = document.createElement('div');
          newMessageHint.className = 'new-message-hint';
          newMessageHint.innerHTML = '💬 ...Сообщения';
          newMessageHint.style.cssText = `
                    position: absolute;
                    bottom: 20px;
                    right: 20px;
                    background: #2196F3;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 12px;
                    animation: fadeInOut 3s ease-in-out;
                `;

          messageContainer.appendChild(newMessageHint);

          // 3
          setTimeout(() => {
            if (newMessageHint.parentNode) {
              newMessageHint.parentNode.removeChild(newMessageHint);
            }
          }, 3000);
        }
      } catch (error) {
        console.error('[Message App] errorСообщенияerror:', error);
      }
    }

    dispatchLightweightRenderEvent() {
      try {
        const event = new CustomEvent('messageAppLightweightRender', {
          detail: {
            timestamp: Date.now(),
            view: this.currentView,
            mode: 'incremental',
            friendId: this.currentFriendId,
            selectedFriend: this.currentSelectedFriend,
          },
        });
        window.dispatchEvent(event);
      } catch (error) {
        console.error('[Message App] error:', error);
      }
    }

    async triggerAutoRender() {
      try {
        // 1. Друзья/* Список */
        await this.updateFriendListRender();

        // 2. Сообщения/* Список */，Обновить/* Список */
        if (this.currentView === 'list') {
          this.refreshMessageList();
        }

        // 3. Сообщения/* Страница деталей */，Обновить
        if (this.currentView === 'messageDetail' && this.currentFriendId) {
          this.refreshMessageDetail();
        }

        // 4. ，Уведомление
        this.dispatchRenderEvent();

        console.log('[Message App] ✅ ...');
      } catch (error) {
        console.error('[Message App] error:', error);
      }
    }

    // Друзья/* Список */
    async updateFriendListRender() {
      try {
        if (window.renderFriendsFromContext) {
          // Друзья
          if (this.friendRenderer && typeof this.friendRenderer.refresh === 'function') {
            await this.friendRenderer.refresh();
          }
        }
      } catch (error) {
        console.error('[Message App] errorДрузья/* Список */error:', error);
      }
    }

    // ОбновитьСообщения/* Список */
    refreshMessageList() {
      try {
        if (this.currentView === 'list') {
          const messageList = document.getElementById('message-list');
          if (messageList && window.renderFriendsFromContext) {
            const newFriendsHtml = window.renderFriendsFromContext();
            messageList.innerHTML = newFriendsHtml;

            this.bindMessageListEvents();
          }
        }
      } catch (error) {
        console.error('[Message App] ОбновитьСообщения/* Список */error:', error);
      }
    }

    // ОбновитьСообщения
    refreshMessageDetail() {
      try {
        if (this.currentView === 'messageDetail' && this.currentFriendId) {
          // Сообщения
          this.loadMessageDetailAsync();
        }
      } catch (error) {
        console.error('[Message App] ОбновитьСообщенияerror:', error);
      }
    }

    // Сообщения/* Список */
    bindMessageListEvents() {
      const messageItems = document.querySelectorAll('.message-item');
      messageItems.forEach(item => {
        item.addEventListener('click', e => {
          const target = e.currentTarget;
          const friendId = target && target.getAttribute ? target.getAttribute('data-friend-id') : null;
          if (friendId) {
            this.selectFriend(friendId);
          }
        });
      });
    }

    dispatchRenderEvent() {
      try {
        const event = new CustomEvent('messageAppRender', {
          detail: {
            timestamp: Date.now(),
            view: this.currentView,
            friendId: this.currentFriendId,
            selectedFriend: this.currentSelectedFriend,
          },
        });
        window.dispatchEvent(event);
      } catch (error) {
        console.error('[Message App] error:', error);
      }
    }

    // /
    setAutoRenderEnabled(enabled) {
      this.isAutoRenderEnabled = enabled;
      console.log(`[Message App] ... ${enabled ? '...' : '...'}`);
    }

    // НастройкиВремя
    setRenderCooldown(ms) {
      this.renderCooldown = ms;
      console.log(`[Message App] ...ВремяНастройки... ${ms}ms`);
    }

    stopRealtimeMonitor() {
      if (this.realtimeMonitor && typeof this.realtimeMonitor.stop === 'function') {
        this.realtimeMonitor.stop();
        console.log('[Message App] ...');
      }
    }

    // Статус
    getMonitorStatus() {
      return {
        isEnabled: this.isAutoRenderEnabled,
        hasMonitor: !!this.realtimeMonitor,
        isRunning: this.realtimeMonitor?.isRunning || false,
        lastMessageCount: this.lastMessageCount,
        lastMessageId: this.lastMessageId,
        lastRenderTime: this.lastRenderTime,
        renderCooldown: this.renderCooldown,
        // Статус
        useIncrementalRender: this.useIncrementalRender,
        hasIncrementalRenderer: !!this.incrementalRenderer,
        incrementalStatus: this.incrementalRenderer?.getStatus() || null,
        fullRenderMode: this.fullRenderMode,
      };
    }

    toggleRenderMode() {
      this.useIncrementalRender = !this.useIncrementalRender;
      this.fullRenderMode = !this.useIncrementalRender;

      if (this.useIncrementalRender) {
        console.log('[Message App] 🔄 ...（...）');
        this.renderCooldown = 3000; // ...Время
      } else {
        console.log('[Message App] 🔄 ...（...）');
        this.renderCooldown = 1000; // ...Время
      }

      return this.useIncrementalRender;
    }

    enableIncrementalRender() {
      this.useIncrementalRender = true;
      this.fullRenderMode = false;
      this.renderCooldown = 3000;

      if (this.incrementalRenderer) {
        this.incrementalRenderer.setEnabled(true);
      }

      console.log('[Message App] ✅ ...');
    }

    disableIncrementalRender() {
      this.useIncrementalRender = false;
      this.fullRenderMode = true;
      this.renderCooldown = 1000;

      if (this.incrementalRenderer) {
        this.incrementalRenderer.setEnabled(false);
      }

      console.log('[Message App] ⚠️ ...，...');
    }

    forceFullRender() {
      console.log('[Message App] 🔄 ......');

      const originalMode = this.useIncrementalRender;
      this.useIncrementalRender = false;

      this.triggerAutoRender();

      setTimeout(() => {
        this.useIncrementalRender = originalMode;
      }, 1000);
    }

    clearIncrementalCache() {
      if (this.incrementalRenderer) {
        this.incrementalRenderer.clearCache();
        console.log('[Message App] 🗑️ ...');
      }
    }

    getRenderPerformanceStats() {
      const stats = {
        renderMode: this.useIncrementalRender ? 'incremental' : 'full',
        renderCooldown: this.renderCooldown,
        lastRenderTime: this.lastRenderTime,
        renderCount: 0, // ...
        incrementalStats: null,
      };

      if (this.incrementalRenderer) {
        stats.incrementalStats = this.incrementalRenderer.getStatus();
      }

      return stats;
    }

    /**
     * ...（2...）
     * ...Сообщения...Обновить
     */
    scheduleDelayedRender(reason = '...') {
      if (this.delayedRenderTimer) {
        clearTimeout(this.delayedRenderTimer);
      }

      console.log(`[Message App] ⏰ ...${this.delayedRenderDelay / 1000}... (...: ${reason})`);

      // Настройки
      this.delayedRenderTimer = setTimeout(async () => {
        console.log(`[Message App] 🎯 ... (...: ${reason})`);
        await this.triggerAutoRender();
        this.delayedRenderTimer = null;
      }, this.delayedRenderDelay);
    }

    /**
     * Отменить...
     */
    cancelDelayedRender() {
      if (this.delayedRenderTimer) {
        clearTimeout(this.delayedRenderTimer);
        this.delayedRenderTimer = null;
        console.log('[Message App] ❌ Отменить...');
      }
    }

    // Друзья
    async loadFriendRenderer() {
      if (window.friendRenderer) {
        this.friendRenderer = window.friendRenderer;
        console.log('[Message App] Друзья...');
        return;
      }

      // Если，
      setTimeout(() => {
        // @ts-ignore - Друзья
        if (window.friendRenderer) {
          // @ts-ignore - Друзья
          this.friendRenderer = window.friendRenderer;
          console.log('[Message App] Друзья...');
        } else {
          console.log('[Message App] Друзья...');
        }
      }, 100);
    }

    // Лента VK
    initFriendsCircle() {
      try {
        console.log('[Message App] ...Лента VK......');

        // Если，Назад
        if (this.friendsCircle && this.friendsCircleInitialized) {
          console.log('[Message App] Лента VK...，...');
          return;
        }

        // Лента VK
        if (window.friendsCircle && !this.friendsCircle) {
          console.log('[Message App] ...Лента VK...');
          this.friendsCircle = window.friendsCircle;
          this.friendsCircleInitialized = true;
          return;
        }

        // Лента VK
        if (typeof window.FriendsCircle === 'undefined') {
          console.warn('[Message App] Лента VKerror，error');
          setTimeout(() => {
            this.initFriendsCircle();
          }, 1000);
          return;
        }

        if (!this.friendsCircle) {
          console.log('[Message App] ...Лента VK...');
          this.friendsCircle = new window.FriendsCircle();
          this.friendsCircleInitialized = true;

          // ，
          window.friendsCircle = this.friendsCircle;

          // Лента VK（）
          if (!this.friendsCircleEventBound) {
            window.addEventListener('friendsCircleUpdate', event => {
              this.handleFriendsCircleUpdate(event.detail);
            });
            this.friendsCircleEventBound = true;
          }
        }

        console.log('[Message App] Лента VK...');
      } catch (error) {
        console.error('[Message App] Лента VKerror:', error);
      }
    }

    // Лента VK
    handleFriendsCircleUpdate(detail) {
      try {
        if (this.currentMainTab === 'circle' && this.currentView === 'list') {
          // ЕслиЛента VK，Обновить
          this.updateAppContent();
        }
      } catch (error) {
        console.error('[Message App] errorЛента VKerror:', error);
      }
    }

    async switchMainTab(tabName) {
      console.log(`[Message App] ...: ${tabName}`);
      this.currentMainTab = tabName;

      if (tabName === 'circle') {
        // Лента VK
        await this.showFriendsCircle();
      } else {
        // Друзья/* Список */
        this.showMessageList();
      }
    }

    // Друзья/* Список */
    showMessageList() {
      console.log('[Message App] ...Друзья/* Список */...');
      this.currentMainTab = 'friends';
      this.currentView = 'list';

      // Лента VK
      if (this.friendsCircle) {
        this.friendsCircle.deactivate();
      }

      this.updateAppContent();

      // Уведомление/* Приложение */Статус
      if (window.mobilePhone) {
        const messageState = {
          app: 'messages',
          view: 'messageList',
          title: '...',
          showBackButton: false,
          showAddButton: true,
          addButtonIcon: 'fas fa-plus',
          addButtonAction: () => {
            if (window.messageApp) {
              window.messageApp.showAddFriend();
            }
          },
        };
        window.mobilePhone.currentAppState = messageState;
        window.mobilePhone.updateAppHeader(messageState);
      }
    }

    // Лента VK
    async showFriendsCircle() {
      console.log('[Message App] ...Лента VK...');
      this.currentMainTab = 'circle';
      this.currentView = 'list';

      // Лента VK
      if (!this.friendsCircle) {
        console.log('[Message App] Лента VK...，......');

        if (window.friendsCircle) {
          console.log('[Message App] ...Лента VK...');
          this.friendsCircle = window.friendsCircle;
        } else {
          // Если，
          this.initFriendsCircle();

          // Лента VK
          let retryCount = 0;
          while (!this.friendsCircle && retryCount < 10) {
            await new Promise(resolve => setTimeout(resolve, 100));
            retryCount++;
          }

          if (!this.friendsCircle) {
            console.error('[Message App] Лента VKerror');
            this.updateAppContent();
            return;
          }
        }
      }

      // Лента VK
      this.friendsCircle.activate();

      // Лента VK
      try {
        await this.friendsCircle.refreshFriendsCircle();
      } catch (error) {
        console.error('[Message App] Лента VKerror:', error);
      }

      this.updateAppContent();

      // Уведомление/* Приложение */Статус
      if (window.mobilePhone) {
        const circleState = {
          app: 'messages',
          view: 'friendsCircle',
          title: 'Лента VK',
          showBackButton: false,
          showAddButton: true,
          addButtonIcon: 'fas fa-camera',
          addButtonAction: () => {
            if (window.friendsCircle) {
              window.friendsCircle.showPublishModal();
            }
          },
        };
        window.mobilePhone.currentAppState = circleState;
        window.mobilePhone.updateAppHeader(circleState);
      }
    }

    // /* Приложение */
    getAppContent() {
      switch (this.currentView) {
        case 'list':
          if (this.currentMainTab === 'circle') {
            return this.renderFriendsCircle();
          } else {
            return this.renderMessageList();
          }
        case 'addFriend':
          return this.renderAddFriend();
        case 'messageDetail':
          return this.renderMessageDetail();
        default:
          return this.renderMessageList();
      }
    }

    // Лента VK
    renderFriendsCircle() {
      if (!this.friendsCircle || !this.friendsCircle.renderer) {
        return `
          <div class="friends-circle-loading">
            <div class="loading-spinner">
              <i class="fas fa-spinner fa-spin"></i>
            </div>
            <div class="loading-text">Лента VKЗагрузка......</div>
          </div>
          ${this.renderTabSwitcher()}
        `;
      }

      const circleContent = this.friendsCircle.renderer.renderFriendsCirclePage();
      return `
        <div class="messages-app">
          ${circleContent}
          ${this.renderTabSwitcher()}
        </div>
      `;
    }

    renderTabSwitcher() {
      return `
        <div class="message-tab-switcher">
          <button class="tab-btn ${this.currentMainTab === 'friends' ? 'active' : ''}"
                  onclick="window.messageApp?.switchMainTab('friends')">
            <i class="fas fa-user-friends"></i>
            <span>Друзья</span>
          </button>
          <button class="tab-btn ${this.currentMainTab === 'circle' ? 'active' : ''}"
                  onclick="window.messageApp?.switchMainTab('circle')">
            <i class="fas fa-globe"></i>
            <span>Лента VK</span>
          </button>
        </div>
      `;
    }

    // Сообщения/* Список */
    renderMessageList() {
      // ДрузьяДрузья
      let friendsHtml = '';

      // @ts-ignore - Друзья
      if (window.renderFriendsFromContext) {
        // @ts-ignore - Друзья
        friendsHtml = window.renderFriendsFromContext();
      } else {
        friendsHtml = `
                <div class="empty-state">
                    <div class="empty-icon">💬</div>
                    <div class="empty-text">...Друзья</div>
                    <div class="empty-hint">..."..."...Друзья</div>
                </div>
            `;
      }

      return `
            <div class="messages-app">
                <div class="message-list" id="message-list">
                    ${friendsHtml}
                </div>
                ${this.renderTabSwitcher()}
            </div>
        `;
    }

    // Друзья
    renderAddFriend() {
      return `
            <div class="add-friend-app">
                <!-- Tab... -->
                <div class="tab-navigation">
                    <button class="tab-btn ${this.currentTab === 'add' ? 'active' : ''}" data-tab="add">
                        <span class="tab-icon"></span>
                        <span>...</span>
                    </button>
                    <button class="tab-btn ${this.currentTab === 'delete' ? 'active' : ''}" data-tab="delete">
                        <span class="tab-icon"></span>
                        <span>Удалить</span>
                    </button>
                    <button class="tab-btn ${this.currentTab === 'createGroup' ? 'active' : ''}" data-tab="createGroup">
                        <span class="tab-icon"></span>
                        <span>...</span>
                    </button>
                    <button class="tab-btn ${this.currentTab === 'deleteGroup' ? 'active' : ''}" data-tab="deleteGroup">
                        <span class="tab-icon"></span>
                        <span>...</span>
                    </button>
                </div>

                <!-- Tab... -->
                <div class="m-tab-content">
                    ${this.renderCurrentTabContent()}
                </div>
            </div>
        `;
    }

    // tab
    renderCurrentTabContent() {
      switch (this.currentTab) {
        case 'add':
          return this.renderAddFriendTab();
        case 'delete':
          return this.renderDeleteFriendTab();
        case 'createGroup':
          return this.renderCreateGroupTab();
        case 'deleteGroup':
          return this.renderDeleteGroupTab();
        default:
          return this.renderAddFriendTab();
      }
    }

    // Друзьяtab
    renderAddFriendTab() {
      return `
            <div class="add-friend-form">
                <div class="form-group">
                    <label for="friend-name">Друзья...</label>
                    <input type="text" id="friend-name" class="form-input" placeholder="...Друзья...">
                </div>
                <div class="form-group">
                    <label for="friend-number">...ID</label>
                    <input type="number" id="friend-number" class="form-input" placeholder="...ID">
                </div>
                <button class="add-friend-submit" id="add-friend-submit">
                    <span class="submit-icon">✅</span>
                    <span>...Друзья</span>
                </button>
            </div>
            <div class="add-friend-tips">
                <div class="tip-item">
                    <span class="tip-icon">💡</span>
                    <span>...Друзья...，...Редактировать...Новое...</span>
                </div>
                <div class="tip-item">
                    <span class="tip-icon">📝</span>
                    <span>...：[ДругId|Друзья...|...ID]</span>
                </div>
            </div>
        `;
    }

    // УдалитьДрузьяtab
    renderDeleteFriendTab() {
      return `
            <div class="delete-friend-content">
                <div class="delete-friend-header">
                    <div class="delete-info">
                        <span class="delete-icon">⚠️</span>
                        <span>...Удалить...Друзья</span>
                    </div>
                    <button class="refresh-friend-list" id="refresh-friend-list">
                        <span class="refresh-icon">🔄</span>
                        <span>Обновить</span>
                    </button>
                </div>
                <div class="delete-friend-list" id="delete-friend-list">
                    ${this.renderDeleteFriendList()}
                </div>
                <div class="delete-friend-tips">
                    <div class="tip-item">
                        <span class="tip-icon">⚠️</span>
                        <span>УдалитьДрузья...Сообщения...</span>
                    </div>
                    <div class="tip-item">
                        <span class="tip-icon">🔍</span>
                        <span>...Удалить...Друзья...</span>
                    </div>
                </div>
            </div>
        `;
    }

    // УдалитьДрузья/* Список */
    renderDeleteFriendList() {
      if (!window.friendRenderer) {
        return `
                <div class="loading-state">
                    <div class="loading-icon">⏳</div>
                    <div class="loading-text">...Друзья/* Список */...</div>
                </div>
            `;
      }

      try {
        const allContacts = window.friendRenderer.extractFriendsFromContext();
        // Друзья，
        const friends = allContacts.filter(contact => !contact.isGroup);

        if (friends.length === 0) {
          return `
                    <div class="empty-state">
                        <div class="empty-icon">👥</div>
                        <div class="empty-text">...Друзья</div>
                        <div class="empty-hint">...Друзья</div>
                    </div>
                `;
        }

        const friendsHTML = friends
          .map(friend => {
            const avatar = this.getRandomAvatar();
            const timeStr = this.formatTime(friend.addTime);

            return `
                    <div class="delete-friend-item">
                        <div class="friend-info">
                            <div class="friend-avatar">${avatar}</div>
                            <div class="friend-details">
                                <div class="friend-name">${friend.name}</div>
                                <div class="friend-id">ID: ${friend.number}</div>
                                <div class="friend-time">...Время: ${timeStr}</div>
                            </div>
                        </div>
                        <button class="delete-friend-btn" data-friend-id="${friend.number}" data-friend-name="${friend.name}">
                            <span class="delete-icon">❌</span>
                            <span>Удалить</span>
                        </button>
                    </div>
                `;
          })
          .join('');

        return friendsHTML;
      } catch (error) {
        console.error('[Message App] errorУдалитьДрузья/* Список */error:', error);
        return `
                <div class="error-state">
                    <div class="error-icon">⚠️</div>
                    <div class="error-text">...Друзья/* Список */...</div>
                    <div class="error-details">${error.message}</div>
                </div>
            `;
      }
    }

    // tab
    renderCreateGroupTab() {
      return `
            <div class="create-group-form">
                <div class="form-group">
                    <label for="group-name">...</label>
                    <input type="text" id="group-name" class="form-input" placeholder="...">
                </div>
                <div class="form-group">
                    <label for="group-id">...ID</label>
                    <input type="number" id="group-id" class="form-input" placeholder="...ID">
                </div>
                <div class="form-group">
                    <label>...</label>
                    <div class="friends-selection-container">
                        <div class="friends-selection-header">
                            <span>...Друзья (...)</span>
                            <button class="select-all-friends" id="select-all-friends">...</button>
                        </div>
                        <div class="friends-selection-list" id="friends-selection-list">
                            ${this.renderFriendsSelection()}
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label>...</label>
                    <div class="selected-members" id="selected-members">
                        <div class="selected-member default-member">
                            <span class="member-name">...</span>
                            <span class="member-type">(...)</span>
                        </div>
                    </div>
                </div>
                <button class="create-group-submit" id="create-group-submit">
                    <span class="submit-icon">✅</span>
                    <span>...</span>
                </button>
            </div>
            <div class="create-group-tips">
                <div class="tip-item">
                    <span class="tip-icon">💡</span>
                    <span>...，...Редактировать...Новое...</span>
                </div>
                <div class="tip-item">
                    <span class="tip-icon">📝</span>
                    <span>...：[...|...|...ID|...]</span>
                </div>
            </div>
        `;
    }

    // Удалитьtab
    renderDeleteGroupTab() {
      return `
            <div class="delete-group-content">
                <div class="delete-group-header">
                    <div class="delete-info">
                        <span class="delete-icon">⚠️</span>
                        <span>...Удалить...</span>
                    </div>
                    <button class="refresh-group-list" id="refresh-group-list">
                        <span class="refresh-icon">🔄</span>
                        <span>Обновить</span>
                    </button>
                </div>
                <div class="delete-group-list" id="delete-group-list">
                    ${this.renderDeleteGroupList()}
                </div>
                <div class="delete-group-tips">
                    <div class="tip-item">
                        <span class="tip-icon">⚠️</span>
                        <span>Удалить...Сообщения...</span>
                    </div>
                    <div class="tip-item">
                        <span class="tip-icon">🔍</span>
                        <span>...Удалить...</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Друзья/* Список */
    renderFriendsSelection() {
      try {
        if (!window.friendRenderer) {
          console.warn('[Message App] friendRenderererror，error');
          return `
                    <div class="loading-state">
                        <div class="loading-icon">⏳</div>
                        <div class="loading-text">...Друзья/* Список */...</div>
                    </div>
                `;
        }

        const friends = window.friendRenderer.extractFriendsFromContext();

        if (!friends || friends.length === 0) {
          return `
                    <div class="empty-state">
                        <div class="empty-icon">👥</div>
                        <div class="empty-text">...Друзья</div>
                        <div class="empty-hint">...Друзья</div>
                    </div>
                `;
        }

        const friendsHTML = friends
          .map(friend => {
            try {
              const avatar = this.getRandomAvatar();
              const friendName = friend.name || '...Друзья';
              const friendNumber = friend.number || '...';

              return `
                        <div class="friend-selection-item" data-friend-id="${friendNumber}" data-friend-name="${friendName}">
                            <div class="friend-checkbox">
                                <input type="checkbox" id="friend-${friendNumber}" class="friend-checkbox-input">
                                <label for="friend-${friendNumber}" class="friend-checkbox-label"></label>
                            </div>
                            <div class="friend-info">
                                <div class="friend-avatar">${avatar}</div>
                                <div class="friend-details">
                                    <div class="friend-name">${friendName}</div>
                                    <div class="friend-id">ID: ${friendNumber}</div>
                                </div>
                            </div>
                        </div>
                    `;
            } catch (itemError) {
              console.error('[Message App] errorДрузьяerror:', itemError, friend);
              return ''; // ...Друзья...
            }
          })
          .filter(html => html)
          .join(''); // ...html

        return (
          friendsHTML ||
          `
                <div class="error-state">
                    <div class="error-icon">⚠️</div>
                    <div class="error-text">Друзья/* Список */...</div>
                    <div class="error-hint">...Обновить...</div>
                </div>
            `
        );
      } catch (error) {
        console.error('[Message App] errorДрузьяerror/* Список */error:', error);
        return `
                <div class="error-state">
                    <div class="error-icon">⚠️</div>
                    <div class="error-text">...Друзья/* Список */...</div>
                    <div class="error-details">${error.message}</div>
                </div>
            `;
      }
    }

    // Удалить/* Список */
    renderDeleteGroupList() {
      // Назад/* Заглушка загрузки */，
      setTimeout(async () => {
        await this.loadDeleteGroupListAsync();
      }, 100);

      return `
            <div class="loading-state">
                <div class="loading-icon">⏳</div>
                <div class="loading-text">.../* Список */...</div>
            </div>
        `;
    }

    // Удалить/* Список */
    async loadDeleteGroupListAsync() {
      try {
        // /* Список */（）
        const groups = await this.extractGroupsFromContext();

        const deleteGroupListContainer = document.querySelector('#delete-group-list');
        if (!deleteGroupListContainer) {
          return;
        }

        if (groups.length === 0) {
          deleteGroupListContainer.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">👥</div>
                        <div class="empty-text">...</div>
                        <div class="empty-hint">...</div>
                    </div>
                `;
          return;
        }

        const groupsHTML = groups
          .map(group => {
            const avatar = '👥';
            const timeStr = this.formatTime(group.addTime);

            return `
                    <div class="delete-group-item">
                        <div class="group-info">
                            <div class="group-avatar">${avatar}</div>
                            <div class="group-details">
                                <div class="group-name">${group.name}</div>
                                <div class="group-id">...ID: ${group.id}</div>
                                <div class="group-members">...: ${group.members}</div>
                                <div class="group-time">...Время: ${timeStr}</div>
                            </div>
                        </div>
                        <button class="delete-group-btn" data-group-id="${group.id}" data-group-name="${group.name}">
                            <span class="delete-icon">❌</span>
                            <span>Удалить</span>
                        </button>
                    </div>
                `;
          })
          .join('');

        deleteGroupListContainer.innerHTML = groupsHTML;

        // Удалить
        this.bindDeleteGroupEvents(document);
      } catch (error) {
        console.error('[Message App] errorУдалитьerror/* Список */error:', error);
        const deleteGroupListContainer = document.querySelector('#delete-group-list');
        if (deleteGroupListContainer) {
          deleteGroupListContainer.innerHTML = `
                    <div class="error-state">
                        <div class="error-icon">⚠️</div>
                        <div class="error-text">.../* Список */...</div>
                        <div class="error-details">${error.message}</div>
                    </div>
                `;
        }
      }
    }

    async extractGroupsFromContext() {
      try {
        if (!window.contextMonitor) {
          console.warn('[Message App] error');
          return [];
        }

        // Сообщения
        const chatData = await window.contextMonitor.getCurrentChatMessages();
        if (!chatData || !chatData.messages) {
          console.warn('[Message App] errorСообщения');
          return [];
        }

        const groups = [];
        const groupRegex = /\[...\|([^|]+)\|([^|]+)\|([^\]]+)\]/g;

        // Сообщения，
        chatData.messages.forEach((message, messageIndex) => {
          if (message.mes && typeof message.mes === 'string') {
            let match;
            while ((match = groupRegex.exec(message.mes)) !== null) {
              const [fullMatch, groupName, groupId, members] = match;

              // （）
              if (!groups.find(g => g.id === groupId)) {
                groups.push({
                  name: groupName,
                  id: groupId,
                  members: members,
                  addTime: message.send_date || Date.now(),
                  messageIndex: messageIndex,
                });
              }
            }
            groupRegex.lastIndex = 0;
          }
        });

        console.log(`[Message App] ... ${groups.length} ...`);
        return groups;
      } catch (error) {
        console.error('[Message App] error:', error);
        return [];
      }
    }

    // Время
    formatTime(timestamp) {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) {
        return 'только что';
      } else if (diffMins < 60) {
        return `${diffMins}мин. назад`;
      } else if (diffHours < 24) {
        return `${diffHours}ч. назад`;
      } else if (diffDays < 7) {
        return `${diffDays}...`;
      } else {
        return date.toLocaleDateString('zh-CN', {
          month: 'short',
          day: 'numeric',
        });
      }
    }

    bindEvents() {
      const appContent = document.getElementById('app-content');
      if (!appContent) return;

      // Назад
      const backButton = document.getElementById('back-button');
      if (backButton) {
        // （）
        backButton.removeEventListener('click', this.handleBackButtonClick);

        this.handleBackButtonClick = () => {
          // Сообщения/* Приложение */
          const currentApp = window.mobilePhone?.currentAppState?.app;
          if (currentApp !== 'messages') {
            console.log('[Message App] ...Сообщения/* Приложение */...，...Назад...');
            return;
          }

          console.log('[Message App] Назад...');
          if (this.currentView === 'detail' || this.currentView === 'messageDetail') {
            // ЕслиСообщения/* Страница деталей */，НазадСообщения/* Список */
            this.showMessageList();
          } else if (this.currentView === 'addFriend') {
            // ЕслиДрузья，НазадСообщения/* Список */
            this.showMessageList();
          } else {
            // НазадСообщения/* Список */
            this.showMessageList();
          }
        };

        backButton.addEventListener('click', this.handleBackButtonClick);
      }

      // Друзья
      const addFriendBtn = appContent.querySelector('#add-friend-btn');
      if (addFriendBtn) {
        addFriendBtn.addEventListener('click', () => {
          this.showAddFriend();
        });
      }

      // Tab
      const tabBtns = appContent.querySelectorAll('.tab-btn');
      tabBtns.forEach(btn => {
        btn.addEventListener('click', e => {
          e.preventDefault(); // ...
          e.stopPropagation(); // ...

          const target = e.currentTarget;
          const tabName = target.getAttribute('data-tab');
          if (tabName) {
            console.log(`[Message App] Tab...: ${tabName}`);
            this.switchTab(tabName);
          }
        });
      });

      // Друзья
      const submitBtn = appContent.querySelector('#add-friend-submit');
      if (submitBtn) {
        submitBtn.addEventListener('click', () => {
          this.addFriend();
        });
      }

      // ОбновитьДрузья/* Список */
      const refreshBtn = appContent.querySelector('#refresh-friend-list');
      if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
          this.refreshDeleteFriendList();
        });
      }

      // УдалитьДрузья
      const deleteFriendBtns = appContent.querySelectorAll('.delete-friend-btn');
      deleteFriendBtns.forEach(btn => {
        btn.addEventListener('click', e => {
          const target = e.currentTarget;
          const friendId = target.getAttribute('data-friend-id');
          const friendName = target.getAttribute('data-friend-name');
          if (friendId && friendName) {
            this.deleteFriend(friendId, friendName);
          }
        });
      });

      this.bindCreateGroupEvents(appContent);

      // Удалить
      this.bindDeleteGroupEvents(appContent);

      // Друзья/* Список */
      const messageItems = appContent.querySelectorAll('.message-item');
      messageItems.forEach(item => {
        item.addEventListener('click', e => {
          const target = e.currentTarget;
          const friendId = target && target.getAttribute ? target.getAttribute('data-friend-id') : null;
          if (friendId) {
            this.selectFriend(friendId); // ...：...Друзья...Открыть...
          }
        });
      });

      this.bindSendEvents();

      // Сообщения/* Страница деталей */
      this.bindDetailSendEvents();
    }

    bindSendEvents() {
      if (this.currentView !== 'list') return;

      const appContent = document.getElementById('app-content');
      if (!appContent) return;

      const sendInput = appContent.querySelector('#message-send-input');
      const sendButton = appContent.querySelector('#send-message-btn');
      const emojiBtn = appContent.querySelector('#send-emoji-btn');
      const stickerBtn = appContent.querySelector('#send-sticker-btn');
      const voiceBtn = appContent.querySelector('#send-voice-btn');
      const redpackBtn = appContent.querySelector('#send-redpack-btn');

      // MessageSender
      if (!window.messageSender) {
        console.warn('[Message App] MessageSendererror，error');
        setTimeout(() => this.bindSendEvents(), 1000);
        return;
      }

      // /* Поле ввода */
      if (sendInput) {
        sendInput.addEventListener('input', () => {
          window.messageSender.adjustTextareaHeight(sendInput);
          this.updateCharCount(sendInput);
        });

        sendInput.addEventListener('keydown', e => {
          window.messageSender.handleEnterSend(e, sendInput);
        });
      }

      if (sendButton) {
        sendButton.addEventListener('click', async () => {
          if (sendInput && this.currentSelectedFriend) {
            const message = sendInput.value.trim();
            if (message) {
              const success = await window.messageSender.sendMessage(message);
              if (success) {
                sendInput.value = '';
                window.messageSender.adjustTextareaHeight(sendInput);
                this.updateCharCount(sendInput);

                // 2
                this.scheduleDelayedRender('...Сообщения');
              }
            }
          }
        });
      }

      if (emojiBtn) {
        emojiBtn.addEventListener('click', () => {
          this.showEmojiPanel();
        });
      }

      if (stickerBtn) {
        stickerBtn.addEventListener('click', () => {
          this.showStickerPanel();
        });
      }

      if (voiceBtn) {
        voiceBtn.addEventListener('click', () => {
          this.showVoicePanel();
        });
      }

      if (redpackBtn) {
        redpackBtn.addEventListener('click', () => {
          this.showRedpackPanel();
        });
      }
    }

    // Сообщения/* Страница деталей */
    bindDetailSendEvents() {
      if (this.currentView !== 'messageDetail') return;

      const appContent = document.getElementById('app-content');
      if (!appContent) return;

      // Отменить/* Страница деталей */
      const detailInput = appContent.querySelector('#message-detail-input');
      const detailSendBtn = appContent.querySelector('#detail-send-btn');
      const detailToolToggleBtn = appContent.querySelector('#detail-tool-toggle-btn');
      const detailEmojiBtn = appContent.querySelector('#detail-emoji-btn');
      const detailStickerBtn = appContent.querySelector('#detail-sticker-btn');
      const detailVoiceBtn = appContent.querySelector('#detail-voice-btn');
      const detailRedpackBtn = appContent.querySelector('#detail-redpack-btn');
      const detailAttachmentBtn = appContent.querySelector('#detail-attachment-btn');

      // MessageSender
      if (!window.messageSender) {
        console.warn('[Message App] MessageSendererror，error/* Страница деталей */error');
        setTimeout(() => this.bindDetailSendEvents(), 1000);
        return;
      }

      // Настройки
      if (this.currentFriendId) {
        // currentSelectedFriendDOM
        const isGroup = this.isCurrentChatGroup();
        window.messageSender.setCurrentChat(this.currentFriendId, this.currentFriendName, isGroup);
      }

      // /* Поле ввода */
      if (detailInput) {
        detailInput.addEventListener('input', () => {
          window.messageSender.adjustTextareaHeight(detailInput);
          this.updateCharCount(detailInput);
        });

        detailInput.addEventListener('keydown', e => {
          window.messageSender.handleEnterSend(e, detailInput);
        });
      }

      if (detailSendBtn) {
        detailSendBtn.addEventListener('click', async () => {
          if (detailInput && this.currentFriendId) {
            const message = detailInput.value.trim();
            if (message) {
              const success = await window.messageSender.sendMessage(message);
              if (success) {
                detailInput.value = '';
                window.messageSender.adjustTextareaHeight(detailInput);
                this.updateCharCount(detailInput);

                // 2
                this.scheduleDelayedRender('...Сообщения（...）');
              }
            }
          }
        });
      }

      if (detailToolToggleBtn) {
        detailToolToggleBtn.addEventListener('click', () => {
          this.toggleToolsFloatingPanel();
        });
      }

      if (detailEmojiBtn) {
        detailEmojiBtn.addEventListener('click', () => {
          this.showEmojiPanel();
        });
      }

      if (detailStickerBtn) {
        detailStickerBtn.addEventListener('click', () => {
          this.showStickerPanel();
        });
      }

      if (detailVoiceBtn) {
        detailVoiceBtn.addEventListener('click', () => {
          this.showVoicePanel();
        });
      }

      if (detailRedpackBtn) {
        detailRedpackBtn.addEventListener('click', () => {
          this.showRedpackPanel();
        });
      }

      if (detailAttachmentBtn) {
        detailAttachmentBtn.addEventListener('click', () => {
          console.log('[Message App] 🔍 ...');
          this.showAttachmentPanel();
        });
      }
    }

    // Друзья
    selectFriend(friendId) {
      try {
        // Друзья
        let friendName = null;
        let isGroup = false;

        if (window.friendRenderer) {
          const friend = window.friendRenderer.getFriendById(friendId);
          friendName = friend ? friend.name : `Друзья ${friendId}`;
          isGroup = friend ? friend.isGroup : false;
        } else {
          friendName = `Друзья ${friendId}`;
        }

        // СохранитьСтатус
        this.currentIsGroup = isGroup;

        // /* Страница деталей */
        this.showMessageDetail(friendId, friendName);
      } catch (error) {
        console.error('[Message App] errorДрузьяerror:', error);
      }
    }

    isCurrentChatGroup() {
      // СохранитьСтатус
      if (this.currentIsGroup !== undefined) {
        return this.currentIsGroup;
      }

      // DOM
      const messageItem = document.querySelector(`[data-friend-id="${this.currentFriendId}"]`);
      if (messageItem) {
        const isGroupAttr = messageItem.getAttribute('data-is-group');
        return isGroupAttr === 'true';
      }

      // friend renderer
      if (window.friendRenderer) {
        const friend = window.friendRenderer.getFriendById(this.currentFriendId);
        return friend ? friend.isGroup : false;
      }

      return false;
    }

    updateCharCount(inputElement) {
      const appContent = document.getElementById('app-content');
      if (!appContent) return;

      let charCountElement = appContent.querySelector('.char-count');
      if (!charCountElement) {
        charCountElement = document.createElement('div');
        charCountElement.className = 'char-count';
        const sendArea = appContent.querySelector('.message-send-area');
        if (sendArea) {
          sendArea.appendChild(charCountElement);
        }
      }

      const currentLength = inputElement.value.length;
      const maxLength = inputElement.maxLength || 1000;

      charCountElement.textContent = `${currentLength}/${maxLength}`;

      // Настройки
      if (currentLength > maxLength * 0.9) {
        charCountElement.className = 'char-count error';
      } else if (currentLength > maxLength * 0.7) {
        charCountElement.className = 'char-count warning';
      } else {
        charCountElement.className = 'char-count';
      }
    }

    showEmojiPanel() {
      const emojis = [
        '😀',
        '😃',
        '😄',
        '😁',
        '😆',
        '😅',
        '😂',
        '🤣',
        '😊',
        '😇',
        '🙂',
        '🙃',
        '😉',
        '😌',
        '😍',
        '🥰',
        '😘',
        '😗',
        '😙',
        '😚',
        '😋',
        '😛',
        '😝',
        '😜',
        '🤪',
        '🤨',
        '🧐',
        '🤓',
        '😎',
        '🤩',
        '🥳',
        '😏',
        '😒',
        '😞',
        '😔',
        '😟',
        '😕',
        '🙁',
        '☹️',
        '😣',
        '😖',
        '😫',
        '😩',
        '🥺',
        '😢',
        '😭',
        '😤',
        '😠',
        '😡',
        '🤬',
        '🤯',
        '😳',
        '🥵',
        '🥶',
        '😱',
        '😨',
        '😰',
        '😥',
        '😓',
        '🤗',
        '🤔',
        '🤭',
        '🤫',
        '🤥',
        '😶',
        '😐',
        '😑',
        '😬',
        '🙄',
        '😯',
        '😦',
        '😧',
        '😮',
        '😲',
        '🥱',
        '😴',
        '🤤',
        '😪',
        '😵',
        '🤐',
        '🥴',
        '🤢',
        '🤮',
        '🤧',
        '😷',
        '🤒',
        '🤕',
        '🤑',
        '🤠',
        '😈',
        '👿',
        '👹',
        '👺',
        '🤡',
        '💩',
        '👻',
        '💀',
        '☠️',
        '👽',
        '👾',
      ];

      const panel = document.createElement('div');
      panel.className = 'special-panel';
      panel.innerHTML = `
            <div class="special-panel-content">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3>...</h3>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 18px; cursor: pointer;">✕</button>
                </div>
                <div style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 10px; max-height: 200px; overflow-y: auto;">
                    ${emojis
                      .map(
                        emoji => `
                        <button onclick="window.messageSender.insertSpecialFormat('emoji', {emoji: '${emoji}'}); this.parentElement.parentElement.parentElement.remove();"
                                style="background: none; border: 1px solid #ddd; border-radius: 8px; padding: 8px; cursor: pointer; font-size: 20px;">
                            ${emoji}
                        </button>
                    `,
                      )
                      .join('')}
                </div>
            </div>
        `;

      document.body.appendChild(panel);

      // 🔥 ：，
      console.log(`[Message App] ...，... ${stickerImages.length} ...`);
      if (stickerImages.length > 0 && stickerImages[0].fullPath) {
        console.log('[Message App] ...');
      } else {
        console.log('[Message App] ...');
      }
    }

    /**
     * 🔥 ...：...
     * ..."..."...，...，...
     */
    async getStickerImagesFromWorldInfo() {
      console.log('[Message App] ...');

      try {
        // （）
        const allEntries = await this.getAllWorldInfoEntries();

        // 🔥 ：""
        const stickerDetailEntries = [];

        // 🔥 1：""
        const commentEntries = allEntries.filter(entry => {
          return entry.comment && entry.comment.includes('...');
        });
        stickerDetailEntries.push(...commentEntries);

        // 🔥 2：""（）
        const keywordEntries = allEntries.filter(entry => {
          if (stickerDetailEntries.includes(entry)) return false; // ...
          if (entry.key && Array.isArray(entry.key)) {
            return entry.key.some(k => k.includes('...'));
          }
          return false;
        });
        stickerDetailEntries.push(...keywordEntries);

        // 🔥 3：""（）
        const contentEntries = allEntries.filter(entry => {
          if (stickerDetailEntries.includes(entry)) return false; // ...
          return entry.content && entry.content.trim().startsWith('...');
        });
        stickerDetailEntries.push(...contentEntries);

        console.log(`[Message App] ... ${stickerDetailEntries.length} ...:`);
        stickerDetailEntries.forEach((entry, index) => {
          console.log(`${index + 1}. "${entry.comment}" (...: ${entry.world})`);
        });

        if (stickerDetailEntries.length === 0) {
          console.warn('[Message App] error"error"error，error/* Список */');
          console.log('[Message App] Поиск...:', allEntries.length);
          console.log('[Message App] ...:', allEntries.slice(0, 3).map(e => ({
            comment: e.comment,
            key: e.key,
            content: e.content ? e.content.substring(0, 50) + '...' : ''
          })));
          return this.getDefaultStickerImages();
        }

        // 🔥 ：
        const allStickerImages = [];

        for (let i = 0; i < stickerDetailEntries.length; i++) {
          const entry = stickerDetailEntries[i];
          console.log(`[Message App] ... ${i + 1} ...: "${entry.comment}" (...: ${entry.world})`);

          try {
            const stickerImages = this.parseStickerDetails(entry.content);
            if (stickerImages.length > 0) {
              const imagesWithSource = stickerImages.map(img => ({
                ...img,
                source: entry.comment,
                world: entry.world
              }));
              allStickerImages.push(...imagesWithSource);
              console.log(`[Message App] ..."${entry.comment}"... ${stickerImages.length} ...`);
            } else {
              console.warn(`[Message App] error"${entry.comment}"error，error`);
            }
          } catch (error) {
            console.error(`[Message App] error"${entry.comment}"error:`, error);
          }
        }

        if (allStickerImages.length === 0) {
          console.warn('[Message App] error，error/* Список */');
          return this.getDefaultStickerImages();
        }

        console.log(`[Message App] ... ${stickerDetailEntries.length} ... ${allStickerImages.length} ...`);
        return allStickerImages;

      } catch (error) {
        console.error('[Message App] error:', error);
        return this.getDefaultStickerImages();
      }
    }

    /**
     * 🔥 ...：...
     */
    async getAllWorldInfoEntries() {
      const allEntries = [];

      try {
        // 🔥 ：SillyTavernAPI
        // 1. SillyTaverngetSortedEntries（）
        if (typeof window.getSortedEntries === 'function') {
          try {
            const entries = await window.getSortedEntries();
            allEntries.push(...entries);
            console.log(`[Message App] ...getSortedEntries... ${entries.length} ...`);
            return allEntries; // Если...，...Назад
          } catch (error) {
            console.warn('[Message App] getSortedEntrieserror:', error);
          }
        }

        // 2. ：
        console.log('[Message App] ...');

        // 🔥 ： - DOM
        console.log('[Message App] ......');
        console.log('[Message App] window.selected_world_info:', window.selected_world_info);
        console.log('[Message App] window.world_names:', window.world_names);

        // 🔥 ：1 - DOM
        const worldInfoSelect = document.getElementById('world_info');
        if (worldInfoSelect) {
          console.log('[Message App] ...');

          const selectedOptions = Array.from(worldInfoSelect.selectedOptions);
          console.log(`[Message App] ... ${selectedOptions.length} ...:`, selectedOptions.map(opt => opt.text));

          for (const option of selectedOptions) {
            const worldName = option.text;
            const worldIndex = option.value;

            try {
              console.log(`[Message App] ...: ${worldName} (...: ${worldIndex})`);
              const worldData = await this.loadWorldInfoByName(worldName);
              if (worldData && worldData.entries) {
                const entries = Object.values(worldData.entries).map(entry => ({
                  ...entry,
                  world: worldName
                }));
                allEntries.push(...entries);
                console.log(`[Message App] ..."${worldName}"... ${entries.length} ...`);
              } else {
                console.warn(`[Message App] error"${worldName}"error`);
              }
            } catch (error) {
              console.warn(`[Message App] error"${worldName}"error:`, error);
            }
          }
        } else {
          console.log('[Message App] ... #world_info');
        }

        // 2： selected_world_info （）
        if (allEntries.length === 0 && typeof window.selected_world_info !== 'undefined' && Array.isArray(window.selected_world_info) && window.selected_world_info.length > 0) {
          console.log(`[Message App] ...：... ${window.selected_world_info.length} ...:`, window.selected_world_info);

          for (const worldName of window.selected_world_info) {
            try {
              console.log(`[Message App] ...: ${worldName}`);
              const worldData = await this.loadWorldInfoByName(worldName);
              if (worldData && worldData.entries) {
                const entries = Object.values(worldData.entries).map(entry => ({
                  ...entry,
                  world: worldName
                }));
                allEntries.push(...entries);
                console.log(`[Message App] ..."${worldName}"... ${entries.length} ...`);
              }
            } catch (error) {
              console.warn(`[Message App] error"${worldName}"error:`, error);
            }
          }
        }

        // 3： world_info.globalSelect （）
        if (allEntries.length === 0 && typeof window.world_info !== 'undefined' && window.world_info.globalSelect) {
          console.log('[Message App] ...：... world_info.globalSelect ...:', window.world_info.globalSelect);

          for (const worldName of window.world_info.globalSelect) {
            try {
              const worldData = await this.loadWorldInfoByName(worldName);
              if (worldData && worldData.entries) {
                const entries = Object.values(worldData.entries).map(entry => ({
                  ...entry,
                  world: worldName
                }));
                allEntries.push(...entries);
                console.log(`[Message App] ...world_info.globalSelect..."${worldName}"... ${entries.length} ...`);
              }
            } catch (error) {
              console.warn(`[Message App] errorworld_info.globalSelecterror"${worldName}"error:`, error);
            }
          }
        }

        try {
          const characterEntries = await this.getCharacterWorldInfoEntries();
          allEntries.push(...characterEntries);
        } catch (error) {
          console.warn('[Message App] error:', error);
        }

      } catch (error) {
        console.error('[Message App] error:', error);
      }

      console.log(`[Message App] ... ${allEntries.length} ...`);

      // 🔥 ：
      if (allEntries.length > 0) {
        console.log('[Message App] ...:', allEntries.slice(0, 3).map(entry => ({
          comment: entry.comment,
          key: Array.isArray(entry.key) ? entry.key.join(', ') : entry.key,
          contentPreview: entry.content ? entry.content.substring(0, 50) + '...' : '...',
          world: entry.world || '...'
        })));
      }

      return allEntries;
    }

    /**
     * 🔥 ...：...
     */
    async loadWorldInfoByName(worldName) {
      try {
        // 🔥 ：SillyTavernloadWorldInfo
        if (typeof window.loadWorldInfo === 'function') {
          console.log(`[Message App] ...loadWorldInfo...: ${worldName}`);
          return await window.loadWorldInfo(worldName);
        }

        // ：API（）
        console.log(`[Message App] ...API...: ${worldName}`);

        const headers = {
          'Content-Type': 'application/json',
        };

        // ЕслиgetRequestHeaders，
        if (typeof window.getRequestHeaders === 'function') {
          Object.assign(headers, window.getRequestHeaders());
        }

        const response = await fetch('/api/worldinfo/get', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({ name: worldName }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`[Message App] ... "${worldName}":`, data);
          return data;
        } else {
          console.error(`[Message App] error "${worldName}" error: ${response.status} ${response.statusText}`);
        }

      } catch (error) {
        console.error(`[Message App] error "${worldName}" error:`, error);
      }

      return null;
    }

    /**
     * 🔥 ...：...
     */
    async getCharacterWorldInfoEntries() {
      const entries = [];

      try {
        // 🔥 ：SillyTavern
        let character = null;
        let characterId = null;

        // 1：SillyTavern.getContext()
        if (window.SillyTavern && typeof window.SillyTavern.getContext === 'function') {
          const context = window.SillyTavern.getContext();
          if (context && context.characters && context.characterId !== undefined) {
            character = context.characters[context.characterId];
            characterId = context.characterId;
          }
        }

        // 2：
        if (!character && typeof window.characters !== 'undefined' && typeof window.this_chid !== 'undefined') {
          character = window.characters[window.this_chid];
          characterId = window.this_chid;
        }

        if (!character) {
          console.log('[Message App] ...');
          return entries;
        }

        console.log(`[Message App] ...: ${character.name} (ID: ${characterId})`);

        const worldName = character.data?.extensions?.world;
        if (worldName) {
          console.log(`[Message App] ...: ${worldName}`);
          const worldData = await this.loadWorldInfoByName(worldName);
          if (worldData && worldData.entries) {
            const worldEntries = Object.values(worldData.entries).map(entry => ({
              ...entry,
              world: worldName
            }));
            entries.push(...worldEntries);
            console.log(`[Message App] ... ${worldEntries.length} ...`);
          }
        }

        // 🔥 ：
        if (typeof window.world_info !== 'undefined' && window.world_info.charLore) {
          const fileName = character.avatar || `${character.name}.png`;
          const extraCharLore = window.world_info.charLore.find(e => e.name === fileName);

          if (extraCharLore && Array.isArray(extraCharLore.extraBooks)) {
            console.log(`[Message App] ...: ${extraCharLore.extraBooks.join(', ')}`);

            for (const extraWorldName of extraCharLore.extraBooks) {
              try {
                const worldData = await this.loadWorldInfoByName(extraWorldName);
                if (worldData && worldData.entries) {
                  const worldEntries = Object.values(worldData.entries).map(entry => ({
                    ...entry,
                    world: extraWorldName
                  }));
                  entries.push(...worldEntries);
                  console.log(`[Message App] ..."${extraWorldName}"... ${worldEntries.length} ...`);
                }
              } catch (error) {
                console.warn(`[Message App] error"${extraWorldName}"error:`, error);
              }
            }
          }
        }

      } catch (error) {
        console.error('[Message App] error:', error);
      }

      return entries;
    }

    /**
     * 🔥 ...：...
     * ...：
     * 1. ...|...|...1,...2,...3
     * 2. JSON...：{"prefix": "...", "suffix": "...", "files": ["...1", "...2"]}
     * 3. .../* Список */：...1,...2,...3（...）
     */
    parseStickerDetails(content) {
      const stickerImages = [];

      try {
        console.log('[Message App] ...:', content);

        // JSON
        if (content.trim().startsWith('{')) {
          const jsonData = JSON.parse(content);
          const prefix = jsonData.prefix || '';
          const suffix = jsonData.suffix || '';
          const files = jsonData.files || [];

          for (const filename of files) {
            const fullPath = prefix + filename + suffix;
            // 🔥 ：
            const fallbackPath = `/scripts/extensions/third-party/mobile/images/${filename}`;

            stickerImages.push({
              filename: filename,
              fullPath: fullPath,
              displayName: filename,
              fallbackPath: fallbackPath,
              prefix: prefix,
              suffix: suffix
            });
          }

          console.log(`[Message App] JSON...，... ${stickerImages.length} ...`);
          return stickerImages;
        }

        // ：||1,2,3
        if (content.includes('|')) {
          const parts = content.split('|');
          if (parts.length >= 3) {
            const prefix = parts[0].trim();
            const suffix = parts[1].trim();
            const filesStr = parts[2].trim();

            const files = filesStr.split(',').map(f => f.trim()).filter(f => f);

            for (const filename of files) {
              const fullPath = prefix + filename + suffix;
              // 🔥 ：
              const fallbackPath = `/scripts/extensions/third-party/mobile/images/${filename}`;

              stickerImages.push({
                filename: filename,
                fullPath: fullPath,
                displayName: filename,
                fallbackPath: fallbackPath,
                prefix: prefix,
                suffix: suffix
              });
            }

            console.log(`[Message App] ...，...: "${prefix}", ...: "${suffix}", ... ${stickerImages.length} ...`);
            return stickerImages;
          }
        }

        if (content.includes(',')) {
          const files = content.split(',').map(f => f.trim()).filter(f => f);
          const defaultPrefix = '/scripts/extensions/third-party/mobile/images/';
          const defaultSuffix = '';

          for (const filename of files) {
            const fullPath = defaultPrefix + filename + defaultSuffix;
            stickerImages.push({
              filename: filename,
              fullPath: fullPath,
              displayName: filename
            });
          }

          console.log(`[Message App] ...，...，... ${stickerImages.length} ...`);
          return stickerImages;
        }

        // （）
        const lines = content.split('\n').map(line => line.trim()).filter(line => line);
        if (lines.length > 0) {
          const defaultPrefix = '/scripts/extensions/third-party/mobile/images/';
          const defaultSuffix = '';

          for (const filename of lines) {
            const fullPath = defaultPrefix + filename + defaultSuffix;
            stickerImages.push({
              filename: filename,
              fullPath: fullPath,
              displayName: filename
            });
          }

          console.log(`[Message App] ...，... ${stickerImages.length} ...`);
          return stickerImages;
        }

      } catch (error) {
        console.error('[Message App] error:', error);
      }

      console.warn('[Message App] error，Назадerror/* Список */');
      return stickerImages;
    }

    /**
     * 🔥 ...：.../* Список */
     */
    getDefaultStickerImages() {
      const defaultFiles = [
        'zjlr8e.jpg',
        'emzckz.jpg',
        'ivtswg.jpg',
        'lgply8.jpg',
        'au4ay5.jpg',
        'qasebg.jpg',
        '5kqdkh.jpg',
        '8kvr4u.jpg',
        'aotnxp.jpg',
        'xigzwa.jpg',
        'y7px4h.jpg',
        'z2sxmv.jpg',
        's10h5m.jpg',
        'hoghwb.jpg',
        'kin0oj.jpg',
        'l9nqv0.jpg',
        'kv2ubl.gif',
        '6eyt6n.jpg',
      ];

      const defaultPrefix = '/scripts/extensions/third-party/mobile/images/';
      const defaultSuffix = '';

      return defaultFiles.map(filename => ({
        filename: filename,
        fullPath: defaultPrefix + filename + defaultSuffix,
        displayName: filename
      }));
    }

    /**
     * 🔥 ...：...
     * ... window.messageApp.testStickerConfig() ...
     */
    async testStickerConfig() {
      console.log('=== Message App ... ===');

      try {
        const allEntries = await this.getAllWorldInfoEntries();
        console.log(`✓ ... ${allEntries.length} ...`);

        const stickerDetailEntry = allEntries.find(entry => {
          if (entry.comment && entry.comment.includes('...')) return true;
          if (entry.key && Array.isArray(entry.key)) {
            if (entry.key.some(k => k.includes('...'))) return true;
          }
          if (entry.content && entry.content.trim().startsWith('...')) return true;
          return false;
        });

        if (stickerDetailEntry) {
          console.log('✓ ...:', {
            comment: stickerDetailEntry.comment,
            key: stickerDetailEntry.key,
            world: stickerDetailEntry.world
          });

          const stickerImages = this.parseStickerDetails(stickerDetailEntry.content);
          console.log(`✓ ... ${stickerImages.length} ...:`);
          stickerImages.forEach((sticker, index) => {
            console.log(`  ${index + 1}. ${sticker.displayName} -> ${sticker.fullPath}`);
          });

          if (stickerImages.length > 0) {
            console.log('✅ Message App ...！');
            return { success: true, count: stickerImages.length, stickers: stickerImages };
          } else {
            console.log('❌ ...，...');
            return { success: false, error: '...' };
          }
        } else {
          console.log('❌ ...');
          console.log('💡 ..."..."..."sticker"');
          return { success: false, error: '...' };
        }

      } catch (error) {
        console.error('❌ Message App error:', error);
        return { success: false, error: error.message };
      } finally {
        console.log('=== Message App ... ===');
      }
    }

    async showStickerPanel() {
      console.log('[Message App] ...');

      const existingPanel = document.getElementById('sticker-input-panel');
      if (existingPanel) {
        existingPanel.remove();
      }

      // 🔥 ：，
      const stickerImages = this.getCachedStickerImages();

      const panel = document.createElement('div');
      panel.id = 'sticker-input-panel';
      panel.className = 'special-panel';

      // 🔥 ：
      const stickerGrid = this.generateStickerGrid(stickerImages);

      panel.innerHTML = `
            <div class="special-panel-content" style="max-width: 500px; width: 90%;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
                    <h3 style="margin: 0; color: #333; font-size: 18px;">😄 ...</h3>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <button id="refresh-sticker-btn" onclick="window.messageApp.refreshStickerConfig()"
                                style="background: #667eea; color: white; border: none; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 12px; display: flex; align-items: center; gap: 4px;"
                                title="...">
                            <i class="fas fa-sync-alt"></i> Обновить
                        </button>
                        <button onclick="this.parentElement.parentElement.parentElement.parentElement.remove()"
                                style="background: none; border: none; font-size: 20px; cursor: pointer; color: #999; padding: 5px;">✕</button>
                    </div>
                </div>

                <div class="sticker-grid-container" style="display: flex; flex-wrap: wrap;  gap: 0; max-height: 300px; overflow-y: auto; padding: 10px; background: #f8f9fa; border-radius: 12px;">
                    ${stickerGrid}
                </div>

                <div style="margin-top: 15px; text-align: center; font-size: 12px; color: #666;">
                    ...Сообщения...
                    <br><span class="sticker-status">
                        ${stickerImages.length > 0 && stickerImages[0].fullPath && stickerImages[0].fullPath !== stickerImages[0].filename ?
                          '<small style="color: #999;">✓ ...</small>' :
                          '<small style="color: #999;">...</small>'}
                    </span>
                </div>
            </div>
        `;

      document.body.appendChild(panel);

      // Закрыть
      panel.addEventListener('click', e => {
        if (e.target === panel) {
          panel.remove();
        }
      });
    }

    showVoicePanel() {
      const existingPanel = document.getElementById('voice-input-panel');
      if (existingPanel) {
        existingPanel.remove();
      }

      const panel = document.createElement('div');
      panel.id = 'voice-input-panel';
      panel.className = 'special-panel';
      panel.innerHTML = `
            <div class="special-panel-content" style="max-width: 400px; width: 90%;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
                    <h3 style="margin: 0; color: #333; font-size: 18px;">🎤 ...Сообщения</h3>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()"
                            style="background: none; border: none; font-size: 20px; cursor: pointer; color: #999; padding: 5px;">✕</button>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: #555; font-weight: 500;">...：</label>
                    <textarea id="voice-content-input"
                             placeholder="...，...：..."
                             style="width: 100%; min-height: 80px; max-height: 150px; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 14px; resize: vertical; font-family: inherit; line-height: 1.4; outline: none; transition: border-color 0.3s ease;"
                             maxlength="200"></textarea>
                    <div style="text-align: right; margin-top: 5px; font-size: 12px; color: #999;">
                        <span id="voice-char-count">0</span>/200 ...
                    </div>
                </div>

                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()"
                            style="padding: 10px 20px; border: 1px solid #ddd; border-radius: 6px; background: #f8f9fa; color: #333; cursor: pointer; font-size: 14px; transition: all 0.3s ease;">
                        Отменить
                    </button>
                    <button id="voice-send-confirm-btn"
                            style="padding: 10px 20px; border: none; border-radius: 6px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.3s ease;">
                        ...
                    </button>
                </div>
            </div>
        `;

      document.body.appendChild(panel);

      const input = document.getElementById('voice-content-input');
      const charCount = document.getElementById('voice-char-count');
      const sendBtn = document.getElementById('voice-send-confirm-btn');

      if (input && charCount) {
        input.addEventListener('input', () => {
          const count = input.value.length;
          charCount.textContent = count;

          if (count > 180) {
            charCount.style.color = '#dc3545';
          } else if (count > 140) {
            charCount.style.color = '#ffc107';
          } else {
            charCount.style.color = '#999';
          }
        });

        // （Ctrl+EnterShift+Enter）
        input.addEventListener('keydown', e => {
          if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
            e.preventDefault();
            sendBtn.click();
          }
        });
      }

      if (sendBtn) {
        sendBtn.addEventListener('click', () => {
          this.insertVoiceMessage();
        });
      }

      // /* Поле ввода */
      setTimeout(() => {
        if (input) {
          input.focus();
        }
      }, 100);

      // Закрыть
      panel.addEventListener('click', e => {
        if (e.target === panel) {
          panel.remove();
        }
      });
    }

    /**
     * ...Сообщения.../* Поле ввода */
     */
    insertVoiceMessage() {
      const input = document.getElementById('voice-content-input');
      const panel = document.getElementById('voice-input-panel');

      if (!input) {
        console.error('error/* Поле ввода */');
        return;
      }

      const voiceContent = input.value.trim();
      if (!voiceContent) {
        // /* Поле ввода */
        input.style.borderColor = '#dc3545';
        input.placeholder = '...';
        setTimeout(() => {
          input.style.borderColor = '#ddd';
          input.placeholder = '...，...：...';
        }, 2000);
        return;
      }

      // /* Поле ввода */
      const appContent = document.getElementById('app-content');
      let targetInput = null;

      if (appContent) {
        // Сообщения/* Страница деталей *//* Поле ввода */
        targetInput =
          appContent.querySelector('#message-detail-input') || appContent.querySelector('#message-send-input');
      }

      if (!targetInput) {
        console.error('error/* Поле ввода */');
        this.showToast('.../* Поле ввода */，...Открыть...', 'error');
        return;
      }

      // Сообщения [Сообщения||ДрузьяID||]
      // IDСтатус
      let targetId = null;
      let isGroup = false;

      // /* Приложение */СтатусДрузьяIDСтатус
      if (this.currentFriendId) {
        targetId = this.currentFriendId;
        isGroup = this.isGroup || false;
      }

      // Если， MessageSender
      if (!targetId && window.messageSender && window.messageSender.currentFriendId) {
        targetId = window.messageSender.currentFriendId;
        isGroup = window.messageSender.isGroup || false;
      }

      // Если，
      if (!targetId) {
        targetId = '223456'; // ...ДрузьяID
        console.warn('[Message App] errorДрузьяID，error:', targetId);
      }

      // Сообщения -
      let voiceMessage;
      if (isGroup) {
        voiceMessage = `[...Сообщения|${targetId}|...|...|${voiceContent}]`;
      } else {
        voiceMessage = `[...Сообщения|...|${targetId}|...|${voiceContent}]`;
      }

      // /* Поле ввода */
      const currentValue = targetInput.value || '';
      const separator = currentValue ? '\n' : '';
      targetInput.value = currentValue + separator + voiceMessage;

      // ，
      const inputEvent = new Event('input', { bubbles: true });
      targetInput.dispatchEvent(inputEvent);

      // /* Поле ввода */
      targetInput.focus();

      // Закрыть
      if (panel) {
        panel.remove();
      }

      this.showToast('...Сообщения.../* Поле ввода */', 'success');

      console.log('...Сообщения...:', voiceMessage);
    }

    /**
     * 🔥 ...：...Сообщения.../* Поле ввода */ - ...
     */
    insertStickerMessage(filename, fullPath = null) {
      if (!filename) {
        console.error('error');
        return;
      }

      // 🔥 ：，
      if (!fullPath) {
        // Если，
        try {
          const stickerImages = this.getCachedStickerImages();
          const stickerData = stickerImages.find(sticker =>
            (sticker.filename === filename) ||
            (typeof sticker === 'string' && sticker === filename)
          );

          if (stickerData && stickerData.fullPath) {
            fullPath = stickerData.fullPath;
            console.log(`[Message App] ...: ${filename} -> ${fullPath}`);
          } else {
            fullPath = filename;
            console.log(`[Message App] ...，...: ${filename}`);
          }
        } catch (error) {
          console.warn('[Message App] error，error:', error);
          fullPath = filename;
        }
      } else {
        console.log(`[Message App] ...: ${filename} -> ${fullPath}`);
      }

      // /* Поле ввода */
      const appContent = document.getElementById('app-content');
      let targetInput = null;

      if (appContent) {
        // Сообщения/* Страница деталей *//* Поле ввода */
        targetInput =
          appContent.querySelector('#message-detail-input') || appContent.querySelector('#message-send-input');
      }

      if (!targetInput) {
        console.error('error/* Поле ввода */');
        this.showToast('.../* Поле ввода */，...Открыть...', 'error');
        return;
      }

      // IDСтатус
      let targetId = null;
      let isGroup = false;

      // /* Приложение */СтатусДрузьяIDСтатус
      if (this.currentFriendId) {
        targetId = this.currentFriendId;
        isGroup = this.isGroup || false;
      }

      // Если， MessageSender
      if (!targetId && window.messageSender && window.messageSender.currentFriendId) {
        targetId = window.messageSender.currentFriendId;
        isGroup = window.messageSender.isGroup || false;
      }

      // Если，
      if (!targetId) {
        targetId = '223456'; // ...ДрузьяID
        console.warn('[Message App] errorДрузьяID，error:', targetId);
      }

      // 🔥 ：Сообщения -
      let stickerMessage;
      if (isGroup) {
        stickerMessage = `[...Сообщения|${targetId}|...|...|${fullPath}]`;
      } else {
        stickerMessage = `[...Сообщения|...|${targetId}|...|${fullPath}]`;
      }

      console.log(`[Message App] ...Сообщения: ${filename} -> ${fullPath}`);

      // /* Поле ввода */
      const currentValue = targetInput.value || '';
      const separator = currentValue ? '\n' : '';
      targetInput.value = currentValue + separator + stickerMessage;

      // ，
      const inputEvent = new Event('input', { bubbles: true });
      targetInput.dispatchEvent(inputEvent);

      // /* Поле ввода */
      targetInput.focus();

      // Закрыть
      const panel = document.getElementById('sticker-input-panel');
      if (panel) {
        panel.remove();
      }

      this.showToast('.../* Поле ввода */', 'success');

      console.log('...Сообщения...:', stickerMessage);
    }

    /**
     * 🔥 ...：...
     */
    getCachedStickerImages() {
      try {
        // localStorage
        const cached = localStorage.getItem('stickerConfig_cache');
        if (cached) {
          const cacheData = JSON.parse(cached);
          const now = Date.now();

          // （30）
          if (cacheData.timestamp && (now - cacheData.timestamp) < 30 * 60 * 1000) {
            console.log(`[Message App] ...，... ${cacheData.data.length} ...`);
            return cacheData.data;
          } else {
            console.log('[Message App] ...');
            localStorage.removeItem('stickerConfig_cache');
          }
        }
      } catch (error) {
        console.warn('[Message App] error:', error);
        localStorage.removeItem('stickerConfig_cache');
      }

      // ，Назад
      console.log('[Message App] ...，...');
      return this.getDefaultStickerImages();
    }

    /**
     * 🔥 ...：...localStorage
     */
    cacheStickerImages(stickerImages) {
      try {
        const cacheData = {
          data: stickerImages,
          timestamp: Date.now()
        };
        localStorage.setItem('stickerConfig_cache', JSON.stringify(cacheData));
        console.log(`[Message App] ...，... ${stickerImages.length} ...`);
      } catch (error) {
        console.warn('[Message App] error:', error);
      }
    }

    /**
     * 🔥 ...：Обновить...（...）
     */
    async refreshStickerConfig() {
      console.log('[Message App] ...Обновить......');

      // Статус
      const refreshBtn = document.getElementById('refresh-sticker-btn');
      const originalText = refreshBtn ? refreshBtn.innerHTML : '';
      if (refreshBtn) {
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Загрузка......';
        refreshBtn.disabled = true;
      }

      try {
        localStorage.removeItem('stickerConfig_cache');

        const stickerImages = await this.getStickerImagesFromWorldInfo();

        this.cacheStickerImages(stickerImages);

        this.updateStickerPanel(stickerImages);

        this.showToast('...Обновить', 'success');

      } catch (error) {
        console.error('[Message App] Обновитьerror:', error);
        this.showToast('Обновить...，...', 'error');
      } finally {
        // Статус
        if (refreshBtn) {
          refreshBtn.innerHTML = originalText;
          refreshBtn.disabled = false;
        }
      }
    }

    /**
     * 🔥 ...：...
     */
    updateStickerPanel(stickerImages) {
      const panel = document.getElementById('sticker-input-panel');
      if (!panel) return;

      const stickerGrid = this.generateStickerGrid(stickerImages);

      const gridContainer = panel.querySelector('.sticker-grid-container');
      if (gridContainer) {
        gridContainer.innerHTML = stickerGrid;
      }

      // Статус
      const statusElement = panel.querySelector('.sticker-status');
      if (statusElement) {
        const statusText = stickerImages.length > 0 && stickerImages[0].fullPath && stickerImages[0].fullPath !== stickerImages[0].filename ?
          '✓ ...' : '...';
        statusElement.innerHTML = `<small style="color: #999;">${statusText}</small>`;
      }

      console.log(`[Message App] ...，... ${stickerImages.length} ...`);
    }

    /**
     * 🔥 ...：...HTML
     */
    generateStickerGrid(stickerImages) {
      return stickerImages
        .map(
          stickerData => {
            // 🔥 ：，
            let fallbackPath;
            if (stickerData.fallbackPath) {
              // Если，
              fallbackPath = stickerData.fallbackPath;
            } else if (stickerData.prefix && stickerData.suffix !== undefined) {
              // Если，
              fallbackPath = stickerData.prefix + (stickerData.filename || stickerData) + stickerData.suffix;
            } else {
              fallbackPath = `/scripts/extensions/third-party/mobile/images/${stickerData.filename || stickerData}`;
            }

            return `
            <div class="sticker-item" onclick="window.messageApp.insertStickerMessage('${stickerData.filename || stickerData}', '${stickerData.fullPath || stickerData}')"
                 style="cursor: pointer; padding: 4px; border: 2px solid transparent; border-radius: 8px; transition: all 0.3s ease;width:calc(25%);box-sizing:border-box"
                 onmouseover="this.style.borderColor='#667eea'; this.style.transform='scale(1.1)'"
                 onmouseout="this.style.borderColor='transparent'; this.style.transform='scale(1)'"
                 title="${stickerData.displayName || stickerData}">
                <img src="${stickerData.fullPath || stickerData}"
                     alt="${stickerData.displayName || stickerData}"
                     style="object-fit: cover; border-radius: 4px; display: block;"
                     loading="lazy"
                     >
            </div>
        `;
          }
        )
        .join('');
    }

    showRedpackPanel() {
      const existingPanel = document.getElementById('redpack-input-panel');
      if (existingPanel) {
        existingPanel.remove();
      }

      const panel = document.createElement('div');
      panel.id = 'redpack-input-panel';
      panel.className = 'special-panel';
      panel.innerHTML = `
            <div class="special-panel-content" style="max-width: 400px; width: 90%;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
                    <h3 style="margin: 0; color: #333; font-size: 18px;">🧧 ...</h3>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()"
                            style="background: none; border: none; font-size: 20px; cursor: pointer; color: #999; padding: 5px;">✕</button>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: #555; font-weight: 500;">...：</label>
                    <input type="number" id="redpack-amount-input"
                           placeholder="...，...：88.88"
                           step="0.01" min="0.01" max="9999999"
                           style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; transition: border-color 0.3s ease;" />
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 5px; font-size: 12px; color: #999;">
                        <span>...：0.01 - 9999999.00 ...</span>
                        <span id="redpack-amount-display">￥0.00</span>
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: #555; font-weight: 500;">...（...）：</label>
                    <input type="text" id="redpack-message-input"
                           placeholder="...，..."
                           maxlength="20"
                           style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; transition: border-color 0.3s ease;" />
                    <div style="text-align: right; margin-top: 5px; font-size: 12px; color: #999;">
                        <span id="redpack-message-count">0</span>/20 ...
                    </div>
                </div>

                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()"
                            style="padding: 10px 20px; border: 1px solid #ddd; border-radius: 6px; background: #f8f9fa; color: #333; cursor: pointer; font-size: 14px; transition: all 0.3s ease;">
                        Отменить
                    </button>
                    <button id="redpack-send-confirm-btn"
                            style="padding: 10px 20px; border: none; border-radius: 6px; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.3s ease;">
                        ...
                    </button>
                </div>
            </div>
        `;

      document.body.appendChild(panel);

      const amountInput = document.getElementById('redpack-amount-input');
      const messageInput = document.getElementById('redpack-message-input');
      const amountDisplay = document.getElementById('redpack-amount-display');
      const messageCount = document.getElementById('redpack-message-count');
      const sendBtn = document.getElementById('redpack-send-confirm-btn');

      if (amountInput && amountDisplay) {
        amountInput.addEventListener('input', () => {
          const amount = parseFloat(amountInput.value) || 0;
          amountDisplay.textContent = `￥${amount.toFixed(2)}`;

          if (amount > 9999999) {
            amountInput.style.borderColor = '#dc3545';
            amountDisplay.style.color = '#dc3545';
          } else if (amount < 0.01 && amount > 0) {
            amountInput.style.borderColor = '#ffc107';
            amountDisplay.style.color = '#ffc107';
          } else {
            amountInput.style.borderColor = '#ddd';
            amountDisplay.style.color = '#28a745';
          }
        });
      }

      if (messageInput && messageCount) {
        messageInput.addEventListener('input', () => {
          const count = messageInput.value.length;
          messageCount.textContent = count;

          if (count > 18) {
            messageCount.style.color = '#dc3545';
          } else if (count > 15) {
            messageCount.style.color = '#ffc107';
          } else {
            messageCount.style.color = '#999';
          }
        });
      }

      if (amountInput) {
        amountInput.addEventListener('keydown', e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            sendBtn.click();
          }
        });
      }

      if (messageInput) {
        messageInput.addEventListener('keydown', e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            sendBtn.click();
          }
        });
      }

      if (sendBtn) {
        sendBtn.addEventListener('click', () => {
          this.insertRedpackMessage();
        });
      }

      // /* Поле ввода */
      setTimeout(() => {
        if (amountInput) {
          amountInput.focus();
        }
      }, 100);

      // Закрыть
      panel.addEventListener('click', e => {
        if (e.target === panel) {
          panel.remove();
        }
      });
    }

    /**
     * ...Сообщения.../* Поле ввода */
     */
    insertRedpackMessage() {
      const amountInput = document.getElementById('redpack-amount-input');
      const messageInput = document.getElementById('redpack-message-input');
      const panel = document.getElementById('redpack-input-panel');

      if (!amountInput) {
        console.error('error/* Поле ввода */');
        return;
      }

      const amount = parseFloat(amountInput.value);
      if (!amount || amount < 0.01 || amount > 9999999) {
        // /* Поле ввода */
        amountInput.style.borderColor = '#dc3545';
        amountInput.placeholder = '...0.01-9999999.00...';
        setTimeout(() => {
          amountInput.style.borderColor = '#ddd';
          amountInput.placeholder = '...，...：88.88';
        }, 2000);
        return;
      }

      const message = messageInput ? messageInput.value.trim() : '';
      const blessing = message || '...，...';

      // /* Поле ввода */
      const appContent = document.getElementById('app-content');
      let targetInput = null;

      if (appContent) {
        // Сообщения/* Страница деталей *//* Поле ввода */
        targetInput =
          appContent.querySelector('#message-detail-input') || appContent.querySelector('#message-send-input');
      }

      if (!targetInput) {
        console.error('error/* Поле ввода */');
        this.showToast('.../* Поле ввода */，...Открыть...', 'error');
        return;
      }

      // IDСтатус
      let targetId = null;
      let isGroup = false;

      // /* Приложение */СтатусДрузьяIDСтатус
      if (this.currentFriendId) {
        targetId = this.currentFriendId;
        isGroup = this.isGroup || false;
      }

      // Если， MessageSender
      if (!targetId && window.messageSender && window.messageSender.currentFriendId) {
        targetId = window.messageSender.currentFriendId;
        isGroup = window.messageSender.isGroup || false;
      }

      // Если，
      if (!targetId) {
        targetId = '223456'; // ...ДрузьяID
        console.warn('[Message App] errorДрузьяID，error:', targetId);
      }

      // Сообщения -
      let redpackMessage;
      if (isGroup) {
        redpackMessage = `[...Сообщения|${targetId}|...|...|${amount.toFixed(2)}]`;
      } else {
        redpackMessage = `[...Сообщения|...|${targetId}|...|${amount.toFixed(2)}]`;
      }

      // /* Поле ввода */
      const currentValue = targetInput.value || '';
      const separator = currentValue ? '\n' : '';
      targetInput.value = currentValue + separator + redpackMessage;

      // ，
      const inputEvent = new Event('input', { bubbles: true });
      targetInput.dispatchEvent(inputEvent);

      // /* Поле ввода */
      targetInput.focus();

      // Закрыть
      if (panel) {
        panel.remove();
      }

      this.showToast(`.../* Поле ввода */：￥${amount.toFixed(2)}`, 'success');

      console.log('...Сообщения...:', redpackMessage);
    }

    showAttachmentPanel() {
      console.log('[Message App] 🔍 ...');

      const existingPanel = document.getElementById('attachment-input-panel');
      if (existingPanel) {
        console.log('[Message App] 🔍 ...');
        existingPanel.remove();
      }

      // AttachmentSender
      console.log('[Message App] 🔍 ...AttachmentSenderСтатус:', !!window.attachmentSender);
      if (!window.attachmentSender) {
        console.warn('[Message App] AttachmentSendererror，error...');
        this.loadAttachmentSender();
        this.showToast('......', 'info');
        return;
      }

      // Настройки
      console.log('[Message App] 🔍 ...:', {
        friendId: this.currentFriendId,
        friendName: this.currentFriendName,
        isGroup: this.isCurrentChatGroup(),
      });

      if (this.currentFriendId) {
        const isGroup = this.isCurrentChatGroup();
        window.attachmentSender.setCurrentChat(this.currentFriendId, this.currentFriendName, isGroup);
        console.log('[Message App] 🔍 ...НастройкиAttachmentSender...');
      } else {
        console.warn('[Message App] ⚠️ error');
      }

      const panel = document.createElement('div');
      panel.id = 'attachment-input-panel';
      panel.className = 'special-panel';
      panel.innerHTML = `
            <div class="special-panel-content" style="max-width: 500px; width: 90%;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
                    <h3 style="margin: 0; color: #333; font-size: 18px;">📁 ...</h3>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()"
                            style="background: none; border: none; font-size: 20px; cursor: pointer; color: #999; padding: 5px;">✕</button>
                </div>

                <div style="margin-bottom: 20px;">
                    <div class="file-drop-zone" style="
                        border: 2px dashed #ddd;
                        border-radius: 8px;
                        padding: 40px 20px;
                        text-align: center;
                        background: #fafafa;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        <div style="font-size: 48px; margin-bottom: 10px;">📎</div>
                        <div style="font-size: 16px; color: #666; margin-bottom: 10px;">...</div>
                        <div style="font-size: 12px; color: #999;">
                            ...、...、...<br>
                            ...：10MB
                        </div>
                        <input type="file" id="attachment-file-input" multiple
                               accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.7z"
                               style="display: none;">
                    </div>
                </div>

                <div id="attachment-preview-area" style="margin-bottom: 20px; display: none;">
                    <h4 style="margin: 0 0 10px 0; color: #555; font-size: 14px;">...：</h4>
                    <div id="attachment-file-list" style="max-height: 200px; overflow-y: auto;"></div>
                </div>

                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px 0; color: #555; font-size: 14px;">...Сообщения（...）：</h4>
                    <textarea id="attachment-message-input" placeholder="...Сообщения...，...Сообщения..."
                              style="width: 100%; min-height: 80px; padding: 10px; border: 1px solid #ddd; border-radius: 6px; resize: vertical; font-size: 14px; font-family: inherit; box-sizing: border-box;"
                              maxlength="1000"></textarea>
                    <div style="font-size: 12px; color: #999; margin-top: 5px;">
                        ...：...Сообщения...，...1000...
                    </div>
                </div>

                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()"
                            style="padding: 10px 20px; border: 1px solid #ddd; border-radius: 6px; background: #f8f9fa; color: #333; cursor: pointer; font-size: 14px; transition: all 0.3s ease;">
                        Отменить
                    </button>
                    <button id="attachment-send-confirm-btn" disabled
                            style="padding: 10px 20px; border: none; border-radius: 6px; background: #6c757d; color: white; cursor: not-allowed; font-size: 14px; font-weight: 500; transition: all 0.3s ease;">
                        ...
                    </button>
                </div>
            </div>
        `;

      document.body.appendChild(panel);

      this.bindAttachmentPanelEvents(panel);
    }

    bindAttachmentPanelEvents(panel) {
      const fileInput = panel.querySelector('#attachment-file-input');
      const dropZone = panel.querySelector('.file-drop-zone');
      const previewArea = panel.querySelector('#attachment-preview-area');
      const fileList = panel.querySelector('#attachment-file-list');
      const sendBtn = panel.querySelector('#attachment-send-confirm-btn');

      let selectedFiles = [];

      if (fileInput) {
        fileInput.addEventListener('change', e => {
          this.handleFileSelection(e.target.files, selectedFiles, fileList, previewArea, sendBtn);
        });
      }

      if (dropZone) {
        dropZone.addEventListener('click', () => {
          fileInput.click();
        });

        dropZone.addEventListener('dragover', e => {
          e.preventDefault();
          dropZone.style.borderColor = '#007bff';
          dropZone.style.backgroundColor = '#f0f8ff';
        });

        dropZone.addEventListener('dragleave', e => {
          e.preventDefault();
          dropZone.style.borderColor = '#ddd';
          dropZone.style.backgroundColor = '#fafafa';
        });

        dropZone.addEventListener('drop', e => {
          e.preventDefault();
          dropZone.style.borderColor = '#ddd';
          dropZone.style.backgroundColor = '#fafafa';

          const files = e.dataTransfer.files;
          this.handleFileSelection(files, selectedFiles, fileList, previewArea, sendBtn);
        });
      }

      if (sendBtn) {
        sendBtn.addEventListener('click', async () => {
          console.log('[Message App] 🔍 ...');
          console.log('[Message App] 🔍 ...:', selectedFiles.length);

          if (selectedFiles.length === 0) {
            console.warn('[Message App] ⚠️ error');
            return;
          }

          // Сообщения
          const messageInput = panel.querySelector('#attachment-message-input');
          const additionalMessages = messageInput ? messageInput.value.trim() : '';
          console.log('[Message App] 🔍 ...Сообщения...:', additionalMessages);

          sendBtn.disabled = true;
          sendBtn.textContent = '......';
          sendBtn.style.background = '#6c757d';

          try {
            console.log('[Message App] 🔍 ......');
            // СообщенияattachmentSender
            const results = await window.attachmentSender.handleFileSelection(selectedFiles, additionalMessages);
            console.log('[Message App] 🔍 ...:', results);

            const successCount = results.filter(r => r.success).length;
            const failCount = results.length - successCount;

            console.log('[Message App] 🔍 ...:', { successCount, failCount });

            if (successCount > 0) {
              this.showToast(`... ${successCount} ...`, 'success');
            }

            if (failCount > 0) {
              const errors = results
                .filter(r => !r.success)
                .map(r => r.errors.join(', '))
                .join('; ');
              console.error('[Message App] ❌ error:', errors);
              this.showToast(`${failCount} ...: ${errors}`, 'error');
            }

            // Закрыть
            panel.remove();
          } catch (error) {
            console.error('[Message App] ❌ error:', error);
            this.showToast('...: ' + error.message, 'error');

            sendBtn.disabled = false;
            sendBtn.textContent = '...';
            sendBtn.style.background = 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)';
          }
        });
      }
    }

    loadAttachmentSender() {
      if (window.attachmentSender) {
        return;
      }

      const existingScript = document.querySelector('script[src*="attachment-sender.js"]');
      if (existingScript) {
        console.log('[Message App] ...');
        return;
      }

      const script = document.createElement('script');
      script.src = 'scripts/extensions/third-party/mobile/app/attachment-sender.js';
      script.onload = () => {
        console.log('[Message App] ✅ ...');
        // ，Пользователь
      };
      script.onerror = error => {
        console.error('[Message App] ❌ error:', error);
        this.showToast('...', 'error');
      };

      document.head.appendChild(script);
    }

    // （）
    loadAttachmentSenderSilently() {
      if (window.attachmentSender) {
        return;
      }

      const existingScript = document.querySelector('script[src*="attachment-sender.js"]');
      if (existingScript) {
        console.log('[Message App] ...');
        return;
      }

      const script = document.createElement('script');
      script.src = 'scripts/extensions/third-party/mobile/app/attachment-sender.js';
      script.onload = () => {
        console.log('[Message App] ✅ ...');
      };
      script.onerror = error => {
        console.error('[Message App] ❌ error:', error);
      };

      document.head.appendChild(script);
    }

    handleFileSelection(files, selectedFiles, fileList, previewArea, sendBtn) {
      selectedFiles.length = 0;

      for (const file of files) {
        selectedFiles.push(file);
      }

      this.updateFilePreview(selectedFiles, fileList, previewArea, sendBtn);
    }

    updateFilePreview(selectedFiles, fileList, previewArea, sendBtn) {
      if (selectedFiles.length === 0) {
        previewArea.style.display = 'none';
        sendBtn.disabled = true;
        sendBtn.style.background = '#6c757d';
        sendBtn.style.cursor = 'not-allowed';
        return;
      }

      previewArea.style.display = 'block';

      // /* Список */
      fileList.innerHTML = '';

      selectedFiles.forEach((file, index) => {
        const preview = window.attachmentSender.createFilePreview(file);
        const validation = window.attachmentSender.validateFile(file);

        const fileItem = document.createElement('div');
        fileItem.className = 'file-preview-item';
        fileItem.style.cssText = `
          display: flex;
          align-items: center;
          padding: 10px;
          margin-bottom: 8px;
          border: 1px solid ${validation.isValid ? '#ddd' : '#dc3545'};
          border-radius: 6px;
          background: ${validation.isValid ? '#fff' : '#fff5f5'};
        `;

        fileItem.innerHTML = `
          <div style="font-size: 24px; margin-right: 12px;">${preview.icon}</div>
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 500; color: #333; margin-bottom: 2px; word-break: break-all;">
              ${preview.fileName}
            </div>
            <div style="font-size: 12px; color: #666;">
              ${preview.fileSize} • ${preview.category}
            </div>
            ${
              !validation.isValid
                ? `
              <div style="font-size: 12px; color: #dc3545; margin-top: 4px;">
                ${validation.errors.join(', ')}
              </div>
            `
                : ''
            }
          </div>
          <button onclick="this.parentElement.remove(); window.messageApp.removeFileFromSelection(${index})"
                  style="background: none; border: none; color: #999; cursor: pointer; padding: 4px; font-size: 16px;">
            ✕
          </button>
        `;

        // Если，
        if (preview.previewContent) {
          const previewDiv = document.createElement('div');
          previewDiv.innerHTML = preview.previewContent;
          previewDiv.style.marginLeft = '36px';
          fileItem.appendChild(previewDiv);
        }

        fileList.appendChild(fileItem);
      });

      const hasValidFiles = selectedFiles.some(file => window.attachmentSender.validateFile(file).isValid);

      // Статус
      if (hasValidFiles) {
        sendBtn.disabled = false;
        sendBtn.style.background = 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)';
        sendBtn.style.cursor = 'pointer';
        sendBtn.textContent = `... (${selectedFiles.length})`;
      } else {
        sendBtn.disabled = true;
        sendBtn.style.background = '#6c757d';
        sendBtn.style.cursor = 'not-allowed';
        sendBtn.textContent = '...';
      }
    }

    removeFileFromSelection(index) {
      // ，window.messageApp
      // updateFilePreview
    }

    showToast(message, type = 'info') {
      const toast = document.createElement('div');
      toast.className = `send-status-toast ${type}`;
      toast.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">${message}</div>
        `;

      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    }

    // Друзья
    showAddFriend() {
      this.currentView = 'addFriend';
      this.currentTab = 'add'; // ...tab

      // Уведомление/* Приложение */Статус
      if (window.mobilePhone) {
        const addFriendState = {
          app: 'messages',
          title: '...Друзья',
          view: 'addFriend',
        };
        window.mobilePhone.pushAppState(addFriendState);
      }

      this.updateAppContent();
    }

    // Сообщения/* Список */
    showMessageList() {
      console.log('[Message App] ...Сообщения/* Список */');

      this.currentView = 'list'; // ...：...getAppContent...case...
      this.currentFriendId = null;
      this.currentFriendName = null;
      this.currentIsGroup = false; // ...Статус

      // Уведомление/* Приложение */Статус（Статус，Статус）
      if (window.mobilePhone) {
        const listState = {
          app: 'messages',
          title: '...',
          view: 'messageList', // ...Статус
        };
        // Статус，
        window.mobilePhone.currentAppState = listState;
        window.mobilePhone.updateAppHeader(listState);
        console.log('[Message App] ...Статус...Сообщения/* Список */:', listState);
      }

      // /* Приложение */
      this.updateAppContent();
    }

    switchTab(tabName) {
      console.log(`[Message App] ...: ${tabName}`);

      try {
        // Статус：currentView'addFriend'，currentTabtab
        this.currentTab = tabName; // Настройки...tab
        // this.currentView'addFriend'，

        // Уведомление/* Приложение */Статус（）
        if (window.mobilePhone && this.currentView === 'addFriend') {
          let title = '...Друзья';
          if (tabName === 'delete') {
            title = 'УдалитьДрузья';
          } else if (tabName === 'createGroup') {
            title = '...';
          } else if (tabName === 'deleteGroup') {
            title = 'Удалить...';
          }

          // Статус，view
          if (window.mobilePhone.currentAppState) {
            window.mobilePhone.currentAppState.title = title;
            window.mobilePhone.updateAppHeader(window.mobilePhone.currentAppState);
          }
        }

        // DOM
        setTimeout(() => {
          this.updateAppContent();
          // tab-navigation
          this.ensureTabNavigationVisible();
        }, 10);
      } catch (error) {
        console.error('[Message App] error:', error);
        // Если，Статус
        this.currentTab = 'add';
        this.updateAppContent();
      }
    }

    // tab-navigation
    ensureTabNavigationVisible() {
      try {
        const tabNavigation = document.querySelector('.tab-navigation');
        if (tabNavigation) {
          // tab-navigation
          tabNavigation.style.display = 'flex';

          // tabactiveСтатус
          const allTabs = tabNavigation.querySelectorAll('.tab-btn');
          allTabs.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tab') === this.currentTab) {
              btn.classList.add('active');
            }
          });

          console.log(`[Message App] Tab...，...tab: ${this.currentTab}`);
        } else {
          console.warn('[Message App] Taberror，error');
          // Еслиtab-navigation，
          setTimeout(() => {
            this.updateAppContent();
          }, 100);
        }
      } catch (error) {
        console.error('[Message App] errortaberror:', error);
      }
    }

    // ОбновитьУдалитьДрузья/* Список */
    refreshDeleteFriendList() {
      if (this.currentView === 'addFriend' && this.currentTab === 'delete') {
        this.updateAppContent();
      }
    }

    // /* Приложение */
    updateAppContent() {
      try {
        const appContent = document.getElementById('app-content');
        if (!appContent) {
          console.error('[Message App] app-contenterror');
          return;
        }

        // Сохранить（）
        const currentScrollTop = appContent.scrollTop;

        const newContent = this.getAppContent();
        if (!newContent) {
          console.error('[Message App] getAppContentНазадerror');
          return;
        }

        appContent.innerHTML = newContent;

        // ЕслиСообщения/* Страница деталей */，/* Приложение */Друзья
        if (this.currentView === 'messageDetail' && this.currentFriendId) {
          this.applyFriendSpecificBackground(this.currentFriendId);
        }

        setTimeout(() => {
          try {
            this.bindEvents();
            console.log('[Message App] ...');
          } catch (bindError) {
            console.error('[Message App] error:', bindError);
          }
        }, 20);

        // （）
        if (currentScrollTop > 0) {
          setTimeout(() => {
            appContent.scrollTop = currentScrollTop;
          }, 50);
        }
      } catch (error) {
        console.error('[Message App] error/* Приложение */error:', error);
        // /* Состояние ошибки */
        const appContent = document.getElementById('app-content');
        if (appContent) {
          appContent.innerHTML = `
                    <div class="error-state">
                        <div class="error-icon">⚠️</div>
                        <div class="error-text">...</div>
                        <div class="error-details">${error.message}</div>
                        <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">...</button>
                    </div>
                `;
        }
      }
    }

    // Сообщения/* Страница деталей */
    renderMessageDetail() {
      console.log('[Message App] ...Сообщения...');

      if (!this.currentFriendId) {
        console.error('[Message App] errorДрузья');
        return '<div class="error-message">...Друзья</div>';
      }

      if (window.renderMessageDetailForFriend) {
        // Назад/* Заглушка загрузки */，
        setTimeout(() => {
          this.loadMessageDetailAsync();
        }, 100);

        // CSS class
        const isGroup = this.isCurrentChatGroup();
        const appClass = isGroup ? 'message-detail-app group-chat' : 'message-detail-app';
        const placeholder = isGroup ? '...Сообщения...' : '...Сообщения...';

        return `
                <div class="${appClass}">
                    <div class="message-detail-content">
                        <div class="messages-loading">
                            <div class="loading-spinner"></div>
                            <span>...Сообщения...</span>
                        </div>
                    </div>
                    <div class="message-detail-footer">
                        <div class="message-send-area">
                            <div class="send-input-container">
                            <button class="send-tool-toggle-btn" id="detail-tool-toggle-btn" title="..."><i class="fas fa-wrench"></i></button>
                                <textarea id="message-detail-input" placeholder="${placeholder}" maxlength="1000"></textarea>
                                <div class="send-tools" style="display: none;">
                                    <button class="send-tool-btn" id="detail-emoji-btn" title="..."><i class="fas fa-smile"></i></button>
                                    <button class="send-tool-btn" id="detail-sticker-btn" title="..."><i class="fas fa-image"></i></button>
                                    <button class="send-tool-btn" id="detail-voice-btn" title="..."><i class="fas fa-microphone"></i></button>
                                    <button class="send-tool-btn" id="detail-redpack-btn" title="..."><i class="fas fa-gift"></i></button>
                                    <button class="send-tool-btn" id="detail-attachment-btn" title="..."><i class="fas fa-folder"></i></button>
                                </div>

                                <button class="send-message-btn" id="detail-send-btn"><i class="fas fa-paper-plane"></i></button>
                            </div>

                        </div>
                    </div>
                </div>
            `;
      } else {
        return `
                <div class="message-detail-app">
                    <div class="message-detail-content">
                        <div class="error-messages">
                            <div class="error-icon">⚠️</div>
                            <div class="error-text">Сообщения...</div>
                        </div>
                    </div>
                    <div class="message-detail-footer">
                        <div class="message-send-area">
                            <div class="send-input-container">
                            <button class="send-tool-toggle-btn" id="detail-tool-toggle-btn" title="..."><i class="fas fa-wrench"></i></button>
                                <textarea id="message-detail-input" placeholder="...Сообщения..." maxlength="1000"></textarea>
                                <div class="send-tools" style="display: none;">
                                    <button class="send-tool-btn" id="detail-emoji-btn" title="..."><i class="fas fa-smile"></i></button>
                                    <button class="send-tool-btn" id="detail-sticker-btn" title="..."><i class="fas fa-image"></i></button>
                                    <button class="send-tool-btn" id="detail-voice-btn" title="..."><i class="fas fa-microphone"></i></button>
                                    <button class="send-tool-btn" id="detail-redpack-btn" title="..."><i class="fas fa-gift"></i></button>
                                    <button class="send-tool-btn" id="detail-attachment-btn" title="..."><i class="fas fa-folder"></i></button>
                                </div>

                                <button class="send-message-btn" id="detail-send-btn"><i class="fas fa-paper-plane"></i></button>
                            </div>

                        </div>
                    </div>
                </div>
            `;
      }
    }

    // Сообщения
    async loadMessageDetailAsync() {
      try {
        if (!window.renderMessageDetailForFriend) {
          throw new Error('Сообщенияerror');
        }

        const content = await window.renderMessageDetailForFriend(this.currentFriendId, this.currentFriendName);

        const appContent = document.getElementById('app-content');
        if (appContent && this.currentView === 'messageDetail') {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = content;

          // message-detail-header
          const header = tempDiv.querySelector('.message-detail-header');
          if (header) {
            header.remove();
          }

          // -
          let finalContent = tempDiv.innerHTML;

          // HTML
          const newFooterHTML = `
                    <div class="message-detail-footer">
                        <div class="message-send-area">
                            <div class="send-input-container">
                            <button class="send-tool-toggle-btn" id="detail-tool-toggle-btn" title="..."><i class="fas fa-wrench"></i></button>
                                <textarea id="message-detail-input" placeholder="...Сообщения..." maxlength="1000"></textarea>
                                <div class="send-tools" style="display: none;">
                                    <button class="send-tool-btn" id="detail-emoji-btn" title="..."><i class="fas fa-smile"></i></button>
                                    <button class="send-tool-btn" id="detail-sticker-btn" title="..."><i class="fas fa-image"></i></button>
                                    <button class="send-tool-btn" id="detail-voice-btn" title="..."><i class="fas fa-microphone"></i></button>
                                    <button class="send-tool-btn" id="detail-redpack-btn" title="..."><i class="fas fa-gift"></i></button>
                                    <button class="send-tool-btn" id="detail-attachment-btn" title="..."><i class="fas fa-folder"></i></button>
                                </div>

                                <button class="send-message-btn" id="detail-send-btn"><i class="fas fa-paper-plane"></i></button>
                            </div>
                        </div>
                    </div>`;

          // Если，
          const existingFooter = tempDiv.querySelector('.message-detail-footer');
          if (existingFooter) {
            existingFooter.remove();
            if (window.DEBUG_MESSAGE_APP) {
              console.log('[Message App] ...');
            }
          }

          const mainContainer = tempDiv.querySelector('.message-detail-app, .message-detail-content');
          if (mainContainer) {
            mainContainer.insertAdjacentHTML('afterend', newFooterHTML);
          } else {
            // Если，
            tempDiv.insertAdjacentHTML('beforeend', newFooterHTML);
          }

          finalContent = tempDiv.innerHTML;
          appContent.innerHTML = finalContent;

          if (window.DEBUG_MESSAGE_APP) {
            console.log('[Message App] ...Настройки.../* Структура */');
          }

          if (window.bindMessageDetailEvents) {
            window.bindMessageDetailEvents();
          }

          // /* Страница деталей */
          this.bindDetailSendEvents();
        }
      } catch (error) {
        console.error('[Message App] errorСообщенияerror:', error);
        const appContent = document.getElementById('app-content');
        if (appContent && this.currentView === 'messageDetail') {
          appContent.innerHTML = `
                    <div class="message-detail-app">
                        <div class="message-detail-content">
                            <div class="error-messages">
                                <div class="error-icon">⚠️</div>
                                <div class="error-text">...Сообщения...</div>
                                <div class="error-details">${error.message}</div>
                            </div>
                        </div>
                        <div class="message-detail-footer">
                            <div class="message-send-area">
                                <div class="send-input-container">
                                <button class="send-tool-toggle-btn" id="detail-tool-toggle-btn" title="...">🔧</button>
                                    <textarea id="message-detail-input" placeholder="...Сообщения..." maxlength="1000"></textarea>
                                    <div class="send-tools" style="display: none;">
                                        <button class="send-tool-btn" id="detail-emoji-btn" title="...">😊</button>
                                        <button class="send-tool-btn" id="detail-sticker-btn" title="...">🎭</button>
                                        <button class="send-tool-btn" id="detail-voice-btn" title="...">🎤</button>
                                        <button class="send-tool-btn" id="detail-redpack-btn" title="...">🧧</button>
                                        <button class="send-tool-btn" id="detail-attachment-btn" title="...">📁</button>
                                    </div>

                                    <button class="send-message-btn" id="detail-send-btn">...</button>
                                </div>

                            </div>
                        </div>
                    </div>
                `;
          this.bindEvents();
          this.bindDetailSendEvents();
        }
      }
    }

    // Друзья
    async addFriend() {
      const nameInput = document.getElementById('friend-name');
      const numberInput = document.getElementById('friend-number');

      if (!nameInput || !numberInput) {
        this.showMessage('/* Поле ввода */...', 'error');
        return;
      }

      const name = nameInput.value.trim();
      const number = numberInput.value.trim();

      if (!name || !number) {
        this.showMessage('...', 'error');
        return;
      }

      // ，
      // РедактироватьСообщения

      // РедактироватьНовое
      try {
        await this.addToContext(name, number);
        this.showMessage('Друзья...，...Редактировать...Новое...！', 'success');

        // Назад/* Список */
        setTimeout(() => {
          this.showMessageList();
        }, 1500);
      } catch (error) {
        console.error('[Message App] error:', error);
        this.showMessage('Друзья...，...Редактировать...', 'warning');
      }
    }

    // УдалитьДрузья
    async deleteFriend(friendId, friendName) {
      // ПодтвердитьУдалить
      if (
        !confirm(
          `ОК...УдалитьДрузья "${friendName}" (ID: ${friendId}) ...？\n\n...УдалитьСообщения...Друзья...Сообщения...。`,
        )
      ) {
        return;
      }

      try {
        // Сообщения
        if (!window.contextMonitor) {
          throw new Error('error');
        }

        this.showMessage('...Сообщения...', 'info');

        // Сообщения
        const chatData = await window.contextMonitor.getCurrentChatMessages();
        if (!chatData || !chatData.messages) {
          throw new Error('errorСообщения');
        }

        // ДрузьяСообщения
        const messagesToProcess = [];

        const contextMonitor =
          window['contextMonitor'] || (window['ContextMonitor'] ? new window['ContextMonitor']() : null);
        if (!contextMonitor) {
          throw new Error('error');
        }

        // Друзья
        const friendMatchers = contextMonitor.createFriendMessageMatchers(friendId);
        const friendNameMatcher = contextMonitor.createFriendNameMatcher(friendName);

        // Друзья
        const friendFormatRegex = new RegExp(`\\[Друзьяid\\|${friendName}\\|${friendId}\\]`, 'g');

        chatData.messages.forEach((message, index) => {
          if (message.mes && typeof message.mes === 'string') {
            let messageModified = false;
            let newMessageContent = message.mes;
            let hasMyMessage = false;
            let hasOtherMessage = false;

            // ：thinking
            const messageForCheck = this.removeThinkingTags(message.mes);

            // Друзья（thinking）
            if (friendFormatRegex.test(messageForCheck)) {
              // thinkingДрузья
              newMessageContent = this.removePatternOutsideThinkingTags(message.mes, friendFormatRegex);
              messageModified = newMessageContent !== message.mes;
              if (messageModified) {
                console.log(`[Message App] Сообщения ${index} ...Друзья...，...: "${newMessageContent}"`);
              }
            }

            // СообщенияСообщения（thinking）
            const messageForChatCheck = this.removeThinkingTags(message.mes);
            hasMyMessage = friendMatchers.myMessage.test(messageForChatCheck);
            hasOtherMessage = friendMatchers.otherMessage.test(messageForChatCheck);

            console.log(`[Message App] Сообщения ${index} ...:`, {
              hasFormatTag: messageModified,
              hasMyMessage,
              hasOtherMessage,
              originalLength: message.mes.length,
              newLength: newMessageContent.length,
              preview: message.mes.substring(0, 50) + '...',
            });

            if (hasMyMessage || hasOtherMessage) {
              // Если，УдалитьСообщения
              messagesToProcess.push({
                index: index,
                id: message.id || index,
                action: 'delete',
                reason: '...',
                originalContent: message.mes,
                preview: message.mes.length > 50 ? message.mes.substring(0, 50) + '...' : message.mes,
              });
            } else if (messageModified) {
              // ，УдалитьСообщения
              messagesToProcess.push({
                index: index,
                id: message.id || index,
                action: 'modify',
                reason: '...Друзья...',
                originalContent: message.mes,
                newContent: newMessageContent.trim(),
                preview: message.mes.length > 50 ? message.mes.substring(0, 50) + '...' : message.mes,
              });
            }

            friendFormatRegex.lastIndex = 0;
            friendMatchers.myMessage.lastIndex = 0;
            friendMatchers.otherMessage.lastIndex = 0;
          }
        });

        if (messagesToProcess.length === 0) {
          this.showMessage('...Сообщения...', 'warning');
          return;
        }

        this.showMessage(`... ${messagesToProcess.length} ...Сообщения，......`, 'info');

        // Редактировать
        if (!window.mobileContextEditor) {
          throw new Error('errorРедактироватьerror');
        }

        if (!window.mobileContextEditor.isSillyTavernReady()) {
          throw new Error('SillyTavernerror');
        }

        // ，
        const sortedMessages = messagesToProcess.sort((a, b) => b.index - a.index);
        let processedCount = 0;

        for (const msgInfo of sortedMessages) {
          try {
            console.log(`[Message App] ...Сообщения ${msgInfo.index}:`, {
              action: msgInfo.action,
              reason: msgInfo.reason,
              originalContent: msgInfo.originalContent?.substring(0, 100) + '...',
              newContent: msgInfo.newContent?.substring(0, 100) + '...',
            });

            if (msgInfo.action === 'delete') {
              // УдалитьСообщения（）
              console.log(`[Message App] УдалитьСообщения ${msgInfo.index}: ${msgInfo.reason}`);
              await window.mobileContextEditor.deleteMessage(msgInfo.index);
              console.log(`[Message App] ✅ ...УдалитьСообщения ${msgInfo.index}`);
            } else if (msgInfo.action === 'modify') {
              // Сообщения（）
              console.log(`[Message App] ...Сообщения ${msgInfo.index}: ${msgInfo.reason}`);
              if (msgInfo.newContent.length > 0) {
                await window.mobileContextEditor.modifyMessage(msgInfo.index, msgInfo.newContent);
                console.log(`[Message App] ✅ ...Сообщения ${msgInfo.index}, ...: "${msgInfo.newContent}"`);
              } else {
                // ЕслиСообщения，УдалитьСообщения
                console.log(`[Message App] Сообщения ${msgInfo.index} ...，Удалить...Сообщения`);
                await window.mobileContextEditor.deleteMessage(msgInfo.index);
                console.log(`[Message App] ✅ ...Удалить...Сообщения ${msgInfo.index}`);
              }
            }
            processedCount++;
          } catch (error) {
            console.error(`[Message App] ❌ errorСообщения ${msgInfo.index} error:`, error);
          }
        }

        if (processedCount > 0) {
          this.showMessage(`...Друзья "${friendName}" ... ${processedCount} ...Сообщения`, 'success');

          // Обновить
          setTimeout(() => {
            this.refreshDeleteFriendList();
          }, 1000);
        } else {
          this.showMessage('...', 'error');
        }
      } catch (error) {
        console.error('[Message App] УдалитьДрузьяerror:', error);
        this.showMessage(`УдалитьДрузья...: ${error.message}`, 'error');
      }
    }

    async addToContext(friendName, friendNumber) {
      // Редактировать
      if (!window.mobileContextEditor) {
        throw new Error('errorРедактироватьerror');
      }

      // SillyTavern
      if (!window.mobileContextEditor.isSillyTavernReady()) {
        throw new Error('SillyTavernerror');
      }

      // Друзья - "Друзьяid"
      const friendInfo = `[ДругId|${friendName}|${friendNumber}]`;

      // Новое
      try {
        const messageIndex = await window.mobileContextEditor.addMessage(friendInfo, false, '...');

        console.log(`[Message App] Друзья...Сообщения ${messageIndex}: ${friendInfo}`);

        // СохранитьaddMessage

        return messageIndex;
      } catch (error) {
        console.error('[Message App] errorСообщенияerror:', error);
        throw error;
      }
    }

    // Случайный аватар
    getRandomAvatar() {
      // Назад，，
      return '';
    }

    // 🌟 ：
    formatFileSizeHelper(bytes) {
      if (bytes === 0) return '0 Bytes';

      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 🌟 ：Сообщения
    handleNewImageMessage(imageInfo) {
      try {
        console.log('[Message App] 🔍 ...Сообщения:', imageInfo);

        // Сообщения
        if (imageInfo.chatTarget !== this.currentFriendId) {
          console.log('[Message App] 🔍 ...Сообщения...，...');
          return;
        }

        // Сообщения - Пользователь
        const imageMessage = {
          type: 'sent', // Пользователь...Сообщения
          subType: 'image', // ...
          isUser: true, // ...ПользовательСообщения
          senderType: 'user', // ...
          friendName: imageInfo.chatName,
          qqNumber: imageInfo.chatTarget,
          content: '[...]', // ...
          imagePath: imageInfo.imagePath,
          fileName: imageInfo.fileName,
          fileSize: imageInfo.fileSize,
          fileType: imageInfo.fileType,
          time: imageInfo.time,
          timestamp: Date.now(),
          isImage: true,
          // 🌟 ：HTML
          detailedContent: this.generateSimpleImageHTML(imageInfo.imagePath, imageInfo.fileName),
        };

        console.log('[Message App] 🔍 ...Сообщения...:', imageMessage);

        // Сообщения/* Список */
        this.addImageMessageToCurrentChat(imageMessage);

        // Сообщения
        this.displayImageMessageDirectly(imageInfo);

        // Обновить
        this.refreshMessageDisplay();
      } catch (error) {
        console.error('[Message App] ❌ errorСообщенияerror:', error);
      }
    }

    // 🌟 ：HTML
    generateImageHTML(imagePath, fileName) {
      // data-extractor.js
      return `<img src="${imagePath}" alt="${fileName}"
        class="qq-image-message"
        style="max-width: 200px; max-height: 200px; border-radius: 8px; margin: 4px; cursor: pointer; background: transparent;"
        onclick="this.style.transform='scale(1.5)'; setTimeout(() => this.style.transform='scale(1)', 2000);"
        title="${fileName}">`;
    }

    // 🌟 ：HTML - Пользователь
    generateSimpleImageHTML(imagePath, fileName) {
      return `<img src="${imagePath}" alt="${fileName}"
        class="user-sent-image"
        style="
          max-width: 200px;
          max-height: 300px;
          border-radius: 12px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          object-fit: cover;
        "
        onclick="this.style.transform='scale(1.2)'; setTimeout(() => this.style.transform='scale(1)', 1500);"
        title="...">`;
    }

    // 🌟 ：Сообщения
    addImageMessageToCurrentChat(imageMessage) {
      try {
        console.log('[Message App] 🔍 ...Сообщения...，...ДрузьяID:', this.currentFriendId);
        console.log('[Message App] 🔍 friendsData...:', !!this.friendsData);
        console.log('[Message App] 🔍 friendsData...:', typeof this.friendsData);

        // friendsData
        if (!this.friendsData) {
          console.warn('[Message App] ⚠️ friendsDataerror，error...');
          this.friendsData = {};
        }

        // Друзья
        if (!this.friendsData[this.currentFriendId]) {
          console.warn('[Message App] ⚠️ errorДрузьяerror，error...');
          this.friendsData[this.currentFriendId] = {
            friendId: this.currentFriendId,
            friendName: this.currentFriendName || imageMessage.friendName,
            messages: [],
            lastMessage: '',
            lastTime: '',
          };
        }

        // Сообщения/* Список */
        if (!this.friendsData[this.currentFriendId].messages) {
          this.friendsData[this.currentFriendId].messages = [];
        }

        this.friendsData[this.currentFriendId].messages.push(imageMessage);

        // Сообщения
        this.friendsData[this.currentFriendId].lastMessage = '[...Сообщения]';
        this.friendsData[this.currentFriendId].lastTime = imageMessage.time;

        console.log('[Message App] ✅ ...Сообщения...');
        console.log('[Message App] 🔍 ...ДрузьяСообщения...:', this.friendsData[this.currentFriendId].messages.length);
      } catch (error) {
        console.error('[Message App] ❌ errorСообщенияerror:', error);
      }
    }

    // 🌟 ：ОбновитьСообщения
    refreshMessageDisplay() {
      try {
        console.log('[Message App] 🔍 ...ОбновитьСообщения...');
        console.log('[Message App] 🔍 ...ДрузьяID:', this.currentFriendId);
        console.log('[Message App] 🔍 friendsData...:', !!this.friendsData);

        // friendsData
        if (!this.friendsData) {
          console.warn('[Message App] ⚠️ friendsDataerror，errorОбновитьСообщенияerror');
          return;
        }

        // ОбновитьСообщения
        if (this.currentFriendId && window.messageRenderer) {
          console.log('[Message App] 🔍 ОбновитьСообщения...');

          // ДрузьяСообщения
          const friendData = this.friendsData[this.currentFriendId];
          console.log('[Message App] 🔍 ...Друзья...:', friendData);

          if (friendData && friendData.messages) {
            console.log('[Message App] 🔍 ...ДрузьяСообщения...:', friendData.messages.length);

            // Сообщения
            if (typeof window.messageRenderer.renderMessages === 'function') {
              console.log('[Message App] 🔍 ...renderMessages...');
              window.messageRenderer.renderMessages(friendData.messages);
            } else if (typeof window.messageRenderer.refreshCurrentMessages === 'function') {
              console.log('[Message App] 🔍 ...refreshCurrentMessages...');
              window.messageRenderer.refreshCurrentMessages();
            } else {
              console.warn('[Message App] ⚠️ errorСообщенияerror');
            }
          } else {
            console.warn('[Message App] ⚠️ errorДрузьяerrorСообщения/* Список */error');
          }
        } else {
          console.warn('[Message App] ⚠️ currentFriendIderrormessageRenderererror');
        }

        // ОбновитьДрузья/* Список */（Сообщения）
        console.log('[Message App] 🔍 ОбновитьДрузья/* Список */UI');
        this.refreshFriendListUI();

        console.log('[Message App] ✅ Сообщения...Обновить...');
      } catch (error) {
        console.error('[Message App] ❌ ОбновитьСообщенияerror:', error);
      }
    }

    // 🌟 ：Сообщения/* Список */Сообщения（）
    displayImageMessageDirectly(imageInfo) {
      try {
        console.log('[Message App] 🔍 ...Сообщения:', imageInfo);

        // Сообщения/* Список */
        const messageContainer =
          document.querySelector('.message-list') ||
          document.querySelector('#message-list') ||
          document.querySelector('.messages-container');

        if (!messageContainer) {
          console.warn('[Message App] ⚠️ errorСообщения/* Список */error，error...');
          // Если，
          this.createTemporaryImageDisplay(imageInfo);
          return;
        }

        // СообщенияHTML -
        const imageMessageHTML = `
          <div class="message-detail sent image-message" style="
            display: flex;
            justify-content: flex-end;
            margin: 8px 10px;
            padding: 0;
          ">
            <div class="user-image-container" style="
              max-width: 70%;
              display: flex;
              justify-content: flex-end;
            ">
              <img src="${imageInfo.imagePath}"
                   alt="${imageInfo.fileName}"
                   class="user-sent-image"
                   style="
                     max-width: 200px;
                     max-height: 300px;
                     border-radius: 12px;
                     cursor: pointer;
                     box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                     object-fit: cover;
                   "
                   onclick="this.style.transform='scale(1.2)'; setTimeout(() => this.style.transform='scale(1)', 1500);"
                   title="...">
            </div>
          </div>
        `;

        // Сообщения
        messageContainer.insertAdjacentHTML('beforeend', imageMessageHTML);

        messageContainer.scrollTop = messageContainer.scrollHeight;

        console.log('[Message App] ✅ ...Сообщения...');
      } catch (error) {
        console.error('[Message App] ❌ errorСообщенияerror:', error);
      }
    }

    // 🌟 ：
    createTemporaryImageDisplay(imageInfo) {
      try {
        console.log('[Message App] 🔍 ...');

        const tempDisplay = document.createElement('div');
        tempDisplay.id = 'temp-image-display';
        tempDisplay.style.cssText = `
          position: fixed;
          top: 10px;
          right: 10px;
          z-index: 9999;
          background: white;
          border: 2px solid #4CAF50;
          border-radius: 8px;
          padding: 10px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          max-width: 300px;
        `;

        tempDisplay.innerHTML = `
          <div style="margin-bottom: 8px; font-weight: bold; color: #4CAF50;">
            📱 ...Сообщения
          </div>
          <div style="margin-bottom: 8px;">
            <strong>...:</strong> ${imageInfo.chatName}
          </div>
          <div style="margin-bottom: 8px;">
            <img src="${imageInfo.imagePath}"
                 alt="${imageInfo.fileName}"
                 style="max-width: 100%; border-radius: 4px; cursor: pointer;"
                 onclick="this.style.transform='scale(1.2)'; setTimeout(() => this.style.transform='scale(1)', 1000);">
          </div>
          <div style="font-size: 12px; color: #666;">
            ${imageInfo.fileName} | ${this.formatFileSizeHelper(imageInfo.fileSize)}
          </div>
          <button onclick="this.parentElement.remove()"
                  style="margin-top: 8px; padding: 4px 8px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Закрыть
          </button>
        `;

        const existingTemp = document.getElementById('temp-image-display');
        if (existingTemp) {
          existingTemp.remove();
        }

        document.body.appendChild(tempDisplay);

        // 5
        setTimeout(() => {
          if (tempDisplay.parentElement) {
            tempDisplay.remove();
          }
        }, 5000);

        console.log('[Message App] ✅ ...');
      } catch (error) {
        console.error('[Message App] ❌ error:', error);
      }
    }

    // Сообщения
    showMessage(text, type = 'info') {
      // Сообщения
      const messageDiv = document.createElement('div');
      messageDiv.className = `message-toast ${type}`;
      messageDiv.textContent = text;
      messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10000;
            padding: 12px 24px;
            border-radius: 25px;
            color: white;
            font-size: 14px;
            max-width: 300px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            background: ${
              type === 'error' ? '#ff4444' : type === 'success' ? '#4CAF50' : type === 'warning' ? '#FF9800' : '#2196F3'
            };
            animation: messageSlideIn 0.3s ease-out;
        `;

      if (!document.getElementById('message-toast-style')) {
        const style = document.createElement('style');
        style.id = 'message-toast-style';
        style.textContent = `
                @keyframes messageSlideIn {
                    from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                    to { transform: translateX(-50%) translateY(0); opacity: 1; }
                }
                @keyframes messageSlideOut {
                    from { transform: translateX(-50%) translateY(0); opacity: 1; }
                    to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                }
            `;
        document.head.appendChild(style);
      }

      document.body.appendChild(messageDiv);

      // 3
      setTimeout(() => {
        messageDiv.style.animation = 'messageSlideOut 0.3s ease-out';
        setTimeout(() => {
          if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
          }
        }, 300);
      }, 3000);
    }

    // Открыть
    openChat(friendId) {
      // ДрузьяДрузья
      if (window.friendRenderer) {
        const friend = window.friendRenderer.getFriendById(friendId);
        if (friend) {
          this.showMessageDetail(friendId, friend.name);
        } else {
          this.showMessage('Друзья...', 'error');
        }
      } else {
        this.showMessageDetail(friendId, null);
      }
    }

    // Сообщения/* Страница деталей */
    showMessageDetail(friendId, friendName) {
      console.log(`[Message App] ...Сообщения...: ${friendId}, ${friendName}`);

      this.currentView = 'messageDetail';
      this.currentFriendId = friendId;
      this.currentFriendName = friendName;
      // ：currentIsGroup Статус selectFriend() Настройки

      // Уведомление/* Приложение */Статус
      if (window.mobilePhone) {
        const detailState = {
          app: 'messages',
          title: friendName || `Друзья ${friendId}`,
          view: 'messageDetail',
          friendId: friendId,
          friendName: friendName,
        };
        window.mobilePhone.pushAppState(detailState);
      }

      // /* Приложение */
      this.updateAppContent();
    }

    // /* Приложение */Друзья
    applyFriendSpecificBackground(friendId) {
      try {
        console.log(`[Message App] .../* Приложение */Друзья...: ${friendId}`);

        // styleConfigManager
        if (!window.styleConfigManager) {
          console.warn('[Message App] styleConfigManagererror，error/* Приложение */Друзьяerror');
          return;
        }

        // Друзья
        const config = window.styleConfigManager.getConfig();
        if (!config.friendBackgrounds || config.friendBackgrounds.length === 0) {
          console.log('[Message App] ...Друзья...');
          return;
        }

        // Друзья
        const friendBackground = config.friendBackgrounds.find(bg => bg.friendId === friendId);
        if (!friendBackground) {
          console.log(`[Message App] Друзья ${friendId} ...`);
          return;
        }

        // Сообщения
        const messageDetailContent = document.querySelector('.message-detail-content');
        if (!messageDetailContent) {
          console.warn('[Message App] Сообщенияerror');
          return;
        }

        // /* Приложение */
        const backgroundImage = friendBackground.backgroundImage || friendBackground.backgroundImageUrl;
        if (backgroundImage) {
          const rotation = parseFloat(friendBackground.rotation) || 0;
          const scale = parseFloat(friendBackground.scale) || 1;
          const backgroundPosition = friendBackground.backgroundPosition || 'center center';

          // Настройки，
          messageDetailContent.style.backgroundImage = `url(${backgroundImage})`;
          messageDetailContent.style.backgroundSize = 'cover';
          messageDetailContent.style.backgroundPosition = backgroundPosition;
          messageDetailContent.style.backgroundRepeat = 'no-repeat';
          messageDetailContent.style.transform = `rotate(${rotation}deg) scale(${scale})`;
          messageDetailContent.style.transformOrigin = 'center center';

          console.log(`[Message App] ✅ .../* Приложение */Друзья ${friendId} ...`);
        }
      } catch (error) {
        console.error('[Message App] /* Приложение */Друзьяerror:', error);
      }
    }

    // УдалитьДрузья（Удалить）
    async debugDeleteFriend(friendId, friendName) {
      console.log(`[Message App] 🔍 ...УдалитьДрузья...: ${friendName} (ID: ${friendId})`);

      try {
        // Сообщения
        if (!window.contextMonitor) {
          throw new Error('error');
        }

        // Сообщения
        const chatData = await window.contextMonitor.getCurrentChatMessages();
        if (!chatData || !chatData.messages) {
          throw new Error('errorСообщения');
        }

        console.log(`[Message App] 📊 ... ${chatData.messages.length} ...Сообщения`);

        const contextMonitor =
          window['contextMonitor'] || (window['ContextMonitor'] ? new window['ContextMonitor']() : null);
        const friendMatchers = contextMonitor.createFriendMessageMatchers(friendId);
        const friendFormatRegex = new RegExp(`\\[Друзьяid\\|${friendName}\\|${friendId}\\]`, 'g');

        let foundMessages = [];

        chatData.messages.forEach((message, index) => {
          if (message.mes && typeof message.mes === 'string') {
            let hasFormatTag = friendFormatRegex.test(message.mes);
            let hasMyMessage = friendMatchers.myMessage.test(message.mes);
            let hasOtherMessage = friendMatchers.otherMessage.test(message.mes);

            if (hasFormatTag || hasMyMessage || hasOtherMessage) {
              let newContent = message.mes.replace(friendFormatRegex, '');
              foundMessages.push({
                index,
                hasFormatTag,
                hasMyMessage,
                hasOtherMessage,
                originalContent: message.mes,
                newContent: newContent.trim(),
                wouldDelete: hasMyMessage || hasOtherMessage,
                wouldModify: hasFormatTag && !hasMyMessage && !hasOtherMessage,
                preview: message.mes.substring(0, 100) + (message.mes.length > 100 ? '...' : ''),
              });
            }

            friendFormatRegex.lastIndex = 0;
            friendMatchers.myMessage.lastIndex = 0;
            friendMatchers.otherMessage.lastIndex = 0;
          }
        });

        console.log(`[Message App] 📋 ... ${foundMessages.length} ...Сообщения:`);
        foundMessages.forEach(msg => {
          console.log(`[Message App] Сообщения ${msg.index}:`, {
            ...: msg.wouldDelete ? '🗑️ Удалить...Сообщения' : msg.wouldModify ? '✏️ ...Сообщения...' : '❓ ...',
            ...: msg.hasFormatTag ? '✅' : '❌',
            ...Сообщения: msg.hasMyMessage ? '✅' : '❌',
            ...Сообщения: msg.hasOtherMessage ? '✅' : '❌',
            ...: msg.preview,
            ...: msg.newContent ? msg.newContent.substring(0, 100) + '...' : '(...)',
          });
        });

        return foundMessages;
      } catch (error) {
        console.error('[Message App] errorУдалитьДрузьяerror:', error);
        return [];
      }
    }

    bindCreateGroupEvents(appContent) {
      if (this.currentTab !== 'createGroup') return;

      // Друзья
      const selectAllBtn = appContent.querySelector('#select-all-friends');
      if (selectAllBtn) {
        selectAllBtn.addEventListener('click', () => {
          this.toggleSelectAllFriends();
        });
      }

      // Друзья
      const friendItems = appContent.querySelectorAll('.friend-selection-item');
      friendItems.forEach(item => {
        const checkbox = item.querySelector('.friend-checkbox-input');
        if (checkbox) {
          checkbox.addEventListener('change', e => {
            this.handleFriendSelection(e.target, item);
          });
        }
      });

      const submitBtn = appContent.querySelector('#create-group-submit');
      if (submitBtn) {
        submitBtn.addEventListener('click', () => {
          this.createGroup();
        });
      }
    }

    // Удалить
    bindDeleteGroupEvents(appContent) {
      if (this.currentTab !== 'deleteGroup') return;

      // Обновить/* Список */
      const refreshBtn = appContent.querySelector('#refresh-group-list');
      if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
          this.refreshDeleteGroupList();
        });
      }

      // Удалить
      const deleteGroupBtns = appContent.querySelectorAll('.delete-group-btn');
      deleteGroupBtns.forEach(btn => {
        btn.addEventListener('click', e => {
          const target = e.currentTarget;
          const groupId = target.getAttribute('data-group-id');
          const groupName = target.getAttribute('data-group-name');
          if (groupId && groupName) {
            this.deleteGroup(groupId, groupName);
          }
        });
      });
    }

    // Друзья
    toggleSelectAllFriends() {
      const checkboxes = document.querySelectorAll('.friend-checkbox-input');
      const allChecked = Array.from(checkboxes).every(cb => cb.checked);

      checkboxes.forEach(cb => {
        cb.checked = !allChecked;
        const item = cb.closest('.friend-selection-item');
        this.handleFriendSelection(cb, item);
      });

      const selectAllBtn = document.querySelector('#select-all-friends');
      if (selectAllBtn) {
        selectAllBtn.textContent = allChecked ? '...' : 'Отменить...';
      }
    }

    // Друзья
    handleFriendSelection(checkbox, item) {
      const friendId = item.getAttribute('data-friend-id');
      const friendName = item.getAttribute('data-friend-name');
      const selectedMembersContainer = document.querySelector('#selected-members');

      if (checkbox.checked) {
        const memberElement = document.createElement('div');
        memberElement.className = 'selected-member';
        memberElement.setAttribute('data-member-id', friendId);
        memberElement.innerHTML = `
                <span class="member-name">${friendName}</span>
                <button class="remove-member-btn" onclick="this.parentElement.remove(); document.querySelector('#friend-${friendId}').checked = false;">✕</button>
            `;
        selectedMembersContainer.appendChild(memberElement);
      } else {
        const memberElement = selectedMembersContainer.querySelector(`[data-member-id="${friendId}"]`);
        if (memberElement) {
          memberElement.remove();
        }
      }
    }

    async createGroup() {
      const groupNameInput = document.getElementById('group-name');
      const groupIdInput = document.getElementById('group-id');

      if (!groupNameInput || !groupIdInput) {
        this.showMessage('/* Поле ввода */...', 'error');
        return;
      }

      const groupName = groupNameInput.value.trim();
      const groupId = groupIdInput.value.trim();

      if (!groupName || !groupId) {
        this.showMessage('...ID', 'error');
        return;
      }

      const selectedMembers = this.getSelectedMembers();
      if (selectedMembers.length === 0) {
        this.showMessage('...', 'error');
        return;
      }

      try {
        await this.addGroupToContext(groupName, groupId, selectedMembers);
        this.showMessage('...，...Редактировать...Новое...！', 'success');

        // Назад/* Список */
        setTimeout(() => {
          this.showMessageList();
        }, 1500);
      } catch (error) {
        console.error('[Message App] error:', error);
        this.showMessage('...', 'error');
      }
    }

    getSelectedMembers() {
      const selectedMembers = ['...']; // ...
      const memberElements = document.querySelectorAll('#selected-members .selected-member:not(.default-member)');

      memberElements.forEach(element => {
        const memberName = element.querySelector('.member-name').textContent;
        selectedMembers.push(memberName);
      });

      return selectedMembers;
    }

    async addGroupToContext(groupName, groupId, members) {
      // Редактировать
      if (!window.mobileContextEditor) {
        throw new Error('errorРедактироватьerror');
      }

      // SillyTavern
      if (!window.mobileContextEditor.isSillyTavernReady()) {
        throw new Error('SillyTavernerror');
      }

      // ：[||ID|]
      const membersStr = members.join('、');
      const groupInfo = `[...|${groupName}|${groupId}|${membersStr}]`;

      // Новое
      try {
        const messageIndex = await window.mobileContextEditor.addMessage(groupInfo, false, '...');
        console.log(`[Message App] ...Сообщения ${messageIndex}: ${groupInfo}`);
        return messageIndex;
      } catch (error) {
        console.error('[Message App] errorСообщенияerror:', error);
        throw error;
      }
    }

    // Удалить
    async deleteGroup(groupId, groupName) {
      // ПодтвердитьУдалить
      if (
        !confirm(
          `ОК...Удалить... "${groupName}" (ID: ${groupId}) ...？\n\n...УдалитьСообщения...Сообщения...。`,
        )
      ) {
        return;
      }

      try {
        // УдалитьДрузья
        if (!window.contextMonitor) {
          throw new Error('error');
        }

        this.showMessage('...Сообщения...', 'info');

        // Сообщения
        const chatData = await window.contextMonitor.getCurrentChatMessages();
        if (!chatData || !chatData.messages) {
          throw new Error('errorСообщения');
        }

        // Сообщения
        const messagesToProcess = [];

        // ID
        // []ID
        const allGroupFormatsRegex = new RegExp(`\\[[^\\]]*\\|${groupId}\\|[^\\]]*\\]|\\[[^\\]]*\\|${groupId}\\]`, 'g');

        chatData.messages.forEach((message, index) => {
          if (message.mes && typeof message.mes === 'string') {
            let messageModified = false;
            let newMessageContent = message.mes;

            // ：thinking
            const messageForCheck = this.removeThinkingTags(message.mes);

            // （thinking）
            if (allGroupFormatsRegex.test(messageForCheck)) {
              // thinking
              newMessageContent = this.removePatternOutsideThinkingTags(message.mes, allGroupFormatsRegex);
              messageModified = newMessageContent !== message.mes;
              if (messageModified) {
                console.log(`[Message App] Сообщения ${index} ...，...: "${newMessageContent}"`);
              }
            }

            if (messageModified) {
              messagesToProcess.push({
                index: index,
                id: message.id || index,
                action: newMessageContent.trim().length > 0 ? 'modify' : 'delete',
                reason: '...',
                originalContent: message.mes,
                newContent: newMessageContent.trim(),
                preview: message.mes.length > 50 ? message.mes.substring(0, 50) + '...' : message.mes,
              });
            }

            allGroupFormatsRegex.lastIndex = 0;
          }
        });

        if (messagesToProcess.length === 0) {
          this.showMessage('...', 'warning');
          return;
        }

        this.showMessage(`... ${messagesToProcess.length} ...Сообщения，......`, 'info');

        // Редактировать
        if (!window.mobileContextEditor) {
          throw new Error('errorРедактироватьerror');
        }

        if (!window.mobileContextEditor.isSillyTavernReady()) {
          throw new Error('SillyTavernerror');
        }

        // ，
        const sortedMessages = messagesToProcess.sort((a, b) => b.index - a.index);
        let processedCount = 0;

        for (const msgInfo of sortedMessages) {
          try {
            if (msgInfo.action === 'delete') {
              console.log(`[Message App] УдалитьСообщения ${msgInfo.index}: ${msgInfo.reason}`);
              await window.mobileContextEditor.deleteMessage(msgInfo.index);
              console.log(`[Message App] ✅ ...УдалитьСообщения ${msgInfo.index}`);
            } else if (msgInfo.action === 'modify') {
              console.log(`[Message App] ...Сообщения ${msgInfo.index}: ${msgInfo.reason}`);
              await window.mobileContextEditor.modifyMessage(msgInfo.index, msgInfo.newContent);
              console.log(`[Message App] ✅ ...Сообщения ${msgInfo.index}, ...: "${msgInfo.newContent}"`);
            }
            processedCount++;
          } catch (error) {
            console.error(`[Message App] ❌ errorСообщения ${msgInfo.index} error:`, error);
          }
        }

        if (processedCount > 0) {
          this.showMessage(`... "${groupName}" ... ${processedCount} ...Сообщения`, 'success');

          // Обновить
          setTimeout(() => {
            this.refreshDeleteGroupList();
          }, 1000);
        } else {
          this.showMessage('...', 'error');
        }
      } catch (error) {
        console.error('[Message App] Удалитьerror:', error);
        this.showMessage(`Удалить...: ${error.message}`, 'error');
      }
    }

    // ОбновитьУдалить/* Список */
    refreshDeleteGroupList() {
      if (this.currentView === 'addFriend' && this.currentTab === 'deleteGroup') {
        this.updateAppContent();
      }
    }

    // Статус
    toggleToolsFloatingPanel() {
      const sendTools = document.querySelector('.send-tools');

      if (!sendTools) {
        console.warn('[Message App] error');
        return;
      }

      // Статус
      if (sendTools.style.display === 'none') {
        sendTools.style.display = 'flex';
        console.log('[Message App] ...');
      } else {
        sendTools.style.display = 'none';
        console.log('[Message App] ...');
      }
    }

    debugToolToggleButton() {
      console.log('[Message App Debug] ...Статус:');
      console.log('  - ...:', this.currentView);
      console.log('  - ...ДрузьяID:', this.currentFriendId);

      const toggleBtn = document.querySelector('#detail-tool-toggle-btn');
      console.log('  - ...:', !!toggleBtn);

      if (toggleBtn) {
        console.log('  - ...:', toggleBtn.style.display !== 'none');
        console.log('  - ...:', toggleBtn.textContent);
        console.log('  - ...:', toggleBtn.getBoundingClientRect());
      }

      const sendTools = document.querySelector('.send-tools');
      console.log('  - ...:', !!sendTools);

      if (sendTools) {
        console.log('  - ...:', sendTools.style.display !== 'none');
      }

      const sendInputContainer = document.querySelector('.send-input-container');
      console.log('  - ...:', !!sendInputContainer);

      if (sendInputContainer) {
        console.log('  - ...:', sendInputContainer.querySelectorAll('button').length);
        const buttons = sendInputContainer.querySelectorAll('button');
        buttons.forEach((btn, index) => {
          console.log(`    ...${index + 1}: ${btn.className} - ${btn.textContent}`);
        });
      }
    }

    // ОбновитьСообщения/* Страница деталей */
    forceRefreshMessageDetailPage() {
      console.log('[Message App] 🔄 ...ОбновитьСообщения/* Страница деталей */...');

      if (this.currentView !== 'messageDetail' || !this.currentFriendId) {
        console.warn('[Message App] errorСообщения/* Страница деталей */');
        return;
      }

      // Сообщения
      setTimeout(() => {
        this.loadMessageDetailAsync();
      }, 100);

      console.log('[Message App] ✅ ...Обновить');
    }

    /**
     * ...
     */
    cleanup() {
      try {
        if (this.isEventListening && this.eventSource && this.event_types) {
          if (typeof this.eventSource.off === 'function') {
            this.eventSource.off(this.event_types.MESSAGE_RECEIVED, this.onMessageReceived);
            console.log('[Message App] ...');
          }
        }

        if (this.pollingInterval) {
          clearInterval(this.pollingInterval);
          this.pollingInterval = null;
        }

        // Отмена
        this.cancelDelayedRender();

        this.isEventListening = false;
      } catch (error) {
        console.error('[Message App] error:', error);
      }
    }

    // thinking
    debugThinkingTagsFunction(testText) {
      console.log('[Message App Debug] 🧠 ...thinking...');

      const sampleText =
        testText ||
        `
...1 [ДругId|...|123456]
<thinking>
...，...Друзья：[ДругId|...|789012]
...：[...|...|555|...、...]
</thinking>
...2 [...|...|888|...、...]
<think>
...：[ДругId|...|333444]
</think>
... [ДругId|...|666777]
        `;

      console.log('...:', sampleText);
      console.log('');

      // thinking
      const textWithoutThinking = this.removeThinkingTags(sampleText);
      console.log('...thinking...:', textWithoutThinking);
      console.log('');

      // Друзья
      const friendRegex = /\[Друзьяid\|([^|]+)\|([^|]+)\]/g;
      console.log('Друзья...（...）:');
      let match;
      friendRegex.lastIndex = 0;
      while ((match = friendRegex.exec(sampleText)) !== null) {
        const start = match.index;
        const end = match.index + match[0].length;
        const isInThinking = this.isPatternInsideThinkingTags(sampleText, start, end);
        console.log(`  - ${match[0]} (...${start}-${end}) ...thinking...: ${isInThinking}`);
      }
      console.log('');

      // thinkingДрузья
      const cleanedText = this.removePatternOutsideThinkingTags(sampleText, /\[Друзьяid\|([^|]+)\|([^|]+)\]/g);
      console.log('...thinking...Друзья...:', cleanedText);
      console.log('');

      const groupRegex = /\[...\|([^|]+)\|([^|]+)\|([^\]]+)\]/g;
      console.log('...（...）:');
      groupRegex.lastIndex = 0;
      while ((match = groupRegex.exec(sampleText)) !== null) {
        const start = match.index;
        const end = match.index + match[0].length;
        const isInThinking = this.isPatternInsideThinkingTags(sampleText, start, end);
        console.log(`  - ${match[0]} (...${start}-${end}) ...thinking...: ${isInThinking}`);
      }

      const cleanedText2 = this.removePatternOutsideThinkingTags(cleanedText, /\[...\|([^|]+)\|([^|]+)\|([^\]]+)\]/g);
      console.log('...thinking...:', cleanedText2);

      return {
        original: sampleText,
        withoutThinking: textWithoutThinking,
        afterFriendRemoval: cleanedText,
        afterGroupRemoval: cleanedText2,
      };
    }

    // Друзьяthinking
    debugFriendRendererThinking() {
      console.log('[Message App Debug] 🔍 ...Друзья...thinking...');

      // Друзья
      if (!window.friendRenderer) {
        console.warn('❌ Друзьяerror');
        return {
          error: 'Друзья...',
        };
      }

      console.log('✅ Друзья...');

      // Друзьяthinking
      const hasRemoveThinking = typeof window.friendRenderer.removeThinkingTags === 'function';
      const hasPatternOutside = typeof window.friendRenderer.removePatternOutsideThinkingTags === 'function';

      console.log('Друзья...:');
      console.log('  - removeThinkingTags...:', hasRemoveThinking ? '✅ ...' : '❌ ...');
      console.log('  - removePatternOutsideThinkingTags...:', hasPatternOutside ? '✅ ...' : '❌ ...');

      // Друзья/* Список */
      let extractedFriends = [];
      try {
        if (typeof window.friendRenderer.extractFriendsFromContext === 'function') {
          extractedFriends = window.friendRenderer.extractFriendsFromContext();
          console.log(`...Друзья...: ${extractedFriends.length}`);

          // 5Друзья
          extractedFriends.slice(0, 5).forEach((friend, index) => {
            console.log(`Друзья ${index + 1}:`, {
              name: friend.name,
              number: friend.number,
              source: friend.source || '...',
            });
          });
        }
      } catch (error) {
        console.error('❌ errorДрузья/* Список */error:', error);
      }

      if (!hasRemoveThinking || !hasPatternOutside) {
        console.log('');
        console.log('🔧 ...:');
        console.log('...Друзья...thinking...。');
        console.log('...MessageApp...thinking...Друзья...。');

        if (
          window.friendRenderer.addThinkingTagSupport &&
          typeof window.friendRenderer.addThinkingTagSupport === 'function'
        ) {
          console.log('');
          console.log('🚀 ......');
          try {
            // MessageAppthinkingДрузья
            window.friendRenderer.removeThinkingTags = this.removeThinkingTags.bind(this);
            window.friendRenderer.isPatternInsideThinkingTags = this.isPatternInsideThinkingTags.bind(this);
            window.friendRenderer.removePatternOutsideThinkingTags = this.removePatternOutsideThinkingTags.bind(this);

            console.log('✅ ...thinking...Друзья...');

            if (typeof window.friendRenderer.refresh === 'function') {
              window.friendRenderer.refresh();
              console.log('✅ ...Друзья...Обновить');
            }
          } catch (error) {
            console.error('❌ error:', error);
          }
        }
      }

      return {
        hasThinkingSupport: hasRemoveThinking && hasPatternOutside,
        friendCount: extractedFriends.length,
        friends: extractedFriends.slice(0, 3), // Назад...3...Друзья...
        canAutoFix: typeof window.friendRenderer.addThinkingTagSupport === 'function',
      };
    }

    // thinking
    removeThinkingTags(text) {
      if (!text || typeof text !== 'string') {
        return text;
      }

      // <think>...</think> <thinking>...</thinking>
      const thinkingTagRegex = /<think>[\s\S]*?<\/think>|<thinking>[\s\S]*?<\/thinking>/gi;
      return text.replace(thinkingTagRegex, '');
    }

    // thinking
    isPatternInsideThinkingTags(text, patternStart, patternEnd) {
      if (!text || typeof text !== 'string') {
        return false;
      }

      const thinkingTagRegex = /<think>[\s\S]*?<\/think>|<thinking>[\s\S]*?<\/thinking>/gi;
      let match;

      while ((match = thinkingTagRegex.exec(text)) !== null) {
        const thinkStart = match.index;
        const thinkEnd = match.index + match[0].length;

        // thinking
        if (patternStart >= thinkStart && patternEnd <= thinkEnd) {
          return true;
        }
      }

      return false;
    }

    // thinking
    removePatternOutsideThinkingTags(text, pattern) {
      if (!text || typeof text !== 'string') {
        return text;
      }

      // ，lastIndex
      const newPattern = new RegExp(pattern.source, pattern.flags);
      let result = text;
      const replacements = [];
      let match;

      while ((match = newPattern.exec(text)) !== null) {
        const matchStart = match.index;
        const matchEnd = match.index + match[0].length;

        // thinking
        if (!this.isPatternInsideThinkingTags(text, matchStart, matchEnd)) {
          replacements.push({
            start: matchStart,
            end: matchEnd,
            text: match[0],
          });
        }
      }

      // ，
      replacements.reverse().forEach(replacement => {
        result = result.substring(0, replacement.start) + result.substring(replacement.end);
      });

      return result;
    }
  }

  window.MessageApp = MessageApp;

  // mobile-phone.js
  window.getMessageAppContent = function () {
    console.log('[Message App] .../* Приложение */...');

    if (!window.messageApp) {
      console.log('[Message App] ...');
      window.messageApp = new MessageApp();
    }

    if (!window.messageApp || window.messageApp.currentView === undefined) {
      console.log('[Message App] ...，Назад/* Заглушка загрузки */');
      return `
            <div class="messages-app">
                <div class="loading-placeholder">
                    <div class="loading-icon">⏳</div>
                    <div class="loading-text">...Сообщения/* Приложение */...</div>
                </div>
            </div>
        `;
    }

    // currentView
    if (!['list', 'addFriend', 'messageDetail'].includes(window.messageApp.currentView)) {
      console.log('[Message App] ...currentView...list');
      window.messageApp.currentView = 'list';
    }

    const content = window.messageApp.getAppContent();
    console.log('[Message App] Назад...，...:', content.length, '...:', window.messageApp.currentView);
    return content;
  };

  window.bindMessageAppEvents = function () {
    console.log('[Message App] .../* Приложение */...');
    if (window.messageApp) {
      window.messageApp.bindEvents();
      console.log('[Message App] ...');
    } else {
      console.warn('[Message App] /* Приложение */error');
    }
  };

  console.log('[Message App] .../* Приложение */...');
} // ... if (typeof window.MessageApp === 'undefined') ...
