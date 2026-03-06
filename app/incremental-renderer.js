/**
 * ... - Incremental Renderer
 * ...Сообщения，...
 * ...Новое...Сообщения，...Сообщения...
 */

class IncrementalRenderer {
  constructor() {
    this.processedMessageIds = new Set(); // ...СообщенияID
    this.cachedRenderedMessages = new Map(); // ...СообщенияHTML
    this.lastProcessedMessageIndex = -1; // ...Сообщения...
    this.lastFloorCount = 0; // ...
    this.floorMonitor = null; // ...
    this.isEnabled = true;
    this.renderingInProgress = false; // ...

    this.contextMonitor =
      window['contextMonitor'] || (window['ContextMonitor'] ? new window['ContextMonitor']() : null);

    if (this.contextMonitor) {
      const formats = this.contextMonitor.getAllExtractorFormats();
      this.formatMatchers = {
        friend: {
          regex: formats.friend.regex,
          type: 'friend',
          fields: formats.friend.fields,
        },
        myMessage: {
          regex: formats.myMessage.regex,
          type: 'myMessage',
          fields: formats.myMessage.fields,
        },
        theirMessage: {
          regex: formats.otherMessage.regex,
          type: 'theirMessage',
          fields: formats.otherMessage.fields,
        },
        groupMessage: {
          regex: formats.groupMessage.regex,
          type: 'groupMessage',
          fields: formats.groupMessage.fields,
        },
        myGroupMessage: {
          regex: formats.myGroupMessage.regex,
          type: 'myGroupMessage',
          fields: formats.myGroupMessage.fields,
        },
      };
    } else {
      console.warn('[error] error，error');
      this.formatMatchers = {
        friend: {
          regex: /\[Друзьяid\|([^|]+)\|([^|]+)\]/g,
          type: 'friend',
          fields: ['name', 'number'],
        },
        myMessage: {
          regex: /\[...Сообщения\|([^|]+)\|([^|]+)\|([^\]]+)\]/g,
          type: 'myMessage',
          fields: ['receiver', 'number', 'content'],
        },
        theirMessage: {
          regex: /\[...Сообщения\|([^|]+)\|([^|]+)\|([^\]]+)\]/g,
          type: 'theirMessage',
          fields: ['sender', 'number', 'content'],
        },
        groupMessage: {
          regex: /\[...Сообщения\|([^|]+)\|([^|]+)\|([^\]]+)\]/g,
          type: 'groupMessage',
          fields: ['groupId', 'sender', 'content'],
        },
        myGroupMessage: {
          regex: /\[...Сообщения\|([^|]+)\|...\|([^\]]+)\]/g,
          type: 'myGroupMessage',
          fields: ['groupId', 'content'],
        },
      };
    }

    this.init();
  }

  init() {
    console.log('[...] ......');
    this.setupFloorMonitor();
    this.initializeCache();
  }

  // Настройки
  setupFloorMonitor() {
    try {
      if (window.MobileContext && window.MobileContext.addFloorListener) {
        window.MobileContext.addFloorListener('onFloorAdded', data => {
          this.handleNewFloor(data);
        });

        // Запуск мониторинга сообщений
        if (window.MobileContext.startFloorMonitor) {
          window.MobileContext.startFloorMonitor();
        }

        console.log('[...] ✅ ...Настройки');
      } else {
        console.warn('[error] error，error');
        this.setupFallbackMonitor();
      }
    } catch (error) {
      console.error('[error] Настройкиerror:', error);
      this.setupFallbackMonitor();
    }
  }

  setupFallbackMonitor() {
    setInterval(() => {
      this.checkForNewMessages();
    }, 2000); // 2...，...
  }

  // Сообщения（）
  checkForNewMessages() {
    try {
      const currentMessages = this.getCurrentMessages();
      if (currentMessages.length > this.lastProcessedMessageIndex + 1) {
        const newMessages = currentMessages.slice(this.lastProcessedMessageIndex + 1);
        this.processNewMessages(newMessages);
      }
    } catch (error) {
      console.error('[error] errorСообщенияerror:', error);
    }
  }

  initializeCache() {
    try {
      // Сообщения
      const existingMessages = this.getCurrentMessages();
      this.lastProcessedMessageIndex = existingMessages.length - 1;

      // Сообщения（）
      existingMessages.forEach((message, index) => {
        if (message.id || message.send_date) {
          const messageId = this.generateMessageId(message, index);
          this.processedMessageIds.add(messageId);
        }
      });

      console.log(`[...] ...，... ${this.processedMessageIds.size} ...Сообщения`);
    } catch (error) {
      console.error('[error] error:', error);
    }
  }

  handleNewFloor(floorData) {
    if (!this.isEnabled || this.renderingInProgress) {
      return;
    }

    console.log('[...] ...:', floorData);

    // Сообщения
    const newMessages = this.getNewMessages();
    if (newMessages.length > 0) {
      this.processNewMessages(newMessages);
    }
  }

  // Сообщения
  getNewMessages() {
    try {
      const currentMessages = this.getCurrentMessages();
      const newMessages = [];

      for (let i = this.lastProcessedMessageIndex + 1; i < currentMessages.length; i++) {
        const message = currentMessages[i];
        const messageId = this.generateMessageId(message, i);

        if (!this.processedMessageIds.has(messageId)) {
          newMessages.push({
            ...message,
            index: i,
            id: messageId,
          });
        }
      }

      return newMessages;
    } catch (error) {
      console.error('[error] errorСообщенияerror:', error);
      return [];
    }
  }

  // Сообщения
  async processNewMessages(newMessages) {
    if (this.renderingInProgress) {
      return;
    }

    this.renderingInProgress = true;

    try {
      console.log(`[...] ... ${newMessages.length} ...Сообщения`);

      for (const message of newMessages) {
        await this.processMessage(message);

        // Статус
        this.processedMessageIds.add(message.id);
        this.lastProcessedMessageIndex = Math.max(this.lastProcessedMessageIndex, message.index);
      }

      // （）
      this.updateInterface();
    } catch (error) {
      console.error('[error] errorСообщенияerror:', error);
    } finally {
      this.renderingInProgress = false;
    }
  }

  // Сообщения
  async processMessage(message) {
    try {
      if (!message.mes) {
        return;
      }

      // Сообщения
      const extractedData = this.extractFormatsFromMessage(message.mes);

      if (extractedData.length > 0) {
        console.log(`[...] Сообщения ${message.index} ... ${extractedData.length} ...:`, extractedData);

        for (const data of extractedData) {
          await this.renderFormat(data, message);
        }

        this.cacheMessageRender(message, extractedData);
      }
    } catch (error) {
      console.error('[error] errorСообщенияerror:', error);
    }
  }

  // Сообщения
  extractFormatsFromMessage(messageText) {
    const extractedData = [];

    Object.entries(this.formatMatchers).forEach(([formatName, matcher]) => {
      const regex = new RegExp(matcher.regex.source, matcher.regex.flags);
      let match;

      while ((match = regex.exec(messageText)) !== null) {
        const data = {
          type: matcher.type,
          fullMatch: match[0],
          index: match.index,
          fields: {},
        };

        matcher.fields.forEach((fieldName, index) => {
          data.fields[fieldName] = match[index + 1] || '';
        });

        extractedData.push(data);
      }
    });

    return extractedData;
  }

  async renderFormat(formatData, message) {
    try {
      switch (formatData.type) {
        case 'friend':
          await this.renderFriend(formatData.fields, message);
          break;
        case 'myMessage':
          await this.renderMyMessage(formatData.fields, message);
          break;
        case 'theirMessage':
          await this.renderTheirMessage(formatData.fields, message);
          break;
        case 'groupMessage':
          await this.renderGroupMessage(formatData.fields, message);
          break;
        case 'myGroupMessage':
          await this.renderMyGroupMessage(formatData.fields, message);
          break;
        default:
          console.warn('[error] error:', formatData.type);
      }
    } catch (error) {
      console.error('[error] error:', error);
    }
  }

  // Друзья
  async renderFriend(fields, message) {
    if (window.friendRenderer) {
      await window.friendRenderer.addFriend(fields.name, fields.number);
    }
    console.log(`[...] ✅ Друзья...: ${fields.name} (${fields.number})`);
  }

  // Сообщения
  async renderMyMessage(fields, message) {
    if (window.messageSender) {
      await window.messageSender.addMyMessage(fields.receiver, fields.number, fields.content);
    }
    console.log(`[...] ✅ ...Сообщения...: ... ${fields.receiver} (${fields.number})`);
  }

  // Сообщения
  async renderTheirMessage(fields, message) {
    if (window.messageSender) {
      await window.messageSender.addTheirMessage(fields.sender, fields.number, fields.content);
    }
    console.log(`[...] ✅ ...Сообщения...: ... ${fields.sender} (${fields.number})`);
  }

  // Сообщения
  async renderGroupMessage(fields, message) {
    if (window.groupRenderer) {
      await window.groupRenderer.addGroupMessage(fields.groupId, fields.sender, fields.content);
    }
    console.log(`[...] ✅ ...Сообщения...: ... ${fields.groupId}, ... ${fields.sender}`);
  }

  // Сообщения
  async renderMyGroupMessage(fields, message) {
    if (window.groupRenderer) {
      await window.groupRenderer.addMyGroupMessage(fields.groupId, fields.content);
    }
    console.log(`[...] ✅ ...Сообщения...: ... ${fields.groupId}`);
  }

  // Сообщения
  cacheMessageRender(message, extractedData) {
    const cacheKey = message.id;
    this.cachedRenderedMessages.set(cacheKey, {
      message: message,
      extractedData: extractedData,
      renderedAt: Date.now(),
      html: this.generateMessageHTML(extractedData),
    });
  }

  // СообщенияHTML
  generateMessageHTML(extractedData) {
    return extractedData
      .map(data => {
        return `<div class="rendered-format ${data.type}">${data.fullMatch}</div>`;
      })
      .join('');
  }

  // （）
  updateInterface() {
    try {
      // MessageApp ，Обновить
      if (window.messageApp) {
        this.updateMessageAppIncremental();
      }

      this.dispatchIncrementalUpdateEvent();
    } catch (error) {
      console.error('[error] error:', error);
    }
  }

  // MessageApp
  updateMessageAppIncremental() {
    try {
      // Друзья/* Список */НовоеСообщения
      if (window.messageApp.currentView === 'list') {
        this.updateFriendListIncremental();
      }

      // ЕслиСообщения/* Страница деталей */，Сообщения
      if (window.messageApp.currentView === 'messageDetail') {
        this.updateMessageDetailIncremental();
      }
    } catch (error) {
      console.error('[error] MessageApperror:', error);
    }
  }

  // Друзья/* Список */
  updateFriendListIncremental() {
    // НовоеСообщения，/* Список */
    const friendItems = document.querySelectorAll('.message-item');

    friendItems.forEach(item => {
      const friendId = item.getAttribute('data-friend-id');
      if (friendId) {
        this.updateUnreadCount(item, friendId);

        // НовоеСообщения
        this.updateLastMessagePreview(item, friendId);
      }
    });
  }

  // Сообщения
  updateMessageDetailIncremental() {
    // Сообщения/* Страница деталей */Сообщения，Сообщения
    const messageContainer = document.querySelector('.message-detail-content');
    if (messageContainer && window.messageApp.currentFriendId) {
      // Добавляем только новые сообщения
      this.appendNewMessageBubbles(messageContainer, window.messageApp.currentFriendId);
    }
  }

  // Сообщения
  appendNewMessageBubbles(container, friendId) {
    // Сообщения
    const recentMessages = this.getRecentMessagesForFriend(friendId);

    recentMessages.forEach(message => {
      const messageBubble = this.createMessageBubble(message);
      container.appendChild(messageBubble);
    });
  }

  // Сообщения
  createMessageBubble(messageData) {
    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${messageData.type}`;
    bubble.innerHTML = messageData.html;
    return bubble;
  }

  // Сообщения
  getCurrentMessages() {
    try {
      // window.chat Отменить
      if (window.chat && Array.isArray(window.chat)) {
        return window.chat;
      }

      // SillyTavern
      if (window.SillyTavern && typeof window.SillyTavern.getContext === 'function') {
        const context = window.SillyTavern.getContext();
        return context.chat || [];
      }

      return [];
    } catch (error) {
      console.error('[error] errorСообщенияerror:', error);
      return [];
    }
  }

  // СообщенияID
  generateMessageId(message, index) {
    // ID
    if (message.id) {
      return `msg_${message.id}`;
    }
    if (message.send_date) {
      return `msg_${message.send_date}_${index}`;
    }
    // Сообщения
    const contentHash = this.simpleHash(message.mes || '', index);
    return `msg_${contentHash}_${index}`;
  }

  simpleHash(str, seed = 0) {
    let hash = seed;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) & 0xffffffff;
    }
    return Math.abs(hash).toString(36);
  }

  dispatchIncrementalUpdateEvent() {
    try {
      const event = new CustomEvent('incrementalRenderUpdate', {
        detail: {
          timestamp: Date.now(),
          processedCount: this.processedMessageIds.size,
          lastIndex: this.lastProcessedMessageIndex,
          cacheSize: this.cachedRenderedMessages.size,
        },
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('[error] error:', error);
    }
  }

  // /
  setEnabled(enabled) {
    this.isEnabled = enabled;
    console.log(`[...] ${enabled ? '...' : '...'}`);
  }

  clearCache() {
    this.processedMessageIds.clear();
    this.cachedRenderedMessages.clear();
    this.lastProcessedMessageIndex = -1;
    console.log('[...] ...');
  }

  // Статус
  getStatus() {
    return {
      isEnabled: this.isEnabled,
      renderingInProgress: this.renderingInProgress,
      processedCount: this.processedMessageIds.size,
      cachedCount: this.cachedRenderedMessages.size,
      lastProcessedIndex: this.lastProcessedMessageIndex,
      hasFloorMonitor: !!this.floorMonitor,
    };
  }

  // Сообщения
  async forceProcessAll() {
    console.log('[...] ...Сообщения...');
    this.clearCache();
    this.initializeCache();

    const allMessages = this.getCurrentMessages();
    const newMessages = allMessages.map((msg, index) => ({
      ...msg,
      index: index,
      id: this.generateMessageId(msg, index),
    }));

    await this.processNewMessages(newMessages);
  }

  // Сообщения（SillyTavern）
  processNewMessages(sillyTavernMessages) {
    if (!Array.isArray(sillyTavernMessages)) {
      console.warn('[Incremental Renderer] errorСообщенияerror');
      return;
    }

    console.log(`[Incremental Renderer] ... ${sillyTavernMessages.length} ...SillyTavernСообщения`);

    let newMessagesFound = 0;

    sillyTavernMessages.forEach((message, index) => {
      const messageId = this.generateMessageId(message, index);

      // Сообщения
      if (!this.processedMessageIds.has(messageId)) {
        // SillyTavernСообщения
        const convertedMessage = this.convertSillyTavernMessage(message, index);

        if (convertedMessage) {
          // Сообщения
          this.processMessage(convertedMessage);
          newMessagesFound++;
        }
      }
    });

    if (newMessagesFound > 0) {
      console.log(`[Incremental Renderer] ✅ ... ${newMessagesFound} ...Сообщения`);

      this.dispatchUpdateEvent({
        type: 'sillytavern_messages',
        newMessageCount: newMessagesFound,
        totalMessages: sillyTavernMessages.length,
      });
    }
  }

  // SillyTavernСообщения
  convertSillyTavernMessage(sillyMessage, index) {
    try {
      // SillyTavernСообщения/* Структура */：
      // {
      // mes: "Сообщения",
      // name: "",
      //   is_user: boolean,
      //   send_date: timestamp,
      //   extra: { ... }
      // }

      const messageText = sillyMessage.mes || '';

      // QQ
      const formats = this.extractAllFormats(messageText);

      if (formats.length === 0) {
        // ЕслиQQ，Сообщения
        return {
          id: this.generateMessageId(sillyMessage, index),
          type: 'plain_text',
          content: messageText,
          sender: sillyMessage.name || 'Unknown',
          isUser: sillyMessage.is_user || false,
          timestamp: sillyMessage.send_date || Date.now(),
          formats: [],
        };
      }

      return {
        id: this.generateMessageId(sillyMessage, index),
        type: 'qq_format',
        content: messageText,
        sender: sillyMessage.name || 'Unknown',
        isUser: sillyMessage.is_user || false,
        timestamp: sillyMessage.send_date || Date.now(),
        formats: formats,
      };
    } catch (error) {
      console.error('[Incremental Renderer] errorSillyTavernСообщенияerror:', error);
      return null;
    }
  }

  // SillyTavernСообщенияID
  generateMessageId(sillyMessage, index) {
    // ID
    if (sillyMessage.send_date) {
      return `st_${sillyMessage.send_date}_${index}`;
    }

    if (sillyMessage.id) {
      return `st_${sillyMessage.id}`;
    }

    const content = sillyMessage.mes || '';
    const hash = this.simpleHash(content + index + (sillyMessage.name || ''));
    return `st_${hash}_${index}`;
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // ...32...
    }
    return Math.abs(hash).toString(36);
  }
}

window.IncrementalRenderer = IncrementalRenderer;

window.createIncrementalRenderer = function () {
  if (!window.incrementalRenderer) {
    window.incrementalRenderer = new IncrementalRenderer();
  }
  return window.incrementalRenderer;
};

console.log('[...] ...');

// Экспорт класса
if (typeof module !== 'undefined' && module.exports) {
  module.exports = IncrementalRenderer;
}
