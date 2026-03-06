/**
 * Real-time Sync - ...
 * ...，...，...
 */

class RealTimeSync {
  constructor() {
    this.isRunning = false;
    this.lastSyncTime = 0;
    this.syncInterval = 200000; // ... 2...
    this.syncTimer = null;

    // Статус
    this.lastMessageCount = 0;
    this.lastChatId = null;
    this.processedMessages = new Set(); // ...СообщенияID
    this.lastFriendCount = 0;
    this.processedFriends = new Set(); // ...ДрузьяID

    // Статус
    this.isIncrementalMode = true;
    this.maxProcessedMessages = 1000; // ...Сообщения...
    this.maxProcessedFriends = 200; // ...Друзья...

    console.log('[Real-time Sync] ...');
  }

  start() {
    if (this.isRunning) {
      console.log('[Real-time Sync] ...');
      return;
    }

    this.isRunning = true;
    console.log('[Real-time Sync] 🚀 ...');

    this.performSync();

    // Настройки
    this.syncTimer = setInterval(() => {
      this.performSync();
    }, this.syncInterval);

    // SillyTavern
    this.setupEventListeners();
  }

  stop() {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    console.log('[Real-time Sync] ⏹️ ...');

    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }

    this.removeEventListeners();
  }

  async performSync() {
    try {
      const startTime = Date.now();

      if (!this.checkDependencies()) {
        return;
      }

      // Статус
      const contextState = await this.getCurrentContextState();
      if (!contextState) {
        return;
      }

      const hasChanges = this.detectChanges(contextState);
      if (!hasChanges) {
        return;
      }

      if (window.DEBUG_REAL_TIME_SYNC) {
        console.log('[Real-time Sync] 🔄 ...，...');
      }

      await this.performIncrementalSync(contextState);

      // Статус
      this.updateSyncState(contextState);

      const duration = Date.now() - startTime;
      if (window.DEBUG_REAL_TIME_SYNC) {
        console.log(`[Real-time Sync] ✅ ...，... ${duration}ms`);
      }
    } catch (error) {
      console.error('[Real-time Sync] error:', error);
    }
  }

  checkDependencies() {
    const dependencies = ['contextMonitor', 'friendRenderer', 'messageApp'];

    for (const dep of dependencies) {
      if (!window[dep]) {
        console.warn(`[Real-time Sync] error ${dep} error`);
        return false;
      }
    }

    return true;
  }

  // Статус
  async getCurrentContextState() {
    try {
      // Сообщения
      const chatData = await window.contextMonitor.getCurrentChatMessages();
      if (!chatData) {
        return null;
      }

      // Друзья
      const friendData = await this.extractFriendData();

      return {
        chatId: chatData.chatId,
        messageCount: chatData.totalMessages,
        messages: chatData.messages,
        friendCount: friendData.length,
        friends: friendData,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('[Real-time Sync] errorСтатусerror:', error);
      return null;
    }
  }

  // Друзья
  async extractFriendData() {
    try {
      if (!window.friendRenderer) {
        return [];
      }

      const friends = window.friendRenderer.extractFriendsFromContext();
      return friends || [];
    } catch (error) {
      console.error('[Real-time Sync] errorДрузьяerror:', error);
      return [];
    }
  }

  detectChanges(contextState) {
    if (!contextState) {
      return false;
    }

    if (contextState.chatId !== this.lastChatId) {
      console.log('[Real-time Sync] 📱 ...');
      this.clearCache(); // ...
      return true;
    }

    // Сообщения
    if (contextState.messageCount !== this.lastMessageCount) {
      console.log(`[Real-time Sync] 📨 ...Сообщения...: ${this.lastMessageCount} -> ${contextState.messageCount}`);
      return true;
    }

    // Друзья
    if (contextState.friendCount !== this.lastFriendCount) {
      console.log(`[Real-time Sync] 👥 ...Друзья...: ${this.lastFriendCount} -> ${contextState.friendCount}`);
      return true;
    }

    // Сообщения（，）
    const hasNewMessages = this.detectNewMessages(contextState.messages);
    if (hasNewMessages) {
      if (window.DEBUG_REAL_TIME_SYNC) {
        console.log('[Real-time Sync] 🆕 ...Сообщения...');
      }
      return true;
    }

    // Друзья
    const hasNewFriends = this.detectNewFriends(contextState.friends);
    if (hasNewFriends) {
      console.log('[Real-time Sync] 🆕 ...Друзья');
      return true;
    }

    return false;
  }

  // Сообщения
  detectNewMessages(messages) {
    if (!messages || messages.length === 0) {
      return false;
    }

    let hasNew = false;

    for (const message of messages) {
      const messageId = this.generateMessageId(message);
      if (!this.processedMessages.has(messageId)) {
        hasNew = true;
        break;
      }
    }

    return hasNew;
  }

  // Друзья
  detectNewFriends(friends) {
    if (!friends || friends.length === 0) {
      return false;
    }

    let hasNew = false;

    for (const friend of friends) {
      const friendId = friend.number || friend.id;
      if (friendId && !this.processedFriends.has(friendId)) {
        hasNew = true;
        break;
      }
    }

    return hasNew;
  }

  // СообщенияID
  generateMessageId(message) {
    if (message.id) {
      return message.id;
    }

    // СообщенияID
    const content = message.mes || message.content || '';
    const timestamp = message.send_date || message.timestamp || Date.now();
    return `${content.substring(0, 50)}_${timestamp}`;
  }

  async performIncrementalSync(contextState) {
    try {
      const hasNewMessages = this.detectNewMessages(contextState.messages);
      const hasNewFriends = this.detectNewFriends(contextState.friends);

      if (window.DEBUG_REAL_TIME_SYNC) {
        console.log(`[Real-time Sync] ...: ...Сообщения=${hasNewMessages}, ...Друзья=${hasNewFriends}`);
      }

      // Сообщения
      await this.processNewMessages(contextState.messages);

      // Друзья
      await this.processNewFriends(contextState.friends);

      // Message App，
      await this.triggerIncrementalRender(contextState, hasNewMessages, hasNewFriends);
    } catch (error) {
      console.error('[Real-time Sync] error:', error);
    }
  }

  // Сообщения
  async processNewMessages(messages) {
    if (!messages || messages.length === 0) {
      return;
    }

    const newMessages = [];

    for (const message of messages) {
      const messageId = this.generateMessageId(message);
      if (!this.processedMessages.has(messageId)) {
        newMessages.push(message);
        this.processedMessages.add(messageId);
      }
    }

    if (newMessages.length > 0) {
      if (window.DEBUG_REAL_TIME_SYNC) {
        console.log(`[Real-time Sync] 📨 ... ${newMessages.length} ...Сообщения`);
      }

      this.cleanupProcessedMessages();
    }
  }

  // Друзья
  async processNewFriends(friends) {
    if (!friends || friends.length === 0) {
      return;
    }

    const newFriends = [];

    for (const friend of friends) {
      const friendId = friend.number || friend.id;
      if (friendId && !this.processedFriends.has(friendId)) {
        newFriends.push(friend);
        this.processedFriends.add(friendId);
      }
    }

    if (newFriends.length > 0) {
      console.log(`[Real-time Sync] 👥 ... ${newFriends.length} ...Друзья`);

      this.cleanupProcessedFriends();
    }
  }

  async triggerIncrementalRender(contextState, hasNewMessages = false, hasNewFriends = false) {
    try {
      if (window.DEBUG_REAL_TIME_SYNC) {
        console.log(`[Real-time Sync] 🎯 ...: ...Сообщения=${hasNewMessages}, ...Друзья=${hasNewFriends}`);
      }

      // ЕслиMessage App
      if (window.messageApp) {
        // Message App
        if (typeof window.messageApp.handleIncrementalUpdate === 'function') {
          window.messageApp.handleIncrementalUpdate({
            eventType: 'sync_update',
            chatData: {
              messages: contextState.messages,
              friends: contextState.friends,
              messageCount: contextState.messageCount,
              friendCount: contextState.friendCount,
            },
            timestamp: contextState.timestamp,
            hasNewMessages,
            hasNewFriends,
          });
        }

        // ЕслиСообщенияДрузья，
        if (hasNewMessages || hasNewFriends) {
          if (window.DEBUG_REAL_TIME_SYNC) {
            console.log('[Real-time Sync] 🔄 ...，...');
          }
          if (typeof window.messageApp.refreshFriendListUI === 'function') {
            window.messageApp.refreshFriendListUI();
          }
        } else {
          if (typeof window.messageApp.triggerLightweightUpdate === 'function') {
            window.messageApp.triggerLightweightUpdate();
          }
        }
      }

      // ，
      this.dispatchSyncEvent(contextState, hasNewMessages, hasNewFriends);
    } catch (error) {
      console.error('[Real-time Sync] error:', error);
    }
  }

  dispatchSyncEvent(contextState, hasNewMessages = false, hasNewFriends = false) {
    try {
      if (window.DEBUG_REAL_TIME_SYNC) {
        console.log(`[Real-time Sync] 📡 ...: ...Сообщения=${hasNewMessages}, ...Друзья=${hasNewFriends}`);
      }

      const event = new CustomEvent('realTimeSyncUpdate', {
        detail: {
          chatId: contextState.chatId,
          messageCount: contextState.messageCount,
          friendCount: contextState.friendCount,
          hasNewMessages: hasNewMessages,
          hasNewFriends: hasNewFriends,
          timestamp: contextState.timestamp,
          syncMode: 'incremental',
        },
      });

      window.dispatchEvent(event);
    } catch (error) {
      console.error('[Real-time Sync] error:', error);
    }
  }

  // Статус
  updateSyncState(contextState) {
    this.lastChatId = contextState.chatId;
    this.lastMessageCount = contextState.messageCount;
    this.lastFriendCount = contextState.friendCount;
    this.lastSyncTime = contextState.timestamp;
  }

  clearCache() {
    this.processedMessages.clear();
    this.processedFriends.clear();
    this.lastMessageCount = 0;
    this.lastFriendCount = 0;
    console.log('[Real-time Sync] 🗑️ ...');
  }

  // Сообщения
  cleanupProcessedMessages() {
    if (this.processedMessages.size > this.maxProcessedMessages) {
      const messagesToRemove = this.processedMessages.size - this.maxProcessedMessages;
      const messageArray = Array.from(this.processedMessages);

      // Сообщения
      for (let i = 0; i < messagesToRemove; i++) {
        this.processedMessages.delete(messageArray[i]);
      }

      console.log(`[Real-time Sync] 🧹 ... ${messagesToRemove} ...Сообщения...`);
    }
  }

  // Друзья
  cleanupProcessedFriends() {
    if (this.processedFriends.size > this.maxProcessedFriends) {
      const friendsToRemove = this.processedFriends.size - this.maxProcessedFriends;
      const friendArray = Array.from(this.processedFriends);

      // Друзья
      for (let i = 0; i < friendsToRemove; i++) {
        this.processedFriends.delete(friendArray[i]);
      }

      console.log(`[Real-time Sync] 🧹 ... ${friendsToRemove} ...Друзья...`);
    }
  }

  // Настройки
  setupEventListeners() {
    // SillyTavern（）
    if (window.eventSource && window.event_types) {
      try {
        // Сообщения
        window.eventSource.on(window.event_types.MESSAGE_RECEIVED, () => {
          console.log('[Real-time Sync] 🔥 ...MESSAGE_RECEIVED...');
          this.triggerImmediateSync();
        });

        window.eventSource.on(window.event_types.CHAT_CHANGED, () => {
          console.log('[Real-time Sync] 🔄 ...CHAT_CHANGED...');
          this.clearCache();
          this.triggerImmediateSync();
        });

        console.log('[Real-time Sync] ✅ SillyTavern...Настройки');
      } catch (error) {
        console.warn('[Real-time Sync] НастройкиSillyTavernerror:', error);
      }
    }

    window.addEventListener('messageAppRender', () => {
      console.log('[Real-time Sync] ...messageAppRender...');
      this.triggerImmediateSync();
    });

    window.addEventListener('contextMonitorUpdate', () => {
      console.log('[Real-time Sync] ...contextMonitorUpdate...');
      this.triggerImmediateSync();
    });
  }

  removeEventListeners() {
    console.log('[Real-time Sync] ...');
  }

  triggerImmediateSync() {
    if (!this.isRunning) {
      return;
    }

    const now = Date.now();
    if (now - this.lastSyncTime < 500) {
      return;
    }

    console.log('[Real-time Sync] ⚡ ...');
    this.performSync();
  }

  // Настройки
  setSyncInterval(interval) {
    this.syncInterval = Math.max(100000, interval); // ...1...

    if (this.isRunning) {
      if (this.syncTimer) {
        clearInterval(this.syncTimer);
      }

      this.syncTimer = setInterval(() => {
        this.performSync();
      }, this.syncInterval);
    }

    console.log(`[Real-time Sync] ...Настройки... ${this.syncInterval}ms`);
  }

  // Статус
  getSyncStatus() {
    return {
      isRunning: this.isRunning,
      syncInterval: this.syncInterval,
      lastSyncTime: this.lastSyncTime,
      lastChatId: this.lastChatId,
      lastMessageCount: this.lastMessageCount,
      lastFriendCount: this.lastFriendCount,
      processedMessagesCount: this.processedMessages.size,
      processedFriendsCount: this.processedFriends.size,
      isIncrementalMode: this.isIncrementalMode,
    };
  }

  async forceFullSync() {
    console.log('[Real-time Sync] 🔄 ...');

    const originalMode = this.isIncrementalMode;
    this.isIncrementalMode = false;

    this.clearCache();

    await this.performSync();

    this.isIncrementalMode = originalMode;

    console.log('[Real-time Sync] ✅ ...');
  }
}

if (typeof window.RealTimeSync === 'undefined') {
  window.RealTimeSync = RealTimeSync;

  window.realTimeSync = new RealTimeSync();

  // （）
  setTimeout(() => {
    if (window.realTimeSync && !window.realTimeSync.isRunning) {
      window.realTimeSync.start();
    }
  }, 3000); // 3...

  console.log('[Real-time Sync] ...');
}
