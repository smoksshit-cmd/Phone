// ==SillyTavern Forum Auto Listener==
// @name         Forum Auto Listener for Mobile Extension
// @version      1.0.1
// @description Форум，Форум
// @author       Assistant

/**
 * Форум...
 * ...，...Форум...
 *
 * ...：
 * - checkIntervalMs: ...Время（...，...5000）
 * - debounceMs: ...Время（...，...500）
 * - immediateOnThreshold: ...（...true）
 * - enabled: ...（...true）
 * - maxRetries: ...（...3）
 * - autoStartWithUI: ...（...true）
 */
class ForumAutoListener {
  constructor() {
    this.isListening = false;
    this.lastMessageCount = 0;
    this.lastCheckTime = Date.now();
    this.checkInterval = null; // ...null，...
    this.debounceTimer = null;
    this.isProcessingRequest = false; // ...：...
    this.lastProcessedMessageCount = 0; // ...：...Сообщения...
    this.currentStatus = '...'; // ...：...Статус
    this.statusElement = null; // ...：/* Отображение статуса */...
    this.lastGenerationTime = null; // ...：...Время
    this.generationCount = 0; // ...：...
    this.uiObserver = null; // ...：...
    this.settings = {
      enabled: true,
      checkIntervalMs: 5000, // 5...
      debounceMs: 500, // ...0.5...（...2...0.5...）
      immediateOnThreshold: true, // ...：...
      maxRetries: 3,
      autoStartWithUI: true, // ...：...
    };

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.checkForChanges = this.checkForChanges.bind(this);
    this.safeDebounceAutoGenerate = this.safeDebounceAutoGenerate.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.initStatusDisplay = this.initStatusDisplay.bind(this);
    this.setupUIObserver = this.setupUIObserver.bind(this); // ...：Настройки...
    this.checkForumAppState = this.checkForumAppState.bind(this); // ...：...Форум/* Приложение */Статус
  }

  /**
   * ...
   */
  start() {
    if (this.isListening) {
      console.log('[Reddit/Forum Auto Listener] ...');
      return;
    }

    try {
      console.log('[Reddit/Forum Auto Listener] ......');

      // /* Отображение статуса */
      this.initStatusDisplay();

      // Статус
      this.updateStatus('...', 'info');

      // Сообщения
      this.initializeMessageCount();

      // Настройки
      this.checkInterval = setInterval(this.checkForChanges, this.settings.checkIntervalMs);

      // SillyTavern（）
      this.setupEventListeners();

      this.isListening = true;
      this.updateStatus('...', 'success');
      console.log('[Reddit/Forum Auto Listener] ✅ ...');
    } catch (error) {
      console.error('[Reddit/Forum Auto Listener] error:', error);
      this.updateStatus('...', 'error');
    }
  }

  /**
   * ...
   */
  stop() {
    if (!this.isListening) {
      console.log('[Reddit/Forum Auto Listener] ...');
      return;
    }

    try {
      console.log('[Reddit/Forum Auto Listener] ......');
      this.updateStatus('...', 'warning');

      if (this.checkInterval) {
        clearInterval(this.checkInterval);
        this.checkInterval = null;
      }

      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = null;
      }

      this.removeEventListeners();

      // Статус
      this.isProcessingRequest = false;

      this.isListening = false;
      this.updateStatus('...', 'offline');
      console.log('[Reddit/Forum Auto Listener] ✅ ...');
    } catch (error) {
      console.error('[Reddit/Forum Auto Listener] error:', error);
      this.updateStatus('...', 'error');
    }
  }

  /**
   * ...Сообщения...
   */
  async initializeMessageCount() {
    try {
      if (window.forumManager) {
        const chatData = await window.forumManager.getCurrentChatData();
        if (chatData && chatData.messages) {
          this.lastMessageCount = chatData.messages.length;
          // ：lastProcessedMessageCount，Сообщения
          // this.lastProcessedMessageCount = chatData.messages.length;
          console.log(`[Reddit/Forum Auto Listener] ...Сообщения...: ${this.lastMessageCount}`);
        }
      } else {
        // ：SillyTavern
        const chatData = this.getCurrentChatDataDirect();
        if (chatData && chatData.messages) {
          this.lastMessageCount = chatData.messages.length;
          console.log(`[Reddit/Forum Auto Listener] ...Сообщения...(...): ${this.lastMessageCount}`);
        }
      }
    } catch (error) {
      console.warn('[Reddit/Forum Auto Listener] errorСообщенияerror:', error);
    }
  }

  /**
   * ... - ...
   */
  async checkForChanges() {
    // Если，Назад
    if (!this.isListening || !this.settings.enabled) {
      return;
    }

    // SillyTavernСообщения，
    if (this.isSillyTavernBusy()) {
      console.log('[Reddit/Forum Auto Listener] SillyTavern...Сообщения，......');
      return;
    }

    // Если，
    if (this.isProcessingRequest) {
      console.log('[Reddit/Forum Auto Listener] ...，...');
      return;
    }

    try {
      // -
      let chatData = null;
      if (window.forumManager && window.forumManager.getCurrentChatData) {
        chatData = await window.forumManager.getCurrentChatData();
      } else {
        // ：SillyTavern
        chatData = this.getCurrentChatDataDirect();
      }

      if (!chatData || !chatData.messages) {
        return;
      }

      const currentMessageCount = chatData.messages.length;

      // Сообщения（：lastMessageCountlastProcessedMessageCount）
      const messageIncrement = currentMessageCount - this.lastMessageCount;

      if (messageIncrement > 0) {
        console.log(
          `[Reddit/Forum Auto Listener] ...Сообщения: +${messageIncrement} (${this.lastMessageCount} -> ${currentMessageCount})`,
        );

        // （Форум，）
        const threshold =
          window.forumManager && window.forumManager.currentSettings
            ? window.forumManager.currentSettings.threshold
            : 1; // ...1

        console.log(`[Reddit/Forum Auto Listener] ...: ${threshold}`);

        // （：lastMessageCount）
        this.lastMessageCount = currentMessageCount;
        this.lastCheckTime = Date.now();

        if (messageIncrement >= threshold) {
          console.log(`[Reddit/Forum Auto Listener] ...，...`);
          this.updateStatus(`... (...:${threshold})`, 'processing');

          // ：forumManagerСтатус
          console.log(`[Reddit/Forum Auto Listener] ... - forumManager...: ${!!window.forumManager}`);
          console.log(
            `[Reddit/Forum Auto Listener] ... - checkAutoGenerate...: ${!!(
              window.forumManager && window.forumManager.checkAutoGenerate
            )}`,
          );
          console.log(`[Reddit/Forum Auto Listener] ... - isProcessingRequest: ${this.isProcessingRequest}`);

          // УведомлениеФорум
          if (window.forumManager && window.forumManager.checkAutoGenerate) {
            console.log(`[Reddit/Forum Auto Listener] ...safeDebounceAutoGenerate(true)`);
            try {
              // ，
              this.safeDebounceAutoGenerate(true);
              console.log(`[Reddit/Forum Auto Listener] safeDebounceAutoGenerate...`);
            } catch (error) {
              console.error(`[Reddit/Forum Auto Listener] safeDebounceAutoGenerateerror:`, error);
              this.updateStatus('...', 'error');
            }
          } else {
            console.warn(
              `[Reddit/Forum Auto Listener] ... - forumManager: ${!!window.forumManager}, checkAutoGenerate: ${!!(
                window.forumManager && window.forumManager.checkAutoGenerate
              )}`,
            );
            this.updateStatus('Форум...', 'warning');
          }
        } else {
          console.log(`[Reddit/Forum Auto Listener] ... ${messageIncrement} ... ${threshold}`);
          this.updateStatus(`... (${messageIncrement}/${threshold})`, 'info');
        }
      } else if (messageIncrement === 0) {
        // Сообщения
        if (window.DEBUG_FORUM_AUTO_LISTENER) {
          console.log(`[Reddit/Forum Auto Listener] ...Сообщения (...: ${currentMessageCount})`);
        }
      }
    } catch (error) {
      console.error('[Reddit/Forum Auto Listener] error:', error);
    }
  }

  /**
   * ... - ...
   * @param {boolean} immediate - ...，...
   */
  safeDebounceAutoGenerate(immediate = false) {
    // Если，
    if (this.isProcessingRequest) {
      console.log('[Reddit/Forum Auto Listener] ...，...');
      return;
    }

    // ЕслиНастройки，
    if (immediate || this.settings.immediateOnThreshold) {
      console.log('[Reddit/Forum Auto Listener] ......');
      this.executeAutoGenerate();
      return;
    }

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // Настройки
    this.debounceTimer = setTimeout(async () => {
      this.executeAutoGenerate();
    }, this.settings.debounceMs);
  }

  /**
   * ...
   */
  async executeAutoGenerate() {
    if (this.isProcessingRequest) {
      console.log('[Reddit/Forum Auto Listener] ...，...');
      return;
    }

    console.log('[Reddit/Forum Auto Listener] ......');

    try {
      // Форум（）
      if (!window.forumManager) {
        console.log('[Reddit/Forum Auto Listener] Форум...，......');
        this.updateStatus('...Форум...', 'processing');
        await this.initializeRedditForumManager();
      }

      // ФорумСтатус
      if (window.forumManager && window.forumManager.isProcessing) {
        console.log('[Reddit/Forum Auto Listener] Форум...，...');
        this.updateStatus('...Форум...', 'waiting');
        return;
      }

      // НастройкиСтатус - ФорумНастройки
      this.isProcessingRequest = true;

      // - Статус
      if (window.forumManager && window.forumManager.checkAutoGenerate) {
        console.log('[Reddit/Forum Auto Listener] ...Форум...checkAutoGenerate...');
        this.updateStatus('...Форум...', 'processing');

        // Статус
        const originalProcessingState = this.isProcessingRequest;
        this.isProcessingRequest = false;

        // НастройкиФорум
        window.forumAutoListener._allowRedditForumManagerCall = true;

        try {
          await window.forumManager.checkAutoGenerate();
          console.log('[Reddit/Forum Auto Listener] Форум...');
          this.generationCount++;
          this.lastGenerationTime = new Date();
          this.updateStatus(`... (#${this.generationCount})`, 'success');
        } finally {
          // Статус
          this.isProcessingRequest = originalProcessingState;
          delete window.forumAutoListener._allowRedditForumManagerCall;
        }
      } else {
        // ЕслиФорум，
        console.log('[Reddit/Forum Auto Listener] Форум...，...Форум......');
        this.updateStatus('...Форум...', 'processing');
        await this.directForumGenerate();
        this.generationCount++;
        this.lastGenerationTime = new Date();
        this.updateStatus(`... (#${this.generationCount})`, 'success');
      }

      // Сообщения
      // ：，
      // this.lastProcessedMessageCount = this.lastMessageCount;
      console.log(`[Reddit/Forum Auto Listener] ...，...Сообщения`);

      // Статус
      setTimeout(() => {
        if (this.isListening) {
          this.updateStatus('...', 'success');
        }
      }, 2000);
    } catch (error) {
      console.error('[Reddit/Forum Auto Listener] error:', error);
      this.updateStatus('...', 'error');
    } finally {
      this.isProcessingRequest = false;
    }
  }

  /**
   * ...Форум...
   */
  async initializeRedditForumManager() {
    try {
      console.log('[Reddit/Forum Auto Listener] ...Форум......');

      // Форум
      const forumScripts = [
        '/scripts/extensions/third-party/mobile/app/forum-app/forum-manager.js',
        '/scripts/extensions/third-party/mobile/app/forum-app/forum-app.js',
      ];

      for (const scriptPath of forumScripts) {
        if (!document.querySelector(`script[src*="${scriptPath}"]`)) {
          console.log(`[Reddit/Forum Auto Listener] ...: ${scriptPath}`);
          await this.loadScript(scriptPath);
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Форум
      if (window.RedditForumManager && !window.forumManager) {
        console.log('[Reddit/Forum Auto Listener] ...Форум......');
        window.forumManager = new window.RedditForumManager();
        if (window.forumManager.initialize) {
          await window.forumManager.initialize();
        }
      }

      if (window.forumManager) {
        console.log('[Reddit/Forum Auto Listener] ✅ Форум...');
      } else {
        console.warn('[Reddit/Forum Auto Listener] ⚠️ Форумerror');
      }
    } catch (error) {
      console.error('[Reddit/Forum Auto Listener] errorФорумerror:', error);
    }
  }

  /**
   * ...
   */
  async loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /**
   * ...Форум...（...Форум...）
   */
  async directForumGenerate() {
    try {
      console.log('[Reddit/Forum Auto Listener] ...Форум......');

      const context = window.getContext ? window.getContext() : null;
      if (!context || !context.chat) {
        console.warn('[Reddit/Forum Auto Listener] error');
        return;
      }

      // Форум
      const forumPrompt = this.buildForumPrompt(context.chat);

      if (window.generateQuietPrompt) {
        console.log('[Reddit/Forum Auto Listener] ...generateQuietPrompt...Форум......');
        const forumContent = await window.generateQuietPrompt(forumPrompt, false, false);

        if (forumContent) {
          console.log('[Reddit/Forum Auto Listener] ✅ Форум...');
          // СохранитьФорум
          this.displayForumContent(forumContent);
        } else {
          console.warn('[Reddit/Forum Auto Listener] Форумerror');
        }
      } else {
        console.warn('[Reddit/Forum Auto Listener] generateQuietPrompterror');
      }
    } catch (error) {
      console.error('[Reddit/Forum Auto Listener] errorФорумerror:', error);
    }
  }

  /**
   * ...Форум...
   */
  buildForumPrompt(chatMessages) {
    const recentMessages = chatMessages.slice(-10); // ...10...Сообщения

    let prompt = '...，...Форум...Пост。...：\n\n';

    recentMessages.forEach((msg, index) => {
      if (!msg.is_system) {
        prompt += `${msg.name || 'Пользователь'}: ${msg.mes}\n`;
      }
    });

    prompt += '\n...Форум...：';

    return prompt;
  }

  /**
   * ...Форум...
   */
  displayForumContent(content) {
    try {
      // УведомлениеПользователь
      console.log('[Reddit/Forum Auto Listener] Форум...:', content);

      // Сообщения
      if (window.sendSystemMessage) {
        window.sendSystemMessage('GENERIC', `🏛️ Форум...：\n\n${content}`);
      } else {
        // Уведомление
        if (window.toastr) {
          window.toastr.success('Форум...', 'Форум...');
        }
      }
    } catch (error) {
      console.error('[Reddit/Forum Auto Listener] errorФорумerror:', error);
    }
  }

  /**
   * ...SillyTavern...（...Сообщения...）
   */
  isSillyTavernBusy() {
    try {
      // Сообщения
      if (typeof window.is_send_press !== 'undefined' && window.is_send_press) {
        return true;
      }

      // Сообщения
      if (typeof window.is_generating !== 'undefined' && window.is_generating) {
        return true;
      }

      // Статус
      if (window.streamingProcessor && !window.streamingProcessor.isFinished) {
        return true;
      }

      // Статус
      if (typeof window.is_group_generating !== 'undefined' && window.is_group_generating) {
        return true;
      }

      return false;
    } catch (error) {
      console.warn('[Reddit/Forum Auto Listener] errorSillyTavernСтатусerror:', error);
      return false; // Если...，...
    }
  }

  /**
   * ...SillyTavern...
   */
  getCurrentChatDataDirect() {
    try {
      // chat
      if (typeof window.chat !== 'undefined' && Array.isArray(window.chat)) {
        return {
          messages: window.chat,
          characterName: window.name2 || '...',
          chatId: window.getCurrentChatId ? window.getCurrentChatId() : 'unknown',
        };
      }

      // context
      if (window.getContext) {
        const context = window.getContext();
        if (context && context.chat) {
          return {
            messages: context.chat,
            characterName: context.name2 || '...',
            chatId: context.chatId || 'unknown',
          };
        }
      }

      console.warn('[Reddit/Forum Auto Listener] error');
      return null;
    } catch (error) {
      console.error('[Reddit/Forum Auto Listener] error:', error);
      return null;
    }
  }

  /**
   * ... - ...
   */
  debounceAutoGenerate() {
    this.safeDebounceAutoGenerate();
  }

  /**
   * ...Форум...（...Статус...）
   */
  async manualTrigger() {
    console.log('[Reddit/Forum Auto Listener] ...Форум......');
    this.updateStatus('...', 'processing');

    try {
      // Форум（）
      if (!window.forumManager) {
        console.log('[Reddit/Forum Auto Listener] Форум...，......');
        this.updateStatus('...Форум...', 'processing');
        await this.initializeRedditForumManager();
      }

      // Форум，Статус
      if (window.forumManager && window.forumManager.checkAutoGenerate) {
        console.log('[Reddit/Forum Auto Listener] ...Форум......');
        this.updateStatus('...Форум...', 'processing');

        // НастройкиФорум
        window.forumAutoListener._allowRedditForumManagerCall = true;

        try {
          await window.forumManager.checkAutoGenerate();
          console.log('[Reddit/Forum Auto Listener] ✅ Форум...');
          this.generationCount++;
          this.lastGenerationTime = new Date();
          this.updateStatus(`... (#${this.generationCount})`, 'success');
        } finally {
          delete window.forumAutoListener._allowRedditForumManagerCall;
        }
      } else if (window.forumManager && window.forumManager.manualGenerate) {
        console.log('[Reddit/Forum Auto Listener] ......');
        this.updateStatus('...', 'processing');

        // Настройки
        window.forumAutoListener._allowRedditForumManagerCall = true;

        try {
          await window.forumManager.manualGenerate();
          console.log('[Reddit/Forum Auto Listener] ✅ ...');
          this.generationCount++;
          this.lastGenerationTime = new Date();
          this.updateStatus(`... (#${this.generationCount})`, 'success');
        } finally {
          delete window.forumAutoListener._allowRedditForumManagerCall;
        }
      } else {
        // ЕслиФорум，
        console.log('[Reddit/Forum Auto Listener] Форум...，...Форум......');
        this.updateStatus('...Форум...', 'processing');
        await this.directForumGenerate();
        this.generationCount++;
        this.lastGenerationTime = new Date();
        this.updateStatus(`... (#${this.generationCount})`, 'success');
      }

      // Статус
      setTimeout(() => {
        if (this.isListening) {
          this.updateStatus('...', 'success');
        }
      }, 2000);
    } catch (error) {
      console.error('[Reddit/Forum Auto Listener] error:', error);
      this.updateStatus('...', 'error');
    }
  }

  /**
   * Настройки...
   */
  setupEventListeners() {
    try {
      // SillyTavernСообщения（）
      if (window.eventSource && window.event_types) {
        // Сообщения
        if (window.event_types.MESSAGE_RECEIVED) {
          this.messageReceivedHandler = this.onMessageReceived.bind(this);
          window.eventSource.on(window.event_types.MESSAGE_RECEIVED, this.messageReceivedHandler);
        }

        // Сообщения
        if (window.event_types.MESSAGE_SENT) {
          this.messageSentHandler = this.onMessageSent.bind(this);
          window.eventSource.on(window.event_types.MESSAGE_SENT, this.messageSentHandler);
        }

        console.log('[Reddit/Forum Auto Listener] SillyTavern...Настройки');
      } else {
        console.log('[Reddit/Forum Auto Listener] SillyTavern...，...');
      }

      // НастройкиDOM，
      // this.setupDOMObserver();
    } catch (error) {
      console.warn('[Reddit/Forum Auto Listener] Настройкиerror:', error);
    }
  }

  /**
   * ...
   */
  removeEventListeners() {
    try {
      // SillyTavern
      if (window.eventSource) {
        if (this.messageReceivedHandler) {
          window.eventSource.off(window.event_types.MESSAGE_RECEIVED, this.messageReceivedHandler);
        }
        if (this.messageSentHandler) {
          window.eventSource.off(window.event_types.MESSAGE_SENT, this.messageSentHandler);
        }
      }

      // DOM
      if (this.domObserver) {
        this.domObserver.disconnect();
        this.domObserver = null;
      }

      console.log('[Reddit/Forum Auto Listener] ...');
    } catch (error) {
      console.warn('[Reddit/Forum Auto Listener] error:', error);
    }
  }

  /**
   * Сообщения... - ...：...
   */
  onMessageReceived(data) {
    console.log('[Reddit/Forum Auto Listener] ...Сообщения...:', data);
    // ，
    // this.lastMessageCount++;
    // ，
    this.safeDebounceAutoGenerate();
  }

  /**
   * Сообщения... - ...：...
   */
  onMessageSent(data) {
    console.log('[Reddit/Forum Auto Listener] ...Сообщения...:', data);
    // ，
    // this.lastMessageCount++;
    // ，
    this.safeDebounceAutoGenerate();
  }

  /**
   * НастройкиDOM...（...，...）
   */
  setupDOMObserver() {
    // DOM
    console.log('[Reddit/Forum Auto Listener] DOM...，...');
    return;

    try {
      const chatContainer =
        document.querySelector('#chat') ||
        document.querySelector('.chat-container') ||
        document.querySelector('[data-testid="chat"]');

      if (chatContainer) {
        this.domObserver = new MutationObserver(mutations => {
          let hasNewMessage = false;

          mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
              // Сообщения
              mutation.addedNodes.forEach(node => {
                if (
                  node.nodeType === Node.ELEMENT_NODE &&
                  (node.classList.contains('message') ||
                    node.querySelector('.message') ||
                    node.classList.contains('mes'))
                ) {
                  hasNewMessage = true;
                }
              });
            }
          });

          if (hasNewMessage) {
            console.log('[Reddit/Forum Auto Listener] DOM...Сообщения');
            this.safeDebounceAutoGenerate();
          }
        });

        this.domObserver.observe(chatContainer, {
          childList: true,
          subtree: true,
        });

        console.log('[Reddit/Forum Auto Listener] DOM...Настройки');
      } else {
        console.warn('[Reddit/Forum Auto Listener] error，errorНастройкиDOMerror');
      }
    } catch (error) {
      console.warn('[Reddit/Forum Auto Listener] НастройкиDOMerror:', error);
    }
  }

  /**
   * Настройки... - ...Форум...
   */
  setupUIObserver() {
    if (!this.settings.autoStartWithUI) {
      console.log('[Reddit/Forum Auto Listener] ...');
      return;
    }

    try {
      console.log('[Reddit/Forum Auto Listener] Настройки......');

      // Статус，

      document.removeEventListener('click', this._clickHandler);

      this._clickHandler = event => {
        // Форум/* Приложение */
        const forumAppButton = event.target.closest('[data-app="forum"]');
        if (forumAppButton) {
          console.log('[Reddit/Forum Auto Listener] ...Форум/* Приложение */...');
          // DOMВремя
          setTimeout(() => {
            if (!this.isListening) {
              console.log('[Reddit/Forum Auto Listener] ...');
              this.start();
            }
          }, 300);
        }

        // НазадЗакрыть
        const backButton = event.target.closest('.back-button');
        const closeButton = event.target.closest(
          '.mobile-phone-overlay, .close-button, .drawer-close, [data-action="close"]',
        );
        if (backButton || closeButton) {
          console.log('[Reddit/Forum Auto Listener] ...Назад...Закрыть...');
          if (this.isListening) {
            console.log('[Reddit/Forum Auto Listener] ...');
            this.stop();
          }
        }
      };

      document.addEventListener('click', this._clickHandler);

      console.log('[Reddit/Forum Auto Listener] ...Настройки - ...Форум...');

      // MutationObserverСтатус
      if (this.uiObserver) {
        this.uiObserver.disconnect();
        this.uiObserver = null;
      }
    } catch (error) {
      console.error('[Reddit/Forum Auto Listener] Настройкиerror:', error);
    }
  }

  /**
   * ...Форум/* Приложение */Статус - ...Форум...
   */
  checkForumAppState() {
    // Статус，
    console.log('[Reddit/Forum Auto Listener] Статус...');
  }

  /**
   * Настройки...
   * @param {boolean} enabled - ...
   */
  setAutoStartWithUI(enabled) {
    this.settings.autoStartWithUI = enabled;
    console.log(`[Reddit/Forum Auto Listener] ...Настройки...: ${enabled}`);

    if (enabled) {
      this.setupUIObserver();
      // Статус
      this.checkForumAppState();
    } else if (this.uiObserver) {
      // Если，
      this.uiObserver.disconnect();
      this.uiObserver = null;
    }
  }

  /**
   * ...Настройки
   */
  updateSettings(newSettings) {
    const oldAutoStartWithUI = this.settings.autoStartWithUI;

    this.settings = { ...this.settings, ...newSettings };

    // Если，
    if (newSettings.checkIntervalMs && this.isListening) {
      if (this.checkInterval) {
        clearInterval(this.checkInterval);
      }
      this.checkInterval = setInterval(this.checkForChanges, this.settings.checkIntervalMs);
    }

    // ЕслиНастройки
    if (newSettings.autoStartWithUI !== undefined && newSettings.autoStartWithUI !== oldAutoStartWithUI) {
      this.setAutoStartWithUI(newSettings.autoStartWithUI);
    }
  }

  /**
   * Настройки...（...）
   * @param {boolean} immediate - ...
   */
  setImmediateOnThreshold(immediate) {
    this.settings.immediateOnThreshold = immediate;
    console.log(`[Reddit/Forum Auto Listener] ...Настройки...: ${immediate}`);
  }

  /**
   * Настройки...Время
   * @param {number} delayMs - ...Время（...）
   */
  setDebounceDelay(delayMs) {
    this.settings.debounceMs = delayMs;
    console.log(`[Reddit/Forum Auto Listener] ...Время...: ${delayMs}ms`);
  }

  /**
   * ...Статус
   */
  getStatus() {
    return {
      isListening: this.isListening,
      isProcessingRequest: this.isProcessingRequest,
      lastMessageCount: this.lastMessageCount,
      lastProcessedMessageCount: this.lastProcessedMessageCount,
      lastCheckTime: this.lastCheckTime,
      settings: this.settings,
    };
  }

  /**
   * ...
   */
  getDebugInfo() {
    return {
      ...this.getStatus(),
      hasCheckInterval: !!this.checkInterval,
      hasDebounceTimer: !!this.debounceTimer,
      hasMessageReceivedHandler: !!this.messageReceivedHandler,
      hasMessageSentHandler: !!this.messageSentHandler,
      hasDOMObserver: !!this.domObserver,
      timeSinceLastCheck: Date.now() - this.lastCheckTime,
    };
  }

  /**
   * ...
   */
  async forceCheck() {
    console.log('[Reddit/Forum Auto Listener] ......');
    await this.checkForChanges();
  }

  /**
   * ...Статус
   */
  reset() {
    this.lastMessageCount = 0;
    this.lastProcessedMessageCount = 0;
    this.lastCheckTime = Date.now();
    this.isProcessingRequest = false;

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    console.log('[Reddit/Forum Auto Listener] Статус...');
  }

  /**
   * ... - Статус...
   */
  ensureContinuousListening() {
    // ，Статус

    // ЕслиСтатус，
    if (this.isProcessingRequest) {
      const now = Date.now();
      const timeSinceLastCheck = now - this.lastCheckTime;

      // Если30Статус，
      if (timeSinceLastCheck > 30000) {
        console.warn('[Reddit/Forum Auto Listener] errorСтатусerror，errorСтатус...');
        this.isProcessingRequest = false;
        this.lastCheckTime = now;
      }
    }

    // （）
    if (this.isListening && !this.checkInterval) {
      console.warn('[Reddit/Forum Auto Listener] error，errorНастройки...');
      this.checkInterval = setInterval(this.checkForChanges, this.settings.checkIntervalMs);
    }
  }

  /**
   * ...Форум... - ...Форум...
   * @returns {boolean} ...
   */
  isRedditForumManagerCallAllowed() {
    if (window.forumAutoListener && window.forumAutoListener._allowRedditForumManagerCall) {
      return true;
    }

    // Если，
    return !this.isProcessingRequest;
  }

  /**
   * ...Форум...
   */
  async safeRedditForumManagerCall(callback) {
    if (!callback || typeof callback !== 'function') {
      throw new Error('error');
    }

    // Настройки
    window.forumAutoListener._allowRedditForumManagerCall = true;

    // Статус
    const originalState = this.isProcessingRequest;
    this.isProcessingRequest = false;

    try {
      console.log('[Reddit/Forum Auto Listener] ...Форум......');
      const result = await callback();
      console.log('[Reddit/Forum Auto Listener] ...');
      return result;
    } finally {
      // Статус
      this.isProcessingRequest = originalState;
      delete window.forumAutoListener._allowRedditForumManagerCall;
    }
  }

  /**
   * .../* Отображение статуса */
   */
  initStatusDisplay() {
    try {
      // Статус
      let statusContainer = document.getElementById('forum-auto-listener-status');

      if (!statusContainer) {
        // /* Отображение статуса */
        statusContainer = document.createElement('div');
        statusContainer.id = 'forum-auto-listener-status';
        statusContainer.className = 'forum-status-container';

        // Статус
        statusContainer.innerHTML = `
                    <div class="forum-status-header">
                        <span class="forum-status-icon">🤖</span>
                        <span class="forum-status-title">Форум...</span>
                    </div>
                    <div class="forum-status-content">
                        <div class="forum-status-line">
                            <span class="forum-status-label">Статус:</span>
                            <span class="forum-status-value" id="forum-listener-status">...</span>
                            <span class="forum-status-indicator" id="forum-listener-indicator"></span>
                        </div>
                        <div class="forum-status-line">
                            <span class="forum-status-label">...:</span>
                            <span class="forum-status-value" id="forum-listener-count">0</span>
                        </div>
                        <div class="forum-status-line">
                            <span class="forum-status-label">...:</span>
                            <span class="forum-status-value" id="forum-listener-time">...</span>
                        </div>
                    </div>
                `;

        const style = document.createElement('style');
        style.textContent = `
                    .forum-status-container {
                        background: #2d3748;
                        border: 1px solid #4a5568;
                        border-radius: 8px;
                        padding: 12px;
                        margin: 8px;
                        color: #e2e8f0;
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        font-size: 12px;
                        max-width: 300px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);display: none !important;
                    }
                    .forum-status-header {
                        display: flex;
                        align-items: center;
                        margin-bottom: 8px;
                        font-weight: bold;
                        border-bottom: 1px solid #4a5568;
                        padding-bottom: 6px;
                    }
                    .forum-status-icon {
                        margin-right: 6px;
                        font-size: 14px;
                    }
                    .forum-status-title {
                        color: #63b3ed;
                    }
                    .forum-status-line {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin: 4px 0;
                    }
                    .forum-status-label {
                        color: #a0aec0;
                        flex-shrink: 0;
                        margin-right: 8px;
                    }
                    .forum-status-value {
                        flex-grow: 1;
                        text-align: right;
                        margin-right: 6px;
                    }
                    .forum-status-indicator {
                        display: inline-block;
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        flex-shrink: 0;
                    }
                    .status-success { background-color: #48bb78; }
                    .status-error { background-color: #f56565; }
                    .status-warning { background-color: #ed8936; }
                    .status-info { background-color: #4299e1; }
                    .status-processing { background-color: #9f7aea; }
                    .status-waiting { background-color: #ecc94b; }
                    .status-offline { background-color: #718096; }
                `;

        if (!document.head.querySelector('#forum-auto-listener-styles')) {
          style.id = 'forum-auto-listener-styles';
          document.head.appendChild(style);
        }

        const targetContainer =
          document.getElementById('extensions_settings') ||
          document.getElementById('floatingPrompt') ||
          document.getElementById('left-nav-panel') ||
          document.body;

        targetContainer.appendChild(statusContainer);
        console.log('[Reddit/Forum Auto Listener] /* Отображение статуса */...');
      }

      this.statusElement = statusContainer;
    } catch (error) {
      console.warn('[Reddit/Forum Auto Listener] error/* Отображение статуса */error:', error);
    }
  }

  /**
   * .../* Отображение статуса */
   * @param {string} status - Статус...
   * @param {string} type - Статус... (success, error, warning, info, processing, waiting, offline)
   */
  updateStatus(status, type = 'info') {
    try {
      this.currentStatus = status;

      const statusValueElement = document.getElementById('forum-listener-status');
      const statusIndicatorElement = document.getElementById('forum-listener-indicator');
      const countElement = document.getElementById('forum-listener-count');
      const timeElement = document.getElementById('forum-listener-time');

      if (statusValueElement) {
        statusValueElement.textContent = status;
      }

      if (statusIndicatorElement) {
        // Статус
        statusIndicatorElement.className = 'forum-status-indicator';
        // Статус
        statusIndicatorElement.classList.add(`status-${type}`);
      }

      if (countElement) {
        countElement.textContent = this.generationCount.toString();
      }

      if (timeElement && this.lastGenerationTime) {
        timeElement.textContent = this.lastGenerationTime.toLocaleTimeString();
      }

      const statusIcon = this.getStatusIcon(type);
      console.log(`[Reddit/Forum Auto Listener] ${statusIcon} ${status}`);
    } catch (error) {
      console.warn('[Reddit/Forum Auto Listener] error/* Отображение статуса */error:', error);
    }
  }

  /**
   * ...Статус...
   * @param {string} type - Статус...
   * @returns {string} Статус...
   */
  getStatusIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
      processing: '⏳',
      waiting: '⏸️',
      offline: '⭕',
    };
    return icons[type] || 'ℹ️';
  }

  /**
   * ...Статус...
   */
  getDetailedStatus() {
    return {
      ...this.getStatus(),
      currentStatus: this.currentStatus,
      generationCount: this.generationCount,
      lastGenerationTime: this.lastGenerationTime,
      hasStatusDisplay: !!this.statusElement,
    };
  }
}

window.ForumAutoListener = ForumAutoListener;
window.forumAutoListener = new ForumAutoListener();

// Статус
window.showForumAutoListenerStatus = () => {
  const status = window.forumAutoListener.getDetailedStatus();
  console.table(status);
  return status;
};

// Экспорт класса
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ForumAutoListener;
}

// Настройки
setTimeout(() => {
  try {
    console.log('[Reddit/Forum Auto Listener] Настройки......');
    if (window.forumAutoListener) {
      if (window.forumAutoListener.checkInterval) {
        clearInterval(window.forumAutoListener.checkInterval);
        window.forumAutoListener.checkInterval = null;
        console.log('[Reddit/Forum Auto Listener] ...');
      }

      window.forumAutoListener.setupUIObserver();

      console.log('[Reddit/Forum Auto Listener] ......');
      if (!window.forumAutoListener.isListening) {
        window.forumAutoListener.start();
        console.log('[Reddit/Forum Auto Listener] ✅ ...');
      }
    }
  } catch (error) {
    console.error('[Reddit/Forum Auto Listener] Настройкиerror:', error);
  }
}, 2000); // ...2...DOM...

// ，
// ，Пользователь

console.log('[Reddit/Forum Auto Listener] Форум...');
console.log('[Reddit/Forum Auto Listener] 🔧 ...:');
console.log('[Reddit/Forum Auto Listener]   ✅ ...：...');
console.log('[Reddit/Forum Auto Listener]   ✅ ...：...Назад...Закрыть...');
console.log('[Reddit/Forum Auto Listener]   ✅ ...：...SillyTavern...');
console.log('[Reddit/Forum Auto Listener]   ✅ ...：...');
console.log('[Reddit/Forum Auto Listener]   ✅ Статус...：..."Auto-listener..."...');
console.log('[Reddit/Forum Auto Listener]   ✅ /* Отображение статуса */：...Статус');
console.log('[Reddit/Forum Auto Listener] 💡 ...: window.forumAutoListener.manualTrigger()');
console.log('[Reddit/Forum Auto Listener] 📊 Статус...: window.showForumAutoListenerStatus()');
console.log('[Reddit/Forum Auto Listener] 🔧 Статус...: window.forumAutoListener.isRedditForumManagerCallAllowed()');
console.log('[Reddit/Forum Auto Listener] 📊 Статус...：..."Форум..."Статус...');
console.log('[Reddit/Forum Auto Listener] 🚀 ...，Форум...！Статус...！');
