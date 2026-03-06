/**
 * Watch Live App - ...Стрим/* Приложение */
 * ...live-app.js...，...mobile-phone.js...Стрим...
 * ...SillyTavern...，...Стрим...，...Донаты...
 */

// @ts-nocheck
if (typeof window.RuApp_twitch_live === 'undefined') {
  /**
   * Стрим...
   * ...SillyTavern...Сообщения...
   */
  class LiveEventListener {
    constructor(liveApp) {
      this.liveApp = liveApp;
      this.isListening = false;
      this.lastMessageCount = 0;
      this.pollingInterval = null;
      this.messageReceivedHandler = this.onMessageReceived.bind(this);
    }

    /**
     * ...SillyTavern...
     */
    startListening() {
      if (this.isListening) {
        console.log('[Twitch Live] ...');
        return;
      }

      try {
        // SillyTavern
        console.log('[Twitch Live] ...SillyTavern...:', {
          'window.SillyTavern': !!window?.SillyTavern,
          'window.SillyTavern.getContext': typeof window?.SillyTavern?.getContext,
          eventOn: typeof eventOn,
          tavern_events: typeof tavern_events,
          mobileContextEditor: !!window?.mobileContextEditor,
        });

        // 1: SillyTavern.getContext().eventSource（iframeРекомендации）
        if (
          typeof window !== 'undefined' &&
          window.SillyTavern &&
          typeof window.SillyTavern.getContext === 'function'
        ) {
          const context = window.SillyTavern.getContext();
          if (context && context.eventSource && typeof context.eventSource.on === 'function' && context.event_types) {
            console.log('[Twitch Live] ...SillyTavern.getContext().eventSource...MESSAGE_RECEIVED...');
            context.eventSource.on(context.event_types.MESSAGE_RECEIVED, this.messageReceivedHandler);
            this.isListening = true;
            console.log('[Twitch Live] ✅ ...SillyTavernСообщения... (context.eventSource)');
            this.updateMessageCount();
            return;
          }
        }

        // 2: eventOn（）
        if (typeof eventOn === 'function' && typeof tavern_events !== 'undefined' && tavern_events.MESSAGE_RECEIVED) {
          console.log('[Twitch Live] ...eventOn...MESSAGE_RECEIVED...');
          eventOn(tavern_events.MESSAGE_RECEIVED, this.messageReceivedHandler);
          this.isListening = true;
          console.log('[Twitch Live] ✅ ...SillyTavernСообщения... (eventOn)');
          this.updateMessageCount();
          return;
        }

        // 3: eventSource
        if (
          typeof window !== 'undefined' &&
          window.parent &&
          window.parent.eventSource &&
          typeof window.parent.eventSource.on === 'function'
        ) {
          console.log('[Twitch Live] ...eventSource...MESSAGE_RECEIVED...');
          if (window.parent.event_types && window.parent.event_types.MESSAGE_RECEIVED) {
            window.parent.eventSource.on(window.parent.event_types.MESSAGE_RECEIVED, this.messageReceivedHandler);
            this.isListening = true;
            console.log('[Twitch Live] ✅ ...SillyTavernСообщения... (parent eventSource)');
            this.updateMessageCount();
            return;
          }
        }

        // Если，
        console.warn('[Twitch Live] errorНастройкиerror，error');
        this.startPolling();
      } catch (error) {
        console.error('[Twitch Live] Настройкиerror:', error);
        this.startPolling();
      }
    }

    /**
     * ...
     */
    stopListening() {
      if (!this.isListening) return;

      try {
        if (
          typeof window !== 'undefined' &&
          window.SillyTavern &&
          typeof window.SillyTavern.getContext === 'function'
        ) {
          const context = window.SillyTavern.getContext();
          if (context && context.eventSource && typeof context.eventSource.off === 'function' && context.event_types) {
            context.eventSource.off(context.event_types.MESSAGE_RECEIVED, this.messageReceivedHandler);
          }
        }

        if (this.pollingInterval) {
          clearInterval(this.pollingInterval);
          this.pollingInterval = null;
        }

        this.isListening = false;
        console.log('[Twitch Live] ...SillyTavern...');
      } catch (error) {
        console.error('[Twitch Live] error:', error);
      }
    }

    /**
     * ...
     */
    startPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
      }

      this.updateMessageCount();
      this.pollingInterval = setInterval(() => {
        this.checkForNewMessages();
      }, 2000); // ...2...

      this.isListening = true;
      console.log('[Twitch Live] ✅ ...');
    }

    /**
     * ...Сообщения
     */
    checkForNewMessages() {
      const currentMessageCount = this.getCurrentMessageCount();
      if (currentMessageCount > this.lastMessageCount) {
        console.log(`[Twitch Live] ...Сообщения: ${this.lastMessageCount} → ${currentMessageCount}`);
        this.onMessageReceived(currentMessageCount);
      }
    }

    /**
     * ...AIСообщения...
     * @param {number} messageId - ...СообщенияID
     */
    async onMessageReceived(messageId) {
      try {
        console.log(`[Watch Live App] 🎯 ...AIСообщения...，ID: ${messageId}`);

        // Сообщения
        const currentMessageCount = this.getCurrentMessageCount();
        console.log(`[Watch Live App] Сообщения...: ...=${currentMessageCount}, ...=${this.lastMessageCount}`);

        if (currentMessageCount <= this.lastMessageCount) {
          console.log('[Watch Live App] ...Сообщения，...');
          return;
        }

        console.log(
          `[Watch Live App] ✅ ...Сообщения，Сообщения... ${this.lastMessageCount} ... ${currentMessageCount}`,
        );
        this.lastMessageCount = currentMessageCount;

        // ЕслиСтрим/* Список */
        if (this.liveApp.isWaitingForLiveList) {
          console.log('[Watch Live App] ...Стрим/* Список */Ответить，.../* Список */');
          this.liveApp.isWaitingForLiveList = false;
          this.liveApp.updateAppContent();
          return;
        }

        // Стрим
        if (!this.liveApp || !this.liveApp.isLiveActive) {
          console.log('[Watch Live App] Стрим...，...');
          return;
        }

        console.log('[Watch Live App] ...Стрим......');
        await this.liveApp.parseNewLiveData();
      } catch (error) {
        console.error('[Watch Live App] errorСообщенияerror:', error);
      }
    }

    /**
     * ...Сообщения...
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
            console.log(`[Twitch Live] ...SillyTavern.getContext().chat... ${count} ...Сообщения`);
            return count;
          }
        }

        // 2: mobileContextEditor
        const mobileContextEditor = window['mobileContextEditor'];
        if (mobileContextEditor && typeof mobileContextEditor.getCurrentChatData === 'function') {
          const chatData = mobileContextEditor.getCurrentChatData();
          if (chatData && chatData.messages && Array.isArray(chatData.messages)) {
            console.log(`[Twitch Live] ...mobileContextEditor... ${chatData.messages.length} ...Сообщения`);
            return chatData.messages.length;
          }
        }

        // 3: chat
        if (typeof window !== 'undefined' && window.parent && window.parent.chat && Array.isArray(window.parent.chat)) {
          const count = window.parent.chat.length;
          console.log(`[Twitch Live] ...chat... ${count} ...Сообщения`);
          return count;
        }

        // 4: getContext()（）
        if (typeof window !== 'undefined' && window.getContext && typeof window.getContext === 'function') {
          const context = window.getContext();
          if (context && context.chat && Array.isArray(context.chat)) {
            const count = context.chat.length;
            console.log(`[Twitch Live] ...getContext()... ${count} ...Сообщения`);
            return count;
          }
        }

        console.warn('[Twitch Live] errorОтменитьerror，error0');
        return 0;
      } catch (error) {
        console.warn('[Twitch Live] errorОтменитьerror:', error);
        return 0;
      }
    }

    /**
     * ...Сообщения...
     */
    updateMessageCount() {
      this.lastMessageCount = this.getCurrentMessageCount();
      console.log(`[Twitch Live] ...Сообщения...: ${this.lastMessageCount}`);
    }
  }

  /**
   * Стрим...
   * ...SillyTavernСообщения...Стрим...
   */
  class LiveDataParser {
    constructor() {
      this.patterns = {
        viewerCount: /\[Стрим\|...\|([^\]]+)\]/g,
        liveContent: /\[Стрим\|Стрим...\|([^\]]+)\]/g,
        normalDanmaku: /\[Стрим\|([^\|]+)\|Донаты\|([^\]]+)\]/g,
        giftDanmaku: /\[Стрим\|([^\|]+)\|...\|([^\]]+)\]/g,
        recommendedInteraction: /\[Стрим\|Рекомендации...\|([^\]]+)\]/g,
      };
    }

    /**
     * ...Стрим...
     * @param {string} content - ...
     * @returns {Object} ...Стрим...
     */
    parseLiveData(content) {
      const liveData = {
        viewerCount: 0,
        liveContent: '',
        danmakuList: [],
        giftList: [],
        recommendedInteractions: [],
      };

      if (!content || typeof content !== 'string') {
        return liveData;
      }

      // 1. Стрим
      liveData.viewerCount = this.parseViewerCount(content);

      // 2. Стрим
      liveData.liveContent = this.parseLiveContent(content);

      // 3. Донаты（）
      const { danmakuList, giftList } = this.parseAllDanmaku(content);
      liveData.danmakuList = danmakuList;
      liveData.giftList = giftList;

      // 5. Рекомендации
      liveData.recommendedInteractions = this.parseRecommendedInteractions(content);

      return liveData;
    }

    /**
     * ...Стрим...
     */
    parseViewerCount(content) {
      const matches = [...content.matchAll(this.patterns.viewerCount)];
      if (matches.length === 0) return 0;

      // （Новое）
      const lastMatch = matches[matches.length - 1];
      const viewerStr = lastMatch[1].trim();

      return this.formatViewerCount(viewerStr);
    }

    /**
     * ...Зрителей
     */
    formatViewerCount(viewerStr) {
      // ，
      const cleanStr = viewerStr.replace(/[^\d\w]/g, '');

      const num = parseInt(cleanStr);
      if (isNaN(num)) return 0;

      if (num >= 10000) {
        return (num / 10000).toFixed(1) + 'W';
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      }

      return num.toString();
    }

    /**
     * ...Стрим...
     */
    parseLiveContent(content) {
      const matches = [...content.matchAll(this.patterns.liveContent)];
      if (matches.length === 0) return '';

      // （Новое）
      const lastMatch = matches[matches.length - 1];
      return lastMatch[1].trim();
    }

    /**
     * ...Донаты（...）
     */
    parseAllDanmaku(content) {
      const danmakuList = [];
      const giftList = [];
      const allMatches = [];

      // Донаты
      const normalMatches = [...content.matchAll(this.patterns.normalDanmaku)];
      normalMatches.forEach(match => {
        allMatches.push({
          type: 'normal',
          match: match,
          index: match.index, // ...
        });
      });

      // ПодаркиДонаты
      const giftMatches = [...content.matchAll(this.patterns.giftDanmaku)];
      giftMatches.forEach(match => {
        allMatches.push({
          type: 'gift',
          match: match,
          index: match.index, // ...
        });
      });

      // ，
      allMatches.sort((a, b) => a.index - b.index);

      // Донаты
      allMatches.forEach((item, index) => {
        const match = item.match;
        const username = match[1].trim();
        const content = match[2].trim();
        const timestamp = new Date().toLocaleString();

        if (item.type === 'normal') {
          // Донаты
          danmakuList.push({
            id: Date.now() + index,
            username: username,
            content: content,
            type: 'normal',
            timestamp: timestamp,
          });
        } else if (item.type === 'gift') {
          // ПодаркиДонаты
          danmakuList.push({
            id: Date.now() + index + 10000, // ...ID...
            username: username,
            content: content,
            type: 'gift',
            timestamp: timestamp,
          });

          // Подарки/* Список */
          giftList.push({
            username: username,
            gift: content,
            timestamp: timestamp,
          });
        }
      });

      return { danmakuList, giftList };
    }

    /**
     * ...Донаты（...）
     */
    parseNormalDanmaku(content) {
      const danmakuList = [];
      const matches = [...content.matchAll(this.patterns.normalDanmaku)];

      matches.forEach((match, index) => {
        const username = match[1].trim();
        const danmakuContent = match[2].trim();

        danmakuList.push({
          id: Date.now() + index,
          username: username,
          content: danmakuContent,
          type: 'normal',
          timestamp: new Date().toLocaleString(),
        });
      });

      return danmakuList;
    }

    /**
     * ...Донаты
     */
    parseGiftDanmaku(content) {
      const danmakuList = [];
      const giftList = [];
      const matches = [...content.matchAll(this.patterns.giftDanmaku)];

      matches.forEach((match, index) => {
        const username = match[1].trim();
        const giftContent = match[2].trim();
        const timestamp = new Date().toLocaleString();

        // Донаты/* Список */
        danmakuList.push({
          id: Date.now() + index + 10000, // ...ID...
          username: username,
          content: giftContent,
          type: 'gift',
          timestamp: timestamp,
        });

        // Подарки/* Список */
        giftList.push({
          username: username,
          gift: giftContent,
          timestamp: timestamp,
        });
      });

      return { danmakuList, giftList };
    }

    /**
     * ...Рекомендации...
     */
    parseRecommendedInteractions(content) {
      const interactions = [];
      const matches = [...content.matchAll(this.patterns.recommendedInteraction)];

      console.log(`[Twitch Live] Рекомендации...: ... ${matches.length} ...`);

      // 4（НовоеРекомендации）
      const recentMatches = matches.slice(-4);
      console.log(`[Twitch Live] ...Новое... ${recentMatches.length} ...Рекомендации...`);

      recentMatches.forEach((match, index) => {
        const interactionContent = match[1].trim();
        console.log(`[Twitch Live] Рекомендации... ${index + 1}: "${interactionContent}"`);
        if (!interactions.includes(interactionContent)) {
          interactions.push(interactionContent);
        }
      });

      console.log(`[Twitch Live] ...Рекомендации.../* Список */:`, interactions);
      return interactions;
    }

    /**
     * ...Сообщения...
     */
    getChatContent() {
      try {
        // 1: SillyTavern.getContext().chat（）
        if (
          typeof window !== 'undefined' &&
          window.SillyTavern &&
          typeof window.SillyTavern.getContext === 'function'
        ) {
          const context = window.SillyTavern.getContext();
          if (context && context.chat && Array.isArray(context.chat)) {
            const messages = context.chat;
            if (messages && messages.length > 0) {
              const content = messages.map(msg => msg.mes || '').join('\n');
              console.log(`[Twitch Live] ...SillyTavern.getContext().chat...，...: ${content.length}`);
              return content;
            }
          }
        }

        // 2: mobileContextEditor
        const mobileContextEditor = window['mobileContextEditor'];
        if (mobileContextEditor && typeof mobileContextEditor.getCurrentChatData === 'function') {
          const chatData = mobileContextEditor.getCurrentChatData();
          if (chatData && chatData.messages && Array.isArray(chatData.messages)) {
            const content = chatData.messages.map(msg => msg.mes || '').join('\n');
            console.log(`[Twitch Live] ...mobileContextEditor...，...: ${content.length}`);
            return content;
          }
        }

        // 3: chat
        if (typeof window !== 'undefined' && window.parent && window.parent.chat && Array.isArray(window.parent.chat)) {
          const messages = window.parent.chat;
          if (messages && messages.length > 0) {
            const content = messages.map(msg => msg.mes || '').join('\n');
            console.log(`[Twitch Live] ...chat...，...: ${content.length}`);
            return content;
          }
        }

        // 4: getContext()（）
        if (typeof window !== 'undefined' && window.getContext && typeof window.getContext === 'function') {
          const context = window.getContext();
          if (context && context.chat && Array.isArray(context.chat)) {
            const messages = context.chat;
            if (messages && messages.length > 0) {
              const content = messages.map(msg => msg.mes || '').join('\n');
              console.log(`[Twitch Live] ...getContext()...，...: ${content.length}`);
              return content;
            }
          }
        }

        console.warn('[Twitch Live] error');
        return '';
      } catch (error) {
        console.warn('[Twitch Live] error:', error);
        return '';
      }
    }
  }

  /**
   * СтримСтатус...
   * ...СтримСтатус...
   */
  class LiveStateManager {
    constructor() {
      this.isLiveActive = false;
      this.currentViewerCount = 0;
      this.currentLiveContent = '';
      this.danmakuList = [];
      this.giftList = [];
      this.recommendedInteractions = [];
      // Донаты，Донаты
    }

    /**
     * ...Стрим
     */
    startLive() {
      this.isLiveActive = true;
      this.currentViewerCount = 0;
      this.currentLiveContent = '';
      this.danmakuList = [];
      this.giftList = [];
      this.recommendedInteractions = [];
      console.log('[Twitch Live] СтримСтатус...');
    }

    /**
     * ...Стрим
     */
    endLive() {
      this.isLiveActive = false;
      console.log('[Twitch Live] СтримСтатус...');
    }

    /**
     * ...Стрим...
     * @param {Object} liveData - ...Стрим...
     */
    updateLiveData(liveData) {
      if (!this.isLiveActive) return;

      // Зрителей（Новое）
      if (liveData.viewerCount !== undefined && liveData.viewerCount !== 0) {
        this.currentViewerCount = liveData.viewerCount;
        console.log(`[Twitch Live] ...Зрителей: ${this.currentViewerCount}`);
      }

      // Стрим（Новое）
      if (liveData.liveContent && liveData.liveContent.trim() !== '') {
        this.currentLiveContent = liveData.liveContent;
        console.log(`[Twitch Live] ...Стрим...: ${this.currentLiveContent.substring(0, 50)}...`);
      }

      // Рекомендации（Новое）
      if (liveData.recommendedInteractions && liveData.recommendedInteractions.length > 0) {
        this.recommendedInteractions = liveData.recommendedInteractions;
        console.log(`[Twitch Live] ...Рекомендации...: ${this.recommendedInteractions.length} ...`);
      }

      // Донаты（Донаты）
      if (liveData.danmakuList && liveData.danmakuList.length > 0) {
        // Донаты（Пользователь）
        const newDanmaku = liveData.danmakuList.filter(newItem => {
          return !this.danmakuList.some(
            existingItem =>
              existingItem.username === newItem.username &&
              existingItem.content === newItem.content &&
              existingItem.type === newItem.type,
          );
        });

        if (newDanmaku.length > 0) {
          this.danmakuList = this.danmakuList.concat(newDanmaku);
          console.log(`[Watch Live App] ... ${newDanmaku.length} ...Донаты，... ${this.danmakuList.length} ...`);

          // Донаты，Донаты
          console.log(`[Watch Live App] ...Донаты，...: ${this.danmakuList.length}`);
        }
      }

      // Подарки（Подарки）
      if (liveData.giftList && liveData.giftList.length > 0) {
        // Подарки
        const newGifts = liveData.giftList.filter(newGift => {
          return !this.giftList.some(
            existingGift =>
              existingGift.username === newGift.username &&
              existingGift.gift === newGift.gift &&
              existingGift.timestamp === newGift.timestamp,
          );
        });

        if (newGifts.length > 0) {
          this.giftList = this.giftList.concat(newGifts);
          console.log(`[Twitch Live] ... ${newGifts.length} ...Подарки，... ${this.giftList.length} ...`);
        }
      }
    }

    /**
     * ...СтримСтатус
     */
    getCurrentState() {
      return {
        isLiveActive: this.isLiveActive,
        viewerCount: this.currentViewerCount,
        liveContent: this.currentLiveContent,
        danmakuList: [...this.danmakuList], // Назад...
        giftList: [...this.giftList], // Назад...
        recommendedInteractions: [...this.recommendedInteractions], // Назад...
      };
    }

    /**
     * ...
     */
    clearAllData() {
      this.currentViewerCount = 0;
      this.currentLiveContent = '';
      this.danmakuList = [];
      this.giftList = [];
      this.recommendedInteractions = [];
      console.log('[Twitch Live] ...Стрим...');
    }
  }

  /**
   * ...Стрим/* Приложение */...
   * ...，...
   */
  class RuApp_twitch_live {
    constructor() {
      this.eventListener = new LiveEventListener(this);
      this.dataParser = new LiveDataParser();
      this.stateManager = new LiveStateManager();
      this.currentView = 'start'; // 'start', 'live'
      this.isInitialized = false;
      this.lastRenderTime = 0;
      this.renderCooldown = 500; // ...Время
      this.scrollTimeout = null; // ...
      this.typingTimer = null; // Стрим...
      this.isTyping = false; // ...
      this.pendingAppearDanmakuSigs = new Set(); // ...ДонатыПодпись
      this.pendingAppearGiftSigs = new Set(); // ...ПодаркиПодпись
      this.saveTimeout = null;
      this.saveDebounceMs = 2000; // 2...

      this.init();
    }

    /**
     * .../* Приложение */
     */
    init() {
      console.log('[Watch Live App] ...Стрим/* Приложение */...');

      // Статус
      const renderingRight = this.getRenderingRight();
      console.log('[Watch Live App] ...Статус:', renderingRight);

      // Еслиwatchend，
      if (renderingRight && renderingRight !== 'watch' && renderingRight !== 'end') {
        console.log('[Watch Live App] ...，...');
        this.isInitialized = true;
        return;
      }

      // Стрим
      this.detectActiveLive();

      this.isInitialized = true;
      console.log('[Watch Live App] ...Стрим/* Приложение */...');
    }

    /**
     * ...Стрим...
     */
    detectActiveLive() {
      try {
        console.log('[Watch Live App] ...Стрим......');

        const renderingRight = this.getRenderingRight();
        if (renderingRight && renderingRight !== 'watch' && renderingRight !== 'end') {
          console.log(`[Watch Live App] ...${renderingRight}...，...`);
          return;
        }

        const chatContent = this.dataParser.getChatContent();
        if (!chatContent) {
          console.log('[Watch Live App] ...，...СтримСтатус');
          return;
        }

        // Стрим（）
        const hasActiveLive = this.hasActiveLiveFormats(chatContent);

        if (hasActiveLive && renderingRight === 'watch') {
          console.log('[Watch Live App] 🎯 ...Стрим...，...СтримСтатус');

          // НастройкиСтримСтатус
          this.stateManager.startLive();
          this.currentView = 'live';

          // Стрим
          const liveData = this.dataParser.parseLiveData(chatContent);
          this.stateManager.updateLiveData(liveData);

          // Сообщения
          this.eventListener.startListening();

          console.log('[Watch Live App] ✅ ...СтримСтатус，...:', {
            viewerCount: this.stateManager.currentViewerCount,
            liveContent: this.stateManager.currentLiveContent
              ? this.stateManager.currentLiveContent.substring(0, 50) + '...'
              : '',
            danmakuCount: this.stateManager.danmakuList.length,
            giftCount: this.stateManager.giftList.length,
            interactionCount: this.stateManager.recommendedInteractions.length,
          });
        } else {
          console.log('[Watch Live App] ...Стрим...，...Стрим...Статус');
        }
      } catch (error) {
        console.error('[Watch Live App] errorСтримerror:', error);
      }
    }

    /**
     * ...Стрим...
     */
    hasActiveLiveFormats(content) {
      if (!content || typeof content !== 'string') {
        return false;
      }

      // Стрим（）
      const activeLivePatterns = [
        /\[Стрим\|...\|[^\]]+\]/,
        /\[Стрим\|Стрим...\|[^\]]+\]/,
        /\[Стрим\|[^|]+\|Донаты\|[^\]]+\]/,
        /\[Стрим\|[^|]+\|(?:...|Подарки)\|[^\]]+\]/,
        /\[Стрим\|Рекомендации...\|[^\]]+\]/,
      ];

      for (const pattern of activeLivePatterns) {
        if (pattern.test(content)) {
          console.log('[Twitch Live] ...Стрим...:', pattern.toString());
          return true;
        }
      }

      return false;
    }

    /**
     * ...СтримСтатус
     */
    get isLiveActive() {
      return this.stateManager.isLiveActive;
    }

    /**
     * ...Стрим
     */
    async endLive() {
      try {
        console.log('[Watch Live App] ...Стрим');

        // Настройкиend，Пользователь
        await this.setRenderingRight('end');

        this.eventListener.stopListening();

        // Донаты
        await this.convertLiveToHistory();

        // Статус，Статус
        this.stateManager.endLive();
        this.stateManager.clearAllData(); // ...
        this.currentView = 'start';

        // Статус
        this.isInitialized = false; // ...Статус
        this.lastRenderTime = 0;

        if (this.scrollTimeout) {
          clearTimeout(this.scrollTimeout);
          this.scrollTimeout = null;
        }
        if (this.typingTimer) {
          clearInterval(this.typingTimer);
          this.typingTimer = null;
        }

        this.updateAppContent();

        this.showToast('...Стрим', 'success');
        console.log('[Watch Live App] ...Стрим，Статус...');
      } catch (error) {
        console.error('[Watch Live App] errorСтримerror:', error);
        this.showToast('...Стрим...: ' + error.message, 'error');
      }
    }

    /**
     * ...Стрим...
     * @param {string} interaction - ...
     */
    async continueInteraction(interaction) {
      try {
        console.log('[Twitch Live] ...Стрим...:', interaction);

        if (!this.isLiveActive) {
          console.warn('[Twitch Live] Стримerror，error');
          return;
        }

        // СтримСообщенияSillyTavern
        const message = `Пользователь...Стрим，...（${interaction}），...Стрим...，Стрим...，Донаты，...Рекомендации...。...Ответить...Стрим...，Стрим...。...Рекомендации...。...。`;

        await this.sendToSillyTavern(message);

        console.log('[Twitch Live] ...Сообщения...');
      } catch (error) {
        console.error('[Twitch Live] error:', error);
        this.showToast('...: ' + error.message, 'error');
      }
    }

    /**
     * ...Стрим...
     */
    async parseNewLiveData() {
      try {
        console.log('[Twitch Live] ...Стрим...');

        const chatContent = this.dataParser.getChatContent();
        if (!chatContent) {
          console.warn('[Twitch Live] error');
          return;
        }

        // ：ДонатыПодпись，""
        const existingDanmakuSigs = new Set(
          (this.stateManager.danmakuList || []).map(item => this.createDanmakuSignature(item)),
        );

        // "Новое"（）
        const latestFloorText = this.getLatestFloorTextSafe();
        let latestNewDanmaku = [];
        let latestNewGifts = [];
        if (latestFloorText) {
          const { danmakuList: latestDanmakuList, giftList: latestGiftList } =
            this.dataParser.parseAllDanmaku(latestFloorText);
          latestNewDanmaku = latestDanmakuList || [];
          latestNewGifts = latestGiftList || [];
        }

        // Стрим
        const liveData = this.dataParser.parseLiveData(chatContent);
        console.log('[Twitch Live] ...Стрим...:', {
          viewerCount: liveData.viewerCount,
          liveContent: liveData.liveContent ? liveData.liveContent.substring(0, 50) + '...' : '',
          danmakuCount: liveData.danmakuList.length,
          giftCount: liveData.giftList.length,
          interactionCount: liveData.recommendedInteractions.length,
        });

        // Статус
        this.stateManager.updateLiveData(liveData);

        // "Донаты/Подарки"（Новое）
        if (latestNewDanmaku.length > 0) {
          latestNewDanmaku.forEach(item => {
            const sig = this.createDanmakuSignature(item);
            if (!existingDanmakuSigs.has(sig)) {
              this.pendingAppearDanmakuSigs.add(sig);
            }
          });
        }

        if (latestNewGifts.length > 0) {
          const existingGiftSigs = new Set(
            (this.stateManager.giftList || []).map(item => this.createGiftSignature(item)),
          );
          latestNewGifts.forEach(item => {
            const sig = this.createGiftSignature(item);
            if (!existingGiftSigs.has(sig)) {
              this.pendingAppearGiftSigs.add(sig);
            }
          });
        }

        // （）
        this.updateAppContentDebounced();

        // Донаты，Обновить""
        setTimeout(() => {
          // Статус，
          this.runAppearSequence();
          const danmakuContainer = document.getElementById('danmaku-container');
          if (danmakuContainer) {
            this.jumpToBottomIfNeeded(danmakuContainer);
          }
        }, 30);
      } catch (error) {
        console.error('[Twitch Live] errorСтримerror:', error);
      }
    }

    /**
     * ...
     */
    updateAppContentDebounced() {
      const currentTime = Date.now();
      if (currentTime - this.lastRenderTime < this.renderCooldown) {
        return;
      }

      this.lastRenderTime = currentTime;
      this.updateAppContent();
      this.updateHeader(); // ...header
    }

    /**
     * .../* Приложение */...
     */
    updateAppContent() {
      const content = this.getAppContent();
      const appElement = document.getElementById('app-content');
      if (appElement) {
        appElement.innerHTML = content;
        // ，DOM
        setTimeout(() => {
          this.bindEvents();
          this.updateHeader(); // ...header...
          // Стрим
          if (this.currentView === 'live') {
            const state = this.stateManager.getCurrentState();
            const liveContentEl = document.querySelector('.live-content-text');
            if (liveContentEl) {
              this.applyTypingEffect(liveContentEl, state.liveContent || '');
            }
            // （）
            this.runAppearSequence();
          }
        }, 50);
      }
    }

    /**
     * .../* Приложение */...
     */
    getAppContent() {
      switch (this.currentView) {
        case 'start':
          return this.renderStartView();
        case 'list':
          return this.renderListView();
        case 'live':
          return this.renderLiveView();
        default:
          return this.renderStartView();
      }
    }

    /**
     * ...Стрим...
     */
    renderStartView() {
      return `
        <div class="live-app">
          <div class="watch-live-container">
            <div class="watch-live-header">
              <h2>...Стрим</h2>
              <p>...Стрим...！</p>
            </div>

            <div class="watch-options">
              <button class="watch-option-btn" id="current-live-list">
                <div class="option-icon">📺</div>
                <div class="option-title">.../* Список */</div>
                <div class="option-desc">...Стрим...Стример</div>
              </button>

              <button class="watch-option-btn" id="specific-live-room">
                <div class="option-icon">🔍</div>
                <div class="option-title">...Стрим</div>
                <div class="option-desc">...Стример...</div>
              </button>
            </div>
          </div>
        </div>
      `;
    }

    /**
     * ...Стрим/* Список */...
     */
    renderListView() {
      // Стрим/* Список */（，）
      const liveRooms = this.parseLiveRoomList();

      const roomsHtml = liveRooms
        .map(
          room => `
        <div class="live-room-item">
          <div class="room-info">
            <div class="room-name">${room.name}</div>
            <div class="room-details">
              <span class="streamer-name">Стример：${room.streamer}</span>
              <span class="room-category">...：${room.category}</span>
              <span class="viewer-count">...：${room.viewers}</span>
            </div>
          </div>
          <button class="watch-room-btn" data-room='${JSON.stringify(room)}'>...Стрим</button>
        </div>
      `,
        )
        .join('');

      // /* Список */
      let listContent = '';

      // ЕслиСтрим，
      if (roomsHtml) {
        listContent = roomsHtml;
      }

      // ЕслиСтрим/* Список */，
      if (this.isWaitingForLiveList) {
        const loadingHtml = `
          <div class="live-loading-update">
            <div class="loading-spinner"></div>
            <span>...ЕщёСтрим...</span>
          </div>
        `;
        listContent = listContent ? listContent + loadingHtml : '<div class="live-loading">...Стрим/* Список */...</div>';
      } else if (!roomsHtml) {
        // Если，
        listContent = '<div class="no-rooms">...Стрим...，...</div>';
      }

      return `
        <div class="live-app">
          <div class="live-list-container">
            <div class="live-list-header">
              <button class="back-btn" id="back-to-watch-options">← Назад</button>
              <h2>.../* Список */</h2>
            </div>

            <div class="live-rooms-list">
              ${listContent}
            </div>
          </div>
        </div>
      `;
    }

    /**
     * ...Стрим...
     */
    renderLiveView() {
      const state = this.stateManager.getCurrentState();

      // Рекомендации
      const recommendedButtons = state.recommendedInteractions
        .map(interaction => `<button class="rec-btn" data-interaction="${interaction}">${interaction}</button>`)
        .join('');

      // Донаты/* Список */
      const danmakuItems = state.danmakuList
        .map(danmaku => {
          const sig = this.createDanmakuSignature(danmaku);
          const needAppearClass = this.pendingAppearDanmakuSigs.has(sig) ? ' need-appear' : '';
          if (danmaku.type === 'gift') {
            return `
            <div class="danmaku-item gift${needAppearClass}" data-sig="${sig}">
              <i class="fas fa-gift"></i>
              <span class="username">${danmaku.username}</span>
              <span class="content">... ${danmaku.content}</span>
            </div>
          `;
          } else {
            return `
            <div class="danmaku-item normal${needAppearClass}" data-sig="${sig}">
              <span class="username">${danmaku.username}:</span>
              <span class="content">${danmaku.content}</span>
            </div>
          `;
          }
        })
        .join('');

      return `
        <div class="live-app">
          <div class="live-container">
            <!-- ... -->
            <div class="video-placeholder">
              <p class="live-content-text">${state.liveContent || '...Стрим......'}</p>
              <div class="live-status-bottom">
                <div class="live-dot"></div>
                <span>LIVE</span>
              </div>
            </div>

            <!-- ...Стрим... -->
            <div class="interaction-panel">
              <div class="interaction-header">
                <h4>РекомендацииДонаты：</h4>
                <div class="watch-actions">
                  <button class="interact-btn" id="send-danmaku-btn">
                    <i class="fas fa-comment"></i> ...Донаты
                  </button>
                  <button class="interact-btn" id="send-gift-btn">
                    <i class="fas fa-gift"></i> ...Подарки
                  </button>
                </div>
              </div>
              <div class="recommended-interactions">
                ${recommendedButtons || '<p class="no-interactions">...РекомендацииДонаты...</p>'}
              </div>
            </div>

            <!-- Донаты... -->
            <div class="danmaku-container" id="danmaku-container">
              <div class="danmaku-list" id="danmaku-list">
                ${danmakuItems || '<div class="no-danmaku">...Донаты...</div>'}
              </div>
            </div>
          </div>

          <!-- ...Донаты... -->
          <div id="danmaku-modal" class="modal">
            <div class="modal-content">
              <div class="modal-header">
                <h3>...Донаты</h3>
                <button class="modal-close-btn">&times;</button>
              </div>
              <form id="danmaku-form">
                <textarea id="custom-danmaku-textarea" placeholder="...Донаты......" rows="4"></textarea>
                <button type="submit" class="submit-btn">...Донаты</button>
              </form>
            </div>
          </div>

          <!-- ...Подарки... -->
          <div id="gift-send-modal" class="modal">
            <div class="gift-modal-container">
              <div class="gift-modal-header">
                <div class="gift-modal-title">✨ ...Подарки</div>
                <button class="gift-modal-close" onclick="watchLiveAppHideModal('gift-send-modal')">&times;</button>
              </div>

              <div class="gift-modal-body">
                <div class="gift-list-container">
                    <!-- ...Подарки...Цена...，... -->
                    <div class="gift-card" data-gift="..." data-price="1">
                      <div class="gift-icon">🎤</div>
                      <div class="gift-info">
                        <div class="gift-name">...</div>
                        <div class="gift-price">¥1</div>
                      </div>
                      <div class="gift-controls">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="0" min="0" max="999">
                        <button class="qty-btn plus">+</button>
                      </div>
                    </div>
                    <div class="gift-card" data-gift="..." data-price="3">
                      <div class="gift-icon">💡</div>
                      <div class="gift-info">
                        <div class="gift-name">...</div>
                        <div class="gift-price">¥3</div>
                      </div>
                      <div class="gift-controls">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="0" min="0" max="999">
                        <button class="qty-btn plus">+</button>
                      </div>
                    </div>
                    <div class="gift-card" data-gift="..." data-price="5">
                      <div class="gift-icon">💖</div>
                      <div class="gift-info">
                        <div class="gift-name">...</div>
                        <div class="gift-price">¥5</div>
                      </div>
                      <div class="gift-controls">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="0" min="0" max="999">
                        <button class="qty-btn plus">+</button>
                      </div>
                    </div>
                    <div class="gift-card" data-gift="..." data-price="6">
                      <div class="gift-icon">🎟️</div>
                      <div class="gift-info">
                        <div class="gift-name">...</div>
                        <div class="gift-price">¥6</div>
                      </div>
                      <div class="gift-controls">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="0" min="0" max="999">
                        <button class="qty-btn plus">+</button>
                      </div>
                    </div>
                    <div class="gift-card" data-gift="..." data-price="9">
                      <div class="gift-icon">🏆</div>
                      <div class="gift-info">
                        <div class="gift-name">...</div>
                        <div class="gift-price">¥9</div>
                      </div>
                      <div class="gift-controls">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="0" min="0" max="999">
                        <button class="qty-btn plus">+</button>
                      </div>
                    </div>
                    <div class="gift-card" data-gift="..." data-price="18">
                      <div class="gift-icon">💐</div>
                      <div class="gift-info">
                        <div class="gift-name">...</div>
                        <div class="gift-price">¥18</div>
                      </div>
                      <div class="gift-controls">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="0" min="0" max="999">
                        <button class="qty-btn plus">+</button>
                      </div>
                    </div>
                    <div class="gift-card" data-gift="..." data-price="28">
                      <div class="gift-icon">💌</div>
                      <div class="gift-info">
                        <div class="gift-name">...</div>
                        <div class="gift-price">¥28</div>
                      </div>
                      <div class="gift-controls">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="0" min="0" max="999">
                        <button class="qty-btn plus">+</button>
                      </div>
                    </div>
                    <div class="gift-card" data-gift=""...！"" data-price="38">
                      <div class="gift-icon">🎬</div>
                      <div class="gift-info">
                        <div class="gift-name">"...！"</div>
                        <div class="gift-price">¥38</div>
                      </div>
                      <div class="gift-controls">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="0" min="0" max="999">
                        <button class="qty-btn plus">+</button>
                      </div>
                    </div>
                    <div class="gift-card" data-gift="..." data-price="58">
                      <div class="gift-icon">🌟</div>
                      <div class="gift-info">
                        <div class="gift-name">...</div>
                        <div class="gift-price">¥58</div>
                      </div>
                      <div class="gift-controls">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="0" min="0" max="999">
                        <button class="qty-btn plus">+</button>
                      </div>
                    </div>
                    <div class="gift-card" data-gift="..." data-price="88">
                      <div class="gift-icon">💎</div>
                      <div class="gift-info">
                        <div class="gift-name">...</div>
                        <div class="gift-price">¥88</div>
                      </div>
                      <div class="gift-controls">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="0" min="0" max="999">
                        <button class="qty-btn plus">+</button>
                      </div>
                    </div>
                    <div class="gift-card" data-gift="..." data-price="128">
                      <div class="gift-icon">💄</div>
                      <div class="gift-info">
                        <div class="gift-name">...</div>
                        <div class="gift-price">¥128</div>
                      </div>
                      <div class="gift-controls">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="0" min="0" max="999">
                        <button class="qty-btn plus">+</button>
                      </div>
                    </div>
                    <div class="gift-card" data-gift="..." data-price="188">
                      <div class="gift-icon">👑</div>
                      <div class="gift-info">
                        <div class="gift-name">...</div>
                        <div class="gift-price">¥188</div>
                      </div>
                      <div class="gift-controls">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="0" min="0" max="999">
                        <button class="qty-btn plus">+</button>
                      </div>
                    </div>
                    <div class="gift-card" data-gift=""..."" data-price="288">
                      <div class="gift-icon">📸</div>
                      <div class="gift-info">
                        <div class="gift-name">"..."</div>
                        <div class="gift-price">¥288</div>
                      </div>
                      <div class="gift-controls">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="0" min="0" max="999">
                        <button class="qty-btn plus">+</button>
                      </div>
                    </div>
                    <div class="gift-card" data-gift="..." data-price="388">
                      <div class="gift-icon">🎶</div>
                      <div class="gift-info">
                        <div class="gift-name">...</div>
                        <div class="gift-price">¥388</div>
                      </div>
                      <div class="gift-controls">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="0" min="0" max="999">
                        <button class="qty-btn plus">+</button>
                      </div>
                    </div>
                    <div class="gift-card" data-gift="..." data-price="488">
                      <div class="gift-icon">🥂</div>
                      <div class="gift-info">
                        <div class="gift-name">...</div>
                        <div class="gift-price">¥488</div>
                      </div>
                      <div class="gift-controls">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="0" min="0" max="999">
                        <button class="qty-btn plus">+</button>
                      </div>
                    </div>
                    <div class="gift-card" data-gift="..." data-price="588">
                      <div class="gift-icon">🕶️</div>
                      <div class="gift-info">
                        <div class="gift-name">...</div>
                        <div class="gift-price">¥588</div>
                      </div>
                      <div class="gift-controls">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="0" min="0" max="999">
                        <button class="qty-btn plus">+</button>
                      </div>
                    </div>
                    <div class="gift-card" data-gift="..." data-price="666">
                      <div class="gift-icon">🚀</div>
                      <div class="gift-info">
                        <div class="gift-name">...</div>
                        <div class="gift-price">¥666</div>
                      </div>
                      <div class="gift-controls">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="0" min="0" max="999">
                        <button class="qty-btn plus">+</button>
                      </div>
                    </div>
                    <div class="gift-card" data-gift="..." data-price="888">
                      <div class="gift-icon">🚁</div>
                      <div class="gift-info">
                        <div class="gift-name">...</div>
                        <div class="gift-price">¥888</div>
                      </div>
                      <div class="gift-controls">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="0" min="0" max="999">
                        <button class="qty-btn plus">+</button>
                      </div>
                    </div>
                    <div class="gift-card" data-gift="..." data-price="999">
                      <div class="gift-icon">📢</div>
                      <div class="gift-info">
                        <div class="gift-name">...</div>
                        <div class="gift-price">¥999</div>
                      </div>
                      <div class="gift-controls">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="0" min="0" max="999">
                        <button class="qty-btn plus">+</button>
                      </div>
                    </div>
                    <div class="gift-card" data-gift="..." data-price="1288">
                      <div class="gift-icon">📜</div>
                      <div class="gift-info">
                        <div class="gift-name">...</div>
                        <div class="gift-price">¥1288</div>
                      </div>
                      <div class="gift-controls">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="0" min="0" max="999">
                        <button class="qty-btn plus">+</button>
                      </div>
                    </div>
                    <div class="gift-card" data-gift="..." data-price="1888">
                      <div class="gift-icon">🏰</div>
                      <div class="gift-info">
                        <div class="gift-name">...</div>
                        <div class="gift-price">¥1888</div>
                      </div>
                      <div class="gift-controls">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="0" min="0" max="999">
                        <button class="qty-btn plus">+</button>
                      </div>
                    </div>
                    <div class="gift-card" data-gift="..." data-price="2888">
                      <div class="gift-icon">🏎️</div>
                      <div class="gift-info">
                        <div class="gift-name">...</div>
                        <div class="gift-price">¥2888</div>
                      </div>
                      <div class="gift-controls">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="0" min="0" max="999">
                        <button class="qty-btn plus">+</button>
                      </div>
                    </div>
                    <div class="gift-card" data-gift="..." data-price="3888">
                      <div class="gift-icon">🌍</div>
                      <div class="gift-info">
                        <div class="gift-name">...</div>
                        <div class="gift-price">¥3888</div>
                      </div>
                      <div class="gift-controls">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="0" min="0" max="999">
                        <button class="qty-btn plus">+</button>
                      </div>
                    </div>
                    <div class="gift-card" data-gift="..." data-price="4888">
                      <div class="gift-icon">🛳️</div>
                      <div class="gift-info">
                        <div class="gift-name">...</div>
                        <div class="gift-price">¥4888</div>
                      </div>
                      <div class="gift-controls">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="0" min="0" max="999">
                        <button class="qty-btn plus">+</button>
                      </div>
                    </div>
                    <div class="gift-card" data-gift="..." data-price="5888">
                      <div class="gift-icon">🌌</div>
                      <div class="gift-info">
                        <div class="gift-name">...</div>
                        <div class="gift-price">¥5888</div>
                      </div>
                      <div class="gift-controls">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="0" min="0" max="999">
                        <button class="qty-btn plus">+</button>
                      </div>
                    </div>
                    <div class="gift-card" data-gift="..." data-price="6888">
                      <div class="gift-icon">🪐</div>
                      <div class="gift-info">
                        <div class="gift-name">...</div>
                        <div class="gift-price">¥6888</div>
                      </div>
                      <div class="gift-controls">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="0" min="0" max="999">
                        <button class="qty-btn plus">+</button>
                      </div>
                    </div>
                    <div class="gift-card" data-gift="..." data-price="7888">
                      <div class="gift-icon">✨</div>
                      <div class="gift-info">
                        <div class="gift-name">...</div>
                        <div class="gift-price">¥7888</div>
                      </div>
                      <div class="gift-controls">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="0" min="0" max="999">
                        <button class="qty-btn plus">+</button>
                      </div>
                    </div>
                    <div class="gift-card" data-gift="..." data-price="8888">
                      <div class="gift-icon">🌠</div>
                      <div class="gift-info">
                        <div class="gift-name">...</div>
                        <div class="gift-price">¥8888</div>
                      </div>
                      <div class="gift-controls">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="0" min="0" max="999">
                        <button class="qty-btn plus">+</button>
                      </div>
                    </div>
                    <div class="gift-card" data-gift="..." data-price="9999">
                      <div class="gift-icon">🔱</div>
                      <div class="gift-info">
                        <div class="gift-name">...</div>
                        <div class="gift-price">¥9999</div>
                      </div>
                      <div class="gift-controls">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="0" min="0" max="999">
                        <button class="qty-btn plus">+</button>
                      </div>
                    </div>
                    <div class="gift-card" data-gift="..." data-price="10000">
                      <div class="gift-icon">🔭</div>
                      <div class="gift-info">
                        <div class="gift-name">...</div>
                        <div class="gift-price">¥10000</div>
                      </div>
                      <div class="gift-controls">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="0" min="0" max="999">
                        <button class="qty-btn plus">+</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="gift-message-section">
                  <div class="message-label">💬 ...</div>
                  <textarea id="gift-message-input" placeholder="......"></textarea>
                </div>

                <div class="gift-summary">
                  <div class="total-amount">
                    <span class="amount-label">...</span>
                    <span class="amount-value">¥<span id="gift-total-amount">0</span></span>
                  </div>
                  <button class="send-gift-btn" id="confirm-send-gift">
                    <span class="btn-icon">🎁</span>
                    <span class="btn-text">...</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Подарки... -->
          <div id="gift-modal" class="modal">
            <div class="modal-content">
              <div class="modal-header">
                <h3>Подарки...</h3>
                <button class="modal-close-btn">&times;</button>
              </div>
              <ul class="gift-list">
                ${
                  state.giftList
                    .map(gift => {
                      const gsig = this.createGiftSignature(gift);
                      const needAppearClass = this.pendingAppearGiftSigs.has(gsig) ? ' need-appear' : '';
                      return `<li class="${needAppearClass.trim()}" data-sig="${gsig}"><span class="username">${
                        gift.username
                      }</span>... <span class="gift-name">${gift.gift}</span></li>`;
                    })
                    .join('') || '<li class="no-gifts">...Подарки</li>'
                }
              </ul>
            </div>
          </div>
        </div>
      `;
    }

    /**
     * ...
     */
    bindEvents() {
      console.log('[Twitch Live] ......');

      const appContainer = document.getElementById('app-content');
      if (!appContainer) {
        console.error('[Twitch Live] /* Приложение */error');
        return;
      }

      try {
        // Стрим
        if (this.currentView === 'start') {
          // /* Список */
          const currentLiveListBtn = appContainer.querySelector('#current-live-list');
          if (currentLiveListBtn) {
            currentLiveListBtn.addEventListener('click', () => {
              this.requestCurrentLiveList();
            });
          }

          // Стрим
          const specificLiveRoomBtn = appContainer.querySelector('#specific-live-room');
          if (specificLiveRoomBtn) {
            specificLiveRoomBtn.addEventListener('click', () => {
              this.showSpecificLiveRoomModal();
            });
          }
        }

        // Стрим/* Список */
        if (this.currentView === 'list') {
          // Назад
          const backBtn = appContainer.querySelector('#back-to-watch-options');
          if (backBtn) {
            backBtn.addEventListener('click', () => {
              // Статус
              this.eventListener.stopListening();
              this.isWaitingForLiveList = false;
              this.currentView = 'start';
              this.updateAppContent();
            });
          }

          // Стрим
          appContainer.querySelectorAll('.watch-room-btn').forEach(btn => {
            btn.addEventListener('click', () => {
              const roomData = JSON.parse(btn.dataset.room);
              this.watchSelectedRoom(roomData);
            });
          });
        }

        // Стрим
        if (this.currentView === 'live') {
          // РекомендацииДонаты
          appContainer.querySelectorAll('.rec-btn').forEach(btn => {
            btn.addEventListener('click', () => {
              const danmaku = btn.dataset.interaction;
              if (danmaku) {
                this.sendDanmaku(danmaku);
              }
            });
          });

          // Донаты
          const sendDanmakuBtn = appContainer.querySelector('#send-danmaku-btn');
          if (sendDanmakuBtn) {
            sendDanmakuBtn.addEventListener('click', () => {
              this.showModal('danmaku-modal');
            });
          }

          // Подарки
          const sendGiftBtn = appContainer.querySelector('#send-gift-btn');
          if (sendGiftBtn) {
            sendGiftBtn.addEventListener('click', () => {
              this.showModal('gift-send-modal');
              this.initGiftModal();
            });
          }

          // Донаты/* Форма */
          const danmakuForm = appContainer.querySelector('#danmaku-form');
          if (danmakuForm) {
            danmakuForm.addEventListener('submit', e => {
              e.preventDefault();
              const textarea = appContainer.querySelector('#custom-danmaku-textarea');
              const danmaku = textarea ? textarea.value.trim() : '';
              if (danmaku) {
                this.sendCustomDanmaku(danmaku);
                textarea.value = '';
                this.hideAllModals();
              } else {
                this.showToast('...Донаты...', 'warning');
              }
            });
          }

          // Подарки/* Форма */
          const giftSubmitBtn = appContainer.querySelector('#confirm-send-gift');
          if (giftSubmitBtn) {
            giftSubmitBtn.addEventListener('click', () => {
              this.sendGifts();
            });
          }

          // Закрыть
          appContainer.querySelectorAll('.modal-close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
              this.hideAllModals();
            });
          });

          // Закрыть
          appContainer.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', e => {
              if (e.target === modal) {
                this.hideAllModals();
              }
            });
          });

          // ""Донаты（、）
          const danmakuContainer = appContainer.querySelector('#danmaku-container');
          if (danmakuContainer) {
            this.jumpToBottomIfNeeded(danmakuContainer);
          }
        }

        console.log('[Twitch Live] ...');
      } catch (error) {
        console.error('[Twitch Live] error:', error);
        this.showToast('...: ' + error.message, 'error');
      }
    }

    // ；
    jumpToBottomIfNeeded(container) {
      const threshold = 10; // px...
      const distanceToBottom = container.scrollHeight - (container.scrollTop + container.clientHeight);
      if (distanceToBottom > threshold) {
        // ，
        container.scrollTop = container.scrollHeight;
      }
    }

    /**
     * .../* Список */
     */
    async requestCurrentLiveList() {
      try {
        console.log('[Watch Live App] .../* Список */...');

        // /* Список */
        this.currentView = 'list';
        this.isWaitingForLiveList = false; // ...false，...

        // Стрим/* Список */
        console.log('[Watch Live App] ...Стрим/* Список */...');
        this.updateAppContent();

        // Стрим
        const existingRooms = this.parseLiveRoomList();
        if (existingRooms.length > 0) {
          console.log(`[Watch Live App] ... ${existingRooms.length} ...Стрим，...`);
        } else {
          console.log('[Watch Live App] ...Стрим...');
        }

        // Стрим/* Список */
        const message =
          'Пользователь...Стрим，...5-10...Стрим，...Стрим...[Стрим|Стрим...|СтримерПользователь...|Стрим...|Зрителей]。Стример...，NPC...。...Стрим...';

        // НастройкиСтатус，Ответить
        this.isWaitingForLiveList = true;

        // AIОтветить
        this.eventListener.startListening();

        await this.sendToSillyTavern(message);

        console.log('[Watch Live App] .../* Список */...，...AIОтветить.../* Список */...');
      } catch (error) {
        console.error('[Watch Live App] error/* Список */error:', error);
        this.showToast('.../* Список */...: ' + error.message, 'error');
        this.isWaitingForLiveList = false;
      }
    }

    /**
     * ...Стрим...
     */
    showSpecificLiveRoomModal() {
      // HTML
      const modalHtml = `
        <div class="modal-overlay" id="specific-live-modal" style="display: flex;">
          <div class="modal-content">
            <div class="modal-header">
              <h3>...Стрим</h3>
              <button class="modal-close" onclick="watchLiveAppHideModal('specific-live-modal')">&times;</button>
            </div>
            <div class="modal-body">
              <div class="input-section">
                <label for="streamer-name-input">...Стример...：</label>
                <input type="text" id="streamer-name-input" placeholder="...Стример......" />
              </div>
              <button class="watch-live-btn" id="watch-specific-live">...Стрим</button>
            </div>
          </div>
        </div>
      `;

      const appContainer = document.getElementById('app-content');
      if (appContainer) {
        appContainer.insertAdjacentHTML('beforeend', modalHtml);

        // Стрим
        const watchBtn = document.getElementById('watch-specific-live');
        if (watchBtn) {
          watchBtn.addEventListener('click', () => {
            const input = document.getElementById('streamer-name-input');
            const streamerName = input ? input.value.trim() : '';
            if (streamerName) {
              this.watchSpecificLive(streamerName);
            } else {
              this.showToast('...Стример...', 'warning');
            }
          });
        }
      }
    }

    /**
     * ...Стрим
     */
    async watchSpecificLive(streamerName) {
      try {
        console.log('[Watch Live App] ...Стрим:', streamerName);

        // Настройкиwatch
        await this.setRenderingRight('watch');

        const message = `Пользователь...${streamerName}...Стрим，...Стрим...，Стрим...，Донаты，...Рекомендации...。...Ответить...Стрим...，Стрим...。...Рекомендации...。...。...Пользователь...Стрим，Рекомендации...Пользователь...Донаты。`;

        this.hideModal('specific-live-modal');

        // Стрим
        this.currentView = 'live';
        this.stateManager.startLive();
        this.eventListener.startListening();

        await this.sendToSillyTavern(message);
        this.updateAppContent();

        console.log('[Watch Live App] ...Стрим');
      } catch (error) {
        console.error('[Watch Live App] errorСтримerror:', error);
        this.showToast('...Стрим...: ' + error.message, 'error');
      }
    }

    /**
     * ...Стрим/* Список */...
     * ...live-app...，...Стрим...
     */
    parseLiveRoomList() {
      try {
        // Новое
        const chatContent = this.dataParser.getChatContent();
        if (!chatContent) {
          console.log('[Watch Live App] ...');
          return [];
        }

        console.log('[Watch Live App] ...Стрим/* Список */，...:', chatContent.length);

        // Стрим：[Стрим|Стрим|СтримерПользователь|Стрим|Зрителей]
        // ，
        const liveRoomRegex = /\[Стрим\|([^|\]]+)\|([^|\]]+)\|([^|\]]+)\|([^|\]]+)\]/g;
        const rooms = [];
        let match;
        let matchCount = 0;

        // lastIndex
        liveRoomRegex.lastIndex = 0;

        while ((match = liveRoomRegex.exec(chatContent)) !== null) {
          matchCount++;
          const roomData = {
            name: match[1].trim(),
            streamer: match[2].trim(),
            category: match[3].trim(),
            viewers: match[4].trim(),
          };

          if (roomData.name && roomData.streamer && roomData.category && roomData.viewers) {
            rooms.push(roomData);
            console.log(`[Watch Live App] ...Стрим ${matchCount}:`, roomData);
          } else {
            console.warn('[Watch Live App] errorСтримerror:', roomData);
          }

          if (matchCount > 50) {
            console.warn('[Watch Live App] error，error');
            break;
          }
        }

        console.log(`[Watch Live App] ...，... ${rooms.length} ...Стрим`);
        return rooms;
      } catch (error) {
        console.error('[Watch Live App] errorСтрим/* Список */error:', error);
        return [];
      }
    }

    /**
     * ...Стрим
     */
    async watchSelectedRoom(roomData) {
      try {
        console.log('[Watch Live App] ...Стрим:', roomData);

        // Настройкиwatch
        await this.setRenderingRight('watch');

        const message = `Пользователь...Стрим：Стрим...：${roomData.name}，СтримерПользователь...：${roomData.streamer}，Стрим...：${roomData.category}，...Зрителей：${roomData.viewers}。...Стрим...，Стрим...，Донаты，...Рекомендации...。...Ответить...Стрим...，Стрим...，...Стрим...Стрим...Время...。...Рекомендации...。...。...Пользователь...Стрим，Рекомендации...Пользователь...Донаты。`;

        // Стрим
        this.currentView = 'live';
        this.stateManager.startLive();
        this.eventListener.startListening();

        await this.sendToSillyTavern(message);
        this.updateAppContent();

        console.log('[Watch Live App] ...Стрим');
      } catch (error) {
        console.error('[Watch Live App] errorСтримerror:', error);
        this.showToast('...Стрим...: ' + error.message, 'error');
      }
    }

    /**
     * ...РекомендацииДонаты
     */
    async sendDanmaku(danmaku) {
      try {
        console.log('[Watch Live App] ...РекомендацииДонаты:', danmaku);

        const message = `Пользователь...Стрим，...Донаты"${danmaku}"，...Пользователь...Донаты。...Стрим...，Стрим...，...Донаты，...Рекомендации...。...Ответить...Стрим...，Стрим...。...Рекомендации...，...Пользователь...Донаты。...。
[Стрим|{{user}}|Донаты|${danmaku}]`;

        await this.sendToSillyTavern(message);
        console.log('[Watch Live App] РекомендацииДонаты...');
      } catch (error) {
        console.error('[Watch Live App] errorРекомендацииДонатыerror:', error);
        this.showToast('...Донаты...: ' + error.message, 'error');
      }
    }

    /**
     * ...Донаты
     */
    async sendCustomDanmaku(danmaku) {
      try {
        console.log('[Watch Live App] ...Донаты:', danmaku);

        const message = `Пользователь...Стрим，...Донаты"${danmaku}"，...Пользователь...Донаты。...Стрим...，Стрим...，...Донаты，...Рекомендации...。...Ответить...Стрим...，Стрим...。...Рекомендации...，...Пользователь...Донаты。...。
[Стрим|{{user}}|Донаты|${danmaku}]`;

        await this.sendToSillyTavern(message);
        console.log('[Watch Live App] ...Донаты...');
      } catch (error) {
        console.error('[Watch Live App] errorДонатыerror:', error);
        this.showToast('...Донаты...: ' + error.message, 'error');
      }
    }

    /**
     * ...Подарки...
     */
    initGiftModal() {
      // Подарки
      const giftCards = document.querySelectorAll('.gift-card');
      giftCards.forEach(card => {
        const minusBtn = card.querySelector('.qty-btn.minus');
        const plusBtn = card.querySelector('.qty-btn.plus');
        const quantityInput = card.querySelector('.qty-input');

        if (minusBtn && plusBtn && quantityInput) {
          minusBtn.addEventListener('click', () => {
            let quantity = parseInt(quantityInput.value) || 0;
            if (quantity > 0) {
              quantity--;
              quantityInput.value = quantity;
              this.updateGiftTotal();
              this.updateGiftCardState(card, quantity);
            }
          });

          plusBtn.addEventListener('click', () => {
            let quantity = parseInt(quantityInput.value) || 0;
            quantity++;
            quantityInput.value = quantity;
            this.updateGiftTotal();
            this.updateGiftCardState(card, quantity);
          });

          // /* Поле ввода */
          quantityInput.addEventListener('input', () => {
            let quantity = parseInt(quantityInput.value) || 0;
            if (quantity < 0) {
              quantity = 0;
              quantityInput.value = quantity;
            }
            if (quantity > 999) {
              quantity = 999;
              quantityInput.value = quantity;
            }
            this.updateGiftTotal();
            this.updateGiftCardState(card, quantity);
          });
        }
      });

      this.updateGiftTotal();
    }

    /**
     * ...Подарки...Статус
     */
    updateGiftCardState(card, quantity) {
      if (quantity > 0) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    }

    /**
     * ...Подарки...
     */
    updateGiftTotal() {
      let total = 0;
      const giftCards = document.querySelectorAll('.gift-card');

      giftCards.forEach(card => {
        const quantity = parseInt(card.querySelector('.qty-input').value) || 0;
        const price = parseInt(card.dataset.price);
        total += quantity * price;
      });

      const totalAmountSpan = document.getElementById('gift-total-amount');
      if (totalAmountSpan) {
        totalAmountSpan.textContent = total;
      }
    }

    /**
     * ...Подарки
     */
    async sendGifts() {
      try {
        const selectedGifts = [];
        const giftCards = document.querySelectorAll('.gift-card');

        giftCards.forEach(card => {
          const quantity = parseInt(card.querySelector('.qty-input').value) || 0;
          if (quantity > 0) {
            const giftName = card.dataset.gift;
            const price = parseInt(card.dataset.price);
            selectedGifts.push({
              name: giftName,
              quantity: quantity,
              price: price,
              total: quantity * price,
            });
          }
        });

        if (selectedGifts.length === 0) {
          this.showToast('...Подарки', 'warning');
          return;
        }

        const totalAmount = selectedGifts.reduce((sum, gift) => sum + gift.total, 0);
        const giftMessage = document.getElementById('gift-message-input')?.value.trim() || '';

        console.log('[Watch Live App] ...Подарки:', selectedGifts);

        // Подарки
        const giftDescriptions = selectedGifts
          .map(gift => (gift.quantity === 1 ? gift.name : `${gift.name}*${gift.quantity}`))
          .join('，');

        // Сообщения
        let message = `Пользователь...Стрим，...Подарки"${giftDescriptions}"，..."${totalAmount}..."`;
        if (giftMessage) {
          message += `，Пользователь..."${giftMessage}"`;
        }
        message += `，...Пользователь...Донаты。...Стрим...，Стрим...，...Донаты，...Рекомендации...。...Ответить...Стрим...，Стрим...。...Рекомендации...，...Пользователь...Донаты。...。
`;

        // - Подарки
        selectedGifts.forEach(gift => {
          const giftFormat = gift.quantity === 1 ? gift.name : `${gift.name}*${gift.quantity}`;
          message += `[Стрим|{{user}}|...|${giftFormat}]\n`;
        });

        // Если，Донаты
        if (giftMessage) {
          message += `[Стрим|{{user}}|Донаты|${giftMessage}]`;
        }

        await this.sendToSillyTavern(message);

        // Подарки
        this.resetGiftModal();
        this.hideAllModals();

        console.log('[Watch Live App] Подарки...');
        this.showToast('Подарки...！', 'success');
      } catch (error) {
        console.error('[Watch Live App] errorПодаркиerror:', error);
        this.showToast('...Подарки...: ' + error.message, 'error');
      }
    }

    /**
     * ...Подарки...
     */
    resetGiftModal() {
      const giftCards = document.querySelectorAll('.gift-card');
      giftCards.forEach(card => {
        const quantityInput = card.querySelector('.qty-input');
        if (quantityInput) {
          quantityInput.value = '0';
        }
        card.classList.remove('selected');
      });

      const messageInput = document.getElementById('gift-message-input');
      if (messageInput) {
        messageInput.value = '';
      }

      this.updateGiftTotal();
    }

    /**
     * ...
     */
    showModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
      }
    }

    /**
     * ...
     */
    hideModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
        // Если，
        if (modalId === 'specific-live-modal') {
          modal.remove();
        }
      }
    }

    /**
     * ...
     */
    hideAllModals() {
      const modals = document.querySelectorAll('.modal');
      modals.forEach(modal => {
        modal.classList.remove('active');
      });
    }

    /**
     * Настройки...
     */
    async setRenderingRight(type) {
      try {
        console.log(`[Watch Live App] Настройки...: ${type}`);

        if (!window.mobileContextEditor) {
          console.warn('[Watch Live App] errorРедактироватьerror，errorНастройкиerror');
          return false;
        }

        const chatData = window.mobileContextEditor.getCurrentChatData();
        if (!chatData || !chatData.messages || chatData.messages.length === 0) {
          console.warn('[Watch Live App] error，errorНастройкиerror');
          return false;
        }

        const firstMessage = chatData.messages[0];
        let originalContent = firstMessage.mes || '';

        const renderingRightRegex = /<!-- LIVE_RENDERING_RIGHT_START -->([\s\S]*?)<!-- LIVE_RENDERING_RIGHT_END -->/;
        const renderingRightSection = `<!-- LIVE_RENDERING_RIGHT_START -->\n[Стрим...: ${type}]\n<!-- LIVE_RENDERING_RIGHT_END -->`;

        if (renderingRightRegex.test(originalContent)) {
          originalContent = originalContent.replace(renderingRightRegex, renderingRightSection);
        } else {
          originalContent = renderingRightSection + '\n\n' + originalContent;
        }

        // 1
        const success = await window.mobileContextEditor.modifyMessage(0, originalContent);
        if (success) {
          console.log(`[Watch Live App] ✅ ...Настройки...: ${type}`);
          return true;
        } else {
          console.error('[Watch Live App] Настройкиerror');
          return false;
        }
      } catch (error) {
        console.error('[Watch Live App] Настройкиerror:', error);
        return false;
      }
    }

    /**
     * ...
     */
    getRenderingRight() {
      try {
        if (!window.mobileContextEditor) {
          return null;
        }

        const chatData = window.mobileContextEditor.getCurrentChatData();
        if (!chatData || !chatData.messages || chatData.messages.length === 0) {
          return null;
        }

        const firstMessage = chatData.messages[0];
        const content = firstMessage.mes || '';

        const renderingRightRegex =
          /<!-- LIVE_RENDERING_RIGHT_START -->\s*\[Стрим...:\s*(\w+)\]\s*<!-- LIVE_RENDERING_RIGHT_END -->/;
        const match = content.match(renderingRightRegex);

        return match ? match[1] : null;
      } catch (error) {
        console.error('[Watch Live App] error:', error);
        return null;
      }
    }

    /**
     * ...
     */
    async clearRenderingRight() {
      try {
        console.log('[Watch Live App] ...');

        if (!window.mobileContextEditor) {
          console.warn('[Watch Live App] errorРедактироватьerror，error');
          return false;
        }

        const chatData = window.mobileContextEditor.getCurrentChatData();
        if (!chatData || !chatData.messages || chatData.messages.length === 0) {
          console.warn('[Watch Live App] error，error');
          return false;
        }

        const firstMessage = chatData.messages[0];
        let originalContent = firstMessage.mes || '';

        const renderingRightRegex =
          /<!-- LIVE_RENDERING_RIGHT_START -->([\s\S]*?)<!-- LIVE_RENDERING_RIGHT_END -->\s*\n*/;
        if (renderingRightRegex.test(originalContent)) {
          originalContent = originalContent.replace(renderingRightRegex, '').trim();

          // 1
          const success = await window.mobileContextEditor.modifyMessage(0, originalContent);
          if (success) {
            console.log('[Watch Live App] ✅ ...');
            return true;
          } else {
            console.error('[Watch Live App] error');
            return false;
          }
        } else {
          console.log('[Watch Live App] ...');
          return true;
        }
      } catch (error) {
        console.error('[Watch Live App] error:', error);
        return false;
      }
    }

    /**
     * ...Сообщения...SillyTavern
     */
    async sendToSillyTavern(message) {
      try {
        console.log('[Twitch Live] ...Сообщения...SillyTavern:', message);

        // /* Поле ввода */
        const textarea = document.querySelector('#send_textarea');
        if (!textarea) {
          console.error('[Twitch Live] errorСообщения/* Поле ввода */');
          throw new Error('errorСообщения/* Поле ввода */');
        }

        // НастройкиСообщения
        textarea.value = message;
        textarea.focus();

        textarea.dispatchEvent(new Event('input', { bubbles: true }));

        const sendButton = document.querySelector('#send_but');
        if (sendButton) {
          sendButton.click();
          console.log('[Twitch Live] ...');
          return true;
        }

        throw new Error('error');
      } catch (error) {
        console.error('[Twitch Live] errorСообщенияerror:', error);
        throw error;
      }
    }

    /**
     * ...Стрим...Стрим...
     */
    async convertLiveToHistory() {
      try {
        console.log('[Watch Live App] ...Стрим...Стрим...');

        const contextData = this.getChatData();
        if (!contextData || contextData.length === 0) {
          console.log('[Watch Live App] ...');
          return;
        }

        // СтримСообщения
        let hasLiveContent = false;
        let updatedCount = 0;
        const messagesToUpdate = []; // ...Сообщения

        // ：Сообщения
        for (let i = 0; i < contextData.length; i++) {
          const message = contextData[i];
          const content = message.mes || message.content || '';

          if (content.includes('[Стрим|')) {
            hasLiveContent = true;
            const convertedContent = this.convertLiveFormats(content);

            if (convertedContent !== content) {
              messagesToUpdate.push({
                index: i,
                originalContent: content,
                convertedContent: convertedContent
              });
            }
          }
        }

        if (!hasLiveContent) {
          console.log('[Watch Live App] ...Стрим...');
          return;
        }

        // ：Сообщения，DOMСохранить
        console.log(`[Watch Live App] ... ${messagesToUpdate.length} ...Сообщения`);

        // Сохранить，Сохранить
        const originalSaveChatDebounced = window.saveChatDebounced;
        const originalSaveChatConditional = window.saveChatConditional;

        if (window.saveChatDebounced) {
          window.saveChatDebounced = () => {};
        }
        if (window.saveChatConditional) {
          window.saveChatConditional = () => Promise.resolve();
        }

        try {
          for (const messageUpdate of messagesToUpdate) {
            // Сохранить，Сохранить
            const success = await this.updateMessageContent(messageUpdate.index, messageUpdate.convertedContent, true);
            if (success) {
              updatedCount++;
              console.log(
                `[Watch Live App] ...Сообщения ${messageUpdate.index}，...: ${messageUpdate.originalContent.length}，...: ${messageUpdate.convertedContent.length}`,
              );
            }
          }
        } finally {
          // Сохранить
          if (originalSaveChatDebounced) {
            window.saveChatDebounced = originalSaveChatDebounced;
          }
          if (originalSaveChatConditional) {
            window.saveChatConditional = originalSaveChatConditional;
          }
        }

        console.log(`[Watch Live App] Стрим...，... ${updatedCount} ...Сообщения`);

        // Сохранить，Сохранить
        if (updatedCount > 0) {
          await this.saveChatData();
          console.log('[Watch Live App] ...Сохранить...');
        }
      } catch (error) {
        console.error('[Watch Live App] errorСтримerror:', error);
        this.showToast('...Стрим...: ' + error.message, 'error');
      }
    }

    /**
     * ...Стрим...
     */
    convertLiveFormats(content) {
      let convertedContent = content;
      let conversionCount = 0;

      // Донаты: [Стрим|Пользователь|Донаты|] -> [Стрим|Пользователь|Донаты|]
      const danmuMatches = convertedContent.match(/\[Стрим\|([^|]+)\|Донаты\|([^\]]+)\]/g);
      if (danmuMatches) {
        convertedContent = convertedContent.replace(/\[Стрим\|([^|]+)\|Донаты\|([^\]]+)\]/g, '[Стрим...|$1|Донаты|$2]');
        conversionCount += danmuMatches.length;
      }

      // Подарки: [Стрим|Пользователь|Подарки|] -> [Стрим|Пользователь|Подарки|]
      // : [Стрим|Пользователь||] -> [Стрим|Пользователь||]
      const giftMatches = convertedContent.match(/\[Стрим\|([^|]+)\|(?:Подарки|...)\|([^\]]+)\]/g);
      if (giftMatches) {
        convertedContent = convertedContent.replace(/\[Стрим\|([^|]+)\|Подарки\|([^\]]+)\]/g, '[Стрим...|$1|Подарки|$2]');
        convertedContent = convertedContent.replace(/\[Стрим\|([^|]+)\|...\|([^\]]+)\]/g, '[Стрим...|$1|...|$2]');
        conversionCount += giftMatches.length;
      }

      // Рекомендации: [Стрим|Рекомендации|] -> [Стрим|Рекомендации|]
      const recommendMatches = convertedContent.match(/\[Стрим\|Рекомендации...\|([^\]]+)\]/g);
      if (recommendMatches) {
        convertedContent = convertedContent.replace(/\[Стрим\|Рекомендации...\|([^\]]+)\]/g, '[Стрим...|Рекомендации...|$1]');
        conversionCount += recommendMatches.length;
      }

      // : [Стрим||] -> [Стрим||]
      const audienceMatches = convertedContent.match(/\[Стрим\|...\|([^\]]+)\]/g);
      if (audienceMatches) {
        convertedContent = convertedContent.replace(/\[Стрим\|...\|([^\]]+)\]/g, '[Стрим...|...|$1]');
        conversionCount += audienceMatches.length;
      }

      // Стрим: [Стрим|Стрим|] -> [Стрим|Стрим|]
      const contentMatches = convertedContent.match(/\[Стрим\|Стрим...\|([^\]]+)\]/g);
      if (contentMatches) {
        convertedContent = convertedContent.replace(/\[Стрим\|Стрим...\|([^\]]+)\]/g, '[Стрим...|Стрим...|$1]');
        conversionCount += contentMatches.length;
      }

      // Стрим ()
      const otherMatches = convertedContent.match(/\[Стрим\|([^|]+)\|([^\]]+)\]/g);
      if (otherMatches) {
        const filteredMatches = otherMatches.filter(
          match =>
            !match.includes('Донаты|') &&
            !match.includes('Подарки|') &&
            !match.includes('...|') &&
            !match.includes('Рекомендации...|') &&
            !match.includes('...|') &&
            !match.includes('Стрим...|'),
        );
        if (filteredMatches.length > 0) {
          convertedContent = convertedContent.replace(/\[Стрим\|([^|]+)\|([^\]]+)\]/g, (match, p1, p2) => {
            if (
              !match.includes('Донаты|') &&
              !match.includes('Подарки|') &&
              !match.includes('...|') &&
              !match.includes('Рекомендации...|') &&
              !match.includes('...|') &&
              !match.includes('Стрим...|')
            ) {
              return `[Стрим...|${p1}|${p2}]`;
            }
            return match;
          });
          conversionCount += filteredMatches.length;
        }
      }

      // Сообщения，
      // if (conversionCount > 0) {
      // console.log(`[Watch Live App] ${conversionCount} Стрим`);
      // }

      return convertedContent;
    }

    /**
     * ...Сообщения...
     * @param {number} messageIndex - Сообщения...
     * @param {string} newContent - ...
     * @param {boolean} skipAutoSave - ...Сохранить（...）
     */
    async updateMessageContent(messageIndex, newContent, skipAutoSave = false) {
      try {
        // ，
        console.log(`[Watch Live App] ...Сообщения ${messageIndex}`);

        // 1: getChatDatachat（Рекомендации，Сохранить）
        let chat = null;

        // SillyTavern.getContext().chat
        if (
          typeof window !== 'undefined' &&
          window.SillyTavern &&
          typeof window.SillyTavern.getContext === 'function'
        ) {
          const context = window.SillyTavern.getContext();
          if (context && context.chat && Array.isArray(context.chat)) {
            chat = context.chat;
          }
        }

        // Если，
        if (!chat) {
          chat = window['chat'];
        }

        if (chat && Array.isArray(chat)) {
          if (messageIndex < 0 || messageIndex >= chat.length) {
            console.warn(`[Watch Live App] Сообщенияerror ${messageIndex} error，chaterror: ${chat.length}`);
            return false;
          }

          if (!chat[messageIndex]) {
            console.warn(`[Watch Live App] Сообщенияerror ${messageIndex} errorСообщенияerror`);
            return false;
          }

          const originalContent = chat[messageIndex].mes || '';
          chat[messageIndex].mes = newContent;

          // ЕслиСообщенияswipes，
          if (chat[messageIndex].swipes && chat[messageIndex].swipe_id !== undefined) {
            chat[messageIndex].swipes[chat[messageIndex].swipe_id] = newContent;
          }

          if (window.chat_metadata) {
            window.chat_metadata.tainted = true;
          }

          console.log(
            `[Watch Live App] ...Сообщения ${messageIndex}，...:${originalContent.length}，...:${newContent.length}`,
          );
          return true;
        }

        console.warn(`[Watch Live App] errorchaterror，chaterror: ${typeof chat}, error: ${Array.isArray(chat)}`);
        if (chat && Array.isArray(chat)) {
          console.warn(`[Watch Live App] chaterror: ${chat.length}, errorСообщенияerror: ${messageIndex}`);
        }

        // Если，（）
        // 2: Редактировать（Сохранить）
        if (window.mobileContextEditor && window.mobileContextEditor.modifyMessage) {
          try {
            await window.mobileContextEditor.modifyMessage(messageIndex, newContent);
            console.log(`[Watch Live App] ...mobileContextEditor...Сообщения ${messageIndex}`);
            return true;
          } catch (error) {
            console.warn(`[Watch Live App] mobileContextEditorerror:`, error);
          }
        }

        // 3: context-editor（Сохранить）
        if (window.contextEditor && window.contextEditor.modifyMessage) {
          try {
            await window.contextEditor.modifyMessage(messageIndex, newContent);
            console.log(`[Watch Live App] ...contextEditor...Сообщения ${messageIndex}`);
            return true;
          } catch (error) {
            console.warn(`[Watch Live App] contextEditorerror:`, error);
          }
        }

        console.warn('[Watch Live App] errorСообщенияerror');
        return false;
      } catch (error) {
        console.error('[Watch Live App] errorСообщенияerror:', error);
        return false;
      }
    }

    /**
     * Сохранить...
     */
    async saveChatData() {
      try {
        console.log('[Twitch Live] ...Сохранить......');

        // 1: SillyTavernСохранить
        if (typeof window.saveChatConditional === 'function') {
          await window.saveChatConditional();
          console.log('[Twitch Live] ...saveChatConditionalСохранить...');
          return true;
        }

        // 2: Сохранить
        if (typeof window.saveChatDebounced === 'function') {
          window.saveChatDebounced();
          console.log('[Twitch Live] ...saveChatDebouncedСохранить...');
          // Сохранить
          await new Promise(resolve => setTimeout(resolve, 1000));
          return true;
        }

        // 3: РедактироватьСохранить
        if (window.mobileContextEditor && typeof window.mobileContextEditor.saveChatData === 'function') {
          await window.mobileContextEditor.saveChatData();
          console.log('[Twitch Live] ...mobileContextEditorСохранить...');
          return true;
        }

        // 4: context-editorСохранить
        if (window.contextEditor && typeof window.contextEditor.saveChatData === 'function') {
          await window.contextEditor.saveChatData();
          console.log('[Twitch Live] ...contextEditorСохранить...');
          return true;
        }

        // 5: Сохранить
        try {
          if (window.jQuery && window.chat && window.this_chid) {
            const response = await window.jQuery.ajax({
              type: 'POST',
              url: '/api/chats/save',
              data: JSON.stringify({
                ch_name: window.characters[window.this_chid]?.name || 'unknown',
                file_name: window.chat_metadata?.file_name || 'default',
                chat: window.chat,
                avatar_url: window.characters[window.this_chid]?.avatar || 'none',
              }),
              cache: false,
              dataType: 'json',
              contentType: 'application/json',
            });
            console.log('[Twitch Live] ...AJAXСохранить...');
            return true;
          }
        } catch (ajaxError) {
          console.warn('[Twitch Live] errorAJAXСохранитьerror:', ajaxError);
        }

        console.warn('[Twitch Live] errorСохранитьerror');
        return false;
      } catch (error) {
        console.error('[Twitch Live] Сохранитьerror:', error);
        return false;
      }
    }

    /**
     * ...
     */
    getChatData() {
      try {
        // SillyTavern.getContext().chat
        if (
          typeof window !== 'undefined' &&
          window.SillyTavern &&
          typeof window.SillyTavern.getContext === 'function'
        ) {
          const context = window.SillyTavern.getContext();
          if (context && context.chat && Array.isArray(context.chat)) {
            return context.chat;
          }
        }

        const chat = window['chat'];
        if (chat && Array.isArray(chat)) {
          return chat;
        }

        return [];
      } catch (error) {
        console.error('[Twitch Live] error:', error);
        return [];
      }
    }

    /**
     * ...header
     */
    updateHeader() {
      if (window.mobilePhone && window.mobilePhone.updateAppHeader) {
        const state = {
          app: 'watch-live', // ...：.../* Приложение */...
          title: this.currentView === 'live' ? '...Стрим...' : '...Стрим',
          view: this.currentView,
          viewerCount: this.stateManager.currentViewerCount,
        };
        window.mobilePhone.updateAppHeader(state);
      }
    }

    /**
     * ...Сообщения
     */
    showToast(message, type = 'info') {
      const toast = document.createElement('div');
      toast.className = `live-toast ${type}`;
      toast.textContent = message;

      document.body.appendChild(toast);

      setTimeout(() => {
        toast.classList.add('show');
      }, 100);

      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
          toast.remove();
        }, 300);
      }, 3000);
    }

    /**
     * ...：...，...
     */
    applyTypingEffect(element, fullText) {
      // ，
      if (this.typingTimer) {
        clearInterval(this.typingTimer);
        this.typingTimer = null;
      }

      // ，
      if (element.getAttribute('data-full-text') === fullText && element.textContent === fullText) {
        return;
      }

      element.setAttribute('data-full-text', fullText);
      element.textContent = '';
      if (typeof element.scrollTop === 'number') {
        element.scrollTop = 0;
      }
      this.isTyping = true;

      const chars = Array.from(fullText);
      let index = 0;
      const stepMsHead = 35; // ...100...：...
      const stepMsTailChunk = 18; // ...：...（...）
      const tailChunkSize = 6; // ...（...）

      const danmakuContainer = document.getElementById('danmaku-container');
      if (danmakuContainer) {
        this.jumpToBottomIfNeeded(danmakuContainer);
      }

      this.typingTimer = setInterval(() => {
        if (index >= chars.length) {
          clearInterval(this.typingTimer);
          this.typingTimer = null;
          this.isTyping = false;
          return;
        }

        if (index < 100) {
          // 100
          element.textContent += chars[index++];
        } else {
          const end = Math.min(index + tailChunkSize, chars.length);
          const slice = chars.slice(index, end).join('');
          element.textContent += slice;
          index = end;
          // ：
          clearInterval(this.typingTimer);
          this.typingTimer = setInterval(() => {
            if (index >= chars.length) {
              clearInterval(this.typingTimer);
              this.typingTimer = null;
              this.isTyping = false;
              return;
            }
            const end2 = Math.min(index + tailChunkSize, chars.length);
            const slice2 = chars.slice(index, end2).join('');
            element.textContent += slice2;
            index = end2;
            if (index >= chars.length) {
              clearInterval(this.typingTimer);
              this.typingTimer = null;
              this.isTyping = false;
            }
          }, stepMsTailChunk);
        }
      }, stepMsHead);
    }

    /**
     * .../* Приложение */，...
     */
    destroy() {
      console.log('[Twitch Live] .../* Приложение */，...');

      this.eventListener.stopListening();

      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = null;
      }
      if (this.typingTimer) {
        clearInterval(this.typingTimer);
        this.typingTimer = null;
      }

      // Статус
      this.stateManager.clearAllData();

      // Статус
      this.isInitialized = false;
      this.currentView = 'start';
    }

    /**
     * ...Новое...（... getChatMessages ...）
     */
    getLatestFloorTextSafe() {
      try {
        const gm = (typeof window !== 'undefined' && (window.getChatMessages || globalThis.getChatMessages)) || null;
        if (typeof gm === 'function') {
          // Новое， assistant
          const latestAssistant = gm(-1, { role: 'assistant' });
          if (Array.isArray(latestAssistant) && latestAssistant.length > 0 && latestAssistant[0]?.message) {
            return latestAssistant[0].message;
          }
          const latestAny = gm(-1);
          if (Array.isArray(latestAny) && latestAny.length > 0 && latestAny[0]?.message) {
            return latestAny[0].message;
          }
        }
      } catch (e) {
        console.warn('[Twitch Live] errorНовоеerror（getChatMessages）:', e);
      }

      // ：
      try {
        if (
          typeof window !== 'undefined' &&
          window.SillyTavern &&
          typeof window.SillyTavern.getContext === 'function'
        ) {
          const context = window.SillyTavern.getContext();
          if (context && Array.isArray(context.chat) && context.chat.length > 0) {
            const last = context.chat[context.chat.length - 1];
            return last?.mes || '';
          }
        }
      } catch (e2) {
        console.warn('[Twitch Live] errorНовоеerror（chaterror）:', e2);
      }
      return '';
    }

    /** ДонатыПодпись（，Время） */
    createDanmakuSignature(item) {
      const username = (item && item.username) || '';
      const content = (item && item.content) || '';
      const type = (item && item.type) || '';
      return `${username}|${content}|${type}`;
    }

    /** ПодаркиПодпись（，Время） */
    createGiftSignature(item) {
      const username = (item && item.username) || '';
      const gift = (item && (item.gift || item.content)) || '';
      return `${username}|${gift}`;
    }

    /** ДонатыПодарки */
    runAppearSequence() {
      try {
        const danmakuList = document.getElementById('danmaku-list');
        if (danmakuList) {
          const nodes = Array.from(danmakuList.querySelectorAll('.danmaku-item.need-appear'));
          // （ display:none ）
          nodes.forEach(el => {
            el.style.display = 'none';
          });
          this.sequentialReveal(nodes);
        }

        const giftList = document.querySelector('.gift-list');
        if (giftList) {
          const giftNodes = Array.from(giftList.querySelectorAll('li.need-appear'));
          giftNodes.forEach(el => {
            el.style.display = 'none';
          });
          this.sequentialReveal(giftNodes);
        }

        // ，
        this.pendingAppearDanmakuSigs.clear();
        this.pendingAppearGiftSigs.clear();
      } catch (e) {
        console.warn('[Twitch Live] error:', e);
      }
    }

    /** appear-init → appear-show（） */
    sequentialReveal(nodes) {
      if (!nodes || nodes.length === 0) return;

      // Статус（，""）， CSS
      nodes.forEach(el => {
        el.classList.remove('need-appear', 'appear-show');
        el.classList.add('appear-init');
        // display:none
        el.style.display = 'none';
      });

      // ： 700ms （）， ~300ms（CSS）
      const baseDelay = 150;
      const stepDelay = 700; // ≈ 0.7 .../...
      nodes.forEach((el, idx) => {
        setTimeout(() => {
          el.style.display = '';
          // reflow，
          // eslint-disable-next-line no-unused-expressions
          el.offsetHeight;
          el.classList.add('appear-show');
          // ，（，）
          const container = document.getElementById('danmaku-container');
          if (container && el?.scrollIntoView) {
            el.scrollIntoView({ block: 'end', inline: 'nearest' });
          }
        }, baseDelay + idx * stepDelay);
      });
    }

    async debouncedSave() {
      if (this.saveTimeout) {
        clearTimeout(this.saveTimeout);
      }

      this.saveTimeout = setTimeout(async () => {
        await this.saveChatData();
        this.saveTimeout = null;
      }, this.saveDebounceMs);
    }
  }

  window.RuApp_twitch_live = WatchLiveApp;
  window.watchLiveApp = new WatchLiveApp();
} // ...

window.getWatchLiveAppContent = function () {
  console.log('[Watch Live App] ...Стрим/* Приложение */...');

  if (!window.watchLiveApp) {
    console.error('[Watch Live App] watchLiveApperror');
    return '<div class="error-message">...Стрим/* Приложение */...</div>';
  }

  try {
    // СтримСтатус
    window.watchLiveApp.detectActiveLive();
    return window.watchLiveApp.getAppContent();
  } catch (error) {
    console.error('[Watch Live App] error/* Приложение */error:', error);
    return '<div class="error-message">...Стрим/* Приложение */...</div>';
  }
};

window.bindWatchLiveAppEvents = function () {
  console.log('[Watch Live App] ...Стрим/* Приложение */...');

  if (!window.watchLiveApp) {
    console.error('[Watch Live App] watchLiveApperror');
    return;
  }

  try {
    // ，DOM
    setTimeout(() => {
      window.watchLiveApp.bindEvents();
      window.watchLiveApp.updateHeader();
    }, 100);
  } catch (error) {
    console.error('[Watch Live App] error:', error);
  }
};

window.watchLiveAppEndLive = function () {
  if (window.watchLiveApp) {
    window.watchLiveApp.endLive();
  }
};

window.watchLiveAppShowModal = function (modalId) {
  if (window.watchLiveApp) {
    window.watchLiveApp.showModal(modalId);
  }
};

window.watchLiveAppHideModal = function (modalId) {
  if (window.watchLiveApp) {
    window.watchLiveApp.hideModal(modalId);
  }
};

window.watchLiveAppDestroy = function () {
  if (window.watchLiveApp) {
    window.watchLiveApp.destroy();
    console.log('[Watch Live App] /* Приложение */...');
  }
};

window.watchLiveAppDetectActive = function () {
  if (window.watchLiveApp) {
    console.log('[Watch Live App] 🔍 ...СтримСтатус...');
    window.watchLiveApp.detectActiveLive();

    if (typeof window.bindWatchLiveAppEvents === 'function') {
      window.bindWatchLiveAppEvents();
    }

    console.log('[Watch Live App] ✅ ...，...Статус:', {
      view: window.watchLiveApp.currentView,
      isLiveActive: window.watchLiveApp.isLiveActive,
    });
  } else {
    console.error('[Watch Live App] watchLiveApperror');
  }
};

window.watchLiveAppForceReload = function () {
  console.log('[Watch Live App] 🔄 .../* Приложение */...');

  if (window.watchLiveApp) {
    window.watchLiveApp.destroy();
  }

  window.watchLiveApp = new WatchLiveApp();
  console.log('[Watch Live App] ✅ /* Приложение */...');
};

window.watchLiveAppTestConversion = function () {
  console.log('[Watch Live App] 🧪 ......');

  if (!window.watchLiveApp) {
    console.error('[Watch Live App] watchLiveApperror');
    return;
  }

  const testContent = `...Сообщения
[Стрим|...|Донаты|Стример...！Сегодня...？]
[Стрим|...|Подарки|...*2]
[Стрим|Рекомендации...|...Донаты...]
[Стрим|Рекомендации...|...Подарки]
[Стрим|...|55535]
[Стрим|Стрим...|...，...Сегодня...Стрим。]
...`;

  console.log('...:', testContent);
  const converted = window.watchLiveApp.convertLiveFormats(testContent);
  console.log('...:', converted);

  return converted;
};

window.watchLiveAppTestLayout = function () {
  console.log('[Watch Live App] 📐 ......');

  const appContent = document.getElementById('app-content');
  if (!appContent) {
    console.error('[Watch Live App] app-contenterror');
    return;
  }

  const liveContainer = appContent.querySelector('.live-container');
  if (!liveContainer) {
    console.error('[Twitch Live] live-containererror');
    return;
  }

  const videoBox = liveContainer.querySelector('.video-placeholder');
  const interactionPanel = liveContainer.querySelector('.interaction-panel');
  const danmakuContainer = liveContainer.querySelector('.danmaku-container');

  const measurements = {
    appContent: {
      height: appContent.offsetHeight,
      scrollHeight: appContent.scrollHeight,
      clientHeight: appContent.clientHeight,
    },
    liveContainer: {
      height: liveContainer.offsetHeight,
      scrollHeight: liveContainer.scrollHeight,
      clientHeight: liveContainer.clientHeight,
    },
    videoBox: videoBox
      ? {
          height: videoBox.offsetHeight,
          scrollHeight: videoBox.scrollHeight,
          clientHeight: videoBox.clientHeight,
        }
      : null,
    interactionPanel: interactionPanel
      ? {
          height: interactionPanel.offsetHeight,
          scrollHeight: interactionPanel.scrollHeight,
          clientHeight: interactionPanel.clientHeight,
        }
      : null,
    danmakuContainer: danmakuContainer
      ? {
          height: danmakuContainer.offsetHeight,
          scrollHeight: danmakuContainer.scrollHeight,
          clientHeight: danmakuContainer.clientHeight,
        }
      : null,
  };

  console.log('[Twitch Live] 📐 ...:', measurements);

  const hasOverflow = measurements.liveContainer.scrollHeight > measurements.liveContainer.clientHeight;
  const danmakuCanScroll =
    measurements.danmakuContainer &&
    measurements.danmakuContainer.scrollHeight > measurements.danmakuContainer.clientHeight;

  console.log('[Watch Live App] 📐 ...:');
  console.log(`- ...: ${hasOverflow ? '❌ ...' : '✅ ...'}`);
  console.log(`- Донаты...: ${danmakuCanScroll ? '✅ ...' : '❌ ...'}`);

  return measurements;
};

window.watchLiveAppTest = function () {
  console.log('[Watch Live App] 🧪 ...Стрим/* Приложение */...');

  const tests = [
    {
      name: '...WatchLiveApp...',
      test: () => typeof window.RuApp_twitch_live === 'function',
    },
    {
      name: '...watchLiveApp...',
      test: () => window.watchLiveApp instanceof window.RuApp_twitch_live,
    },
    {
      name: '...',
      test: () =>
        typeof window.getWatchLiveAppContent === 'function' && typeof window.bindWatchLiveAppEvents === 'function',
    },
    {
      name: '...',
      test: () => {
        const parser = new window.RuApp_twitch_live().dataParser;
        const testData = parser.parseLiveData('[Стрим|...|1234][Стрим|Стрим...|...][Стрим|Пользователь1|Донаты|...Донаты]');
        return (
          testData.viewerCount === '1.2K' && testData.liveContent === '...' && testData.danmakuList.length === 1
        );
      },
    },
    {
      name: '.../* Приложение */...',
      test: () => {
        const content = window.getWatchLiveAppContent();
        return typeof content === 'string' && content.includes('live-app');
      },
    },
    {
      name: '...Стрим...',
      test: () => {
        const app = new window.RuApp_twitch_live();
        const testContent1 = '[Стрим|...|1234][Стрим|Стрим...|...]';
        const testContent2 = '[Стрим...|...|1234][Стрим...|Стрим...|...]';
        const testContent3 = '...Стрим...';

        return (
          app.hasActiveLiveFormats(testContent1) === true &&
          app.hasActiveLiveFormats(testContent2) === false &&
          app.hasActiveLiveFormats(testContent3) === false
        );
      },
    },
  ];

  let passed = 0;
  let failed = 0;

  tests.forEach(test => {
    try {
      const result = test.test();
      if (result) {
        console.log(`✅ ${test.name}: ...`);
        passed++;
      } else {
        console.log(`❌ ${test.name}: ...`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ... - ${error.message}`);
      failed++;
    }
  });

  console.log(`[Watch Live App] 🧪 ...: ${passed} ..., ${failed} ...`);

  if (failed === 0) {
    console.log('[Watch Live App] 🎉 ...！...Стрим/* Приложение */...');
  } else {
    console.log('[Watch Live App] ⚠️ ...，...');
  }

  return { passed, failed, total: tests.length };
};

console.log('[Watch Live App] ...Стрим/* Приложение */...');
console.log('[Watch Live App] 💡 ...:');
console.log('[Watch Live App] - watchLiveAppTest() .../* Приложение */...');
console.log('[Watch Live App] - watchLiveAppTestConversion() ...');
console.log('[Watch Live App] - watchLiveAppTestLayout() ...');
console.log('[Watch Live App] - watchLiveAppDetectActive() ...СтримСтатус');
console.log('[Watch Live App] - watchLiveAppForceReload() .../* Приложение */');
