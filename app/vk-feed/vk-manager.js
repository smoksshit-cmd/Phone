// ==SillyTavern VkFeed Manager==
// @name         VkFeed Manager for Mobile Extension
// @version      1.0.0
// @description ВКонтакте
// @author       Assistant

if (typeof window.VkFeedManager !== 'undefined') {
  console.log('[VkFeed Manager] ...，...');
} else {
  /**
   * ВКонтакте...
   * ...ВКонтакте...、API...Редактировать...
   */
  class VkFeedManager {
    constructor() {
      this.isInitialized = false;
      this.currentSettings = {
        enabled: true,
        autoUpdate: true,
        threshold: 10,
        apiConfig: {
          url: '',
          apiKey: '',
          model: '',
        },
      };
      this.isProcessing = false;
      this.lastProcessedCount = 0;

      // Пользователь
      this.currentAccount = {
        isMainAccount: true, // true...，false...
        mainAccountName: '{{user}}', // ...Пользователь...
        aliasAccountName: 'Alias', // ...Пользователь...
        currentPage: 'hot', // ...：hot, ranking, user
      };

      // Статус
      this.isMonitoringGeneration = false;
      this.pendingInsertions = [];
      this.generationCheckInterval = null;
      this.statusUpdateTimer = null;
      this.maxWaitTime = 300000; // ...Время: 5...

      // -
      this.retryConfig = {
        maxRetries: 0, // ...
        retryDelay: 60000, // ...: 1...（...）
        currentRetryCount: 0, // ...
        lastFailTime: null, // ...Время
        autoRetryEnabled: false, // ...
      };

      this.initialize = this.initialize.bind(this);
      this.generateVkFeedContent = this.generateVkFeedContent.bind(this);
      this.updateContextWithVkFeed = this.updateContextWithVkFeed.bind(this);
      this.checkGenerationStatus = this.checkGenerationStatus.bind(this);
      this.waitForGenerationComplete = this.waitForGenerationComplete.bind(this);
      this.processInsertionQueue = this.processInsertionQueue.bind(this);
      this.scheduleRetry = this.scheduleRetry.bind(this);
    }

    /**
     * ...ВКонтакте...
     */
    async initialize() {
      try {
        console.log('[VkFeed Manager] ......');

        // Настройки
        this.loadSettings();

        await this.waitForDependencies();

        // Настройки
        this.loadAccountSettings();

        this.isInitialized = true;
        console.log('[VkFeed Manager] ✅ ...');

        this.detectBrowserAndShowTips();
      } catch (error) {
        console.error('[VkFeed Manager] error:', error);
      }
    }

    /**
     * ...
     */
    detectBrowserAndShowTips() {
      const userAgent = navigator.userAgent;
      const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
      const isVia = /Via/.test(userAgent);

      if (isSafari || isVia) {
        console.log('%c🍎 Safari/Via...', 'color: #ff6b6b; font-weight: bold; font-size: 14px;');
        console.log(
          '%c...，...: MobileContext.fixBrowserCompatibility()',
          'color: #4ecdc4; font-size: 12px;',
        );
        console.log('%cЕщё...: MobileContext.quickDiagnosis()', 'color: #45b7d1; font-size: 12px;');
      }
    }

    /**
     * ... - ...，...
     */
    async waitForDependencies() {
      return new Promise(resolve => {
        let checkCount = 0;
        const maxChecks = 20; // ...20...（10...）
        let lastLogTime = 0;

        const checkDeps = () => {
          checkCount++;
          const contextEditorReady = window.mobileContextEditor !== undefined;
          const customAPIReady = window.mobileCustomAPIConfig !== undefined;
          let vk_feedStylesReady = window.vk_feedStyles !== undefined;

          // 🔧 vk_feedStyles ，
          if (!vk_feedStylesReady) {
            if (typeof window.VkFeedStyles !== 'undefined') {
              console.log('[VkFeed Manager] 🔧 ... VkFeedStyles ...，......');
              try {
                window.vk_feedStyles = new window.VkFeedStyles();
                vk_feedStylesReady = true;
                console.log('[VkFeed Manager] ✅ ... vk_feedStyles ...');
              } catch (error) {
                console.error('[VkFeed Manager] ❌ error vk_feedStyles error:', error);
              }
            } else {
              // VkFeedStyles ，
              console.log('[VkFeed Manager] 🔄 VkFeedStyles ...，... vk_feed-styles.js...');
              try {
                const script = document.createElement('script');
                script.src = './scripts/extensions/third-party/mobile/app/vk_feed-app/vk_feed-styles.js';
                script.async = false; // ...

                // Promise
                const loadPromise = new Promise(resolve => {
                  script.onload = () => {
                    console.log('[VkFeed Manager] ✅ ... vk_feed-styles.js ...');
                    if (typeof window.vk_feedStyles !== 'undefined') {
                      vk_feedStylesReady = true;
                      console.log('[VkFeed Manager] ✅ vk_feedStyles ...');
                    }
                    resolve();
                  };
                  script.onerror = () => {
                    console.error('[VkFeed Manager] ❌ error vk_feed-styles.js error');
                    resolve();
                  };
                });

                document.head.appendChild(script);

                // Время（）
                setTimeout(() => {
                  vk_feedStylesReady = window.vk_feedStyles !== undefined;
                }, 100);
              } catch (error) {
                console.error('[VkFeed Manager] ❌ error:', error);
              }
            }
          }

          if (contextEditorReady && customAPIReady && vk_feedStylesReady) {
            console.log('[VkFeed Manager] ✅ ...');
            resolve();
            return;
          }

          if (checkCount >= maxChecks) {
            console.warn('[VkFeed Manager] ⚠️ error，error（error）');
            console.log('[VkFeed Manager] 🔍 ...Статус:', {
              contextEditor: contextEditorReady,
              customAPI: customAPIReady,
              vk_feedStyles: vk_feedStylesReady,
              vk_feedStylesType: typeof window.vk_feedStyles,
              vk_feedStylesClass: typeof window.VkFeedStyles,
              allVkFeedKeys: Object.keys(window).filter(key => key.toLowerCase().includes('vk_feed')),
            });
            resolve();
            return;
          }

          // ：1、5、10、15
          const shouldLog = checkCount === 1 || checkCount === 5 || checkCount === 10 || checkCount === 15;
          if (shouldLog) {
            console.log(`[VkFeed Manager] ... (${checkCount}/${maxChecks})...`, {
              contextEditor: contextEditorReady,
              customAPI: customAPIReady,
              vk_feedStyles: vk_feedStylesReady,
              vk_feedStylesType: typeof window.vk_feedStyles,
              vk_feedStylesClass: typeof window.VkFeedStyles,
            });
          }

          setTimeout(checkDeps, 500);
        };

        checkDeps();
      });
    }

    /**
     * ...Настройки
     */
    loadSettings() {
      try {
        const saved = localStorage.getItem('mobile_vk_feed_settings');
        if (saved) {
          const settings = JSON.parse(saved);
          this.currentSettings = { ...this.currentSettings, ...settings };
          console.log('[VkFeed Manager] Настройки...:', this.currentSettings);
        }
      } catch (error) {
        console.warn('[VkFeed Manager] errorНастройкиerror:', error);
      }
    }

    /**
     * СохранитьНастройки
     */
    saveSettings() {
      try {
        localStorage.setItem('mobile_vk_feed_settings', JSON.stringify(this.currentSettings));
        console.log('[VkFeed Manager] Настройки...Сохранить:', this.currentSettings);
      } catch (error) {
        console.warn('[VkFeed Manager] СохранитьНастройкиerror:', error);
      }
    }

    /**
     * ...Настройки
     */
    loadAccountSettings() {
      try {
        const saved = localStorage.getItem('mobile_vk_feed_account');
        if (saved) {
          const account = JSON.parse(saved);
          this.currentAccount = { ...this.currentAccount, ...account };
          console.log('[VkFeed Manager] ...Настройки...:', this.currentAccount);
        }
      } catch (error) {
        console.warn('[VkFeed Manager] errorНастройкиerror:', error);
      }
    }

    /**
     * Сохранить...Настройки
     */
    saveAccountSettings() {
      try {
        localStorage.setItem('mobile_vk_feed_account', JSON.stringify(this.currentAccount));
        console.log('[VkFeed Manager] ...Настройки...Сохранить:', this.currentAccount);
      } catch (error) {
        console.warn('[VkFeed Manager] СохранитьerrorНастройкиerror:', error);
      }
    }

    /**
     * ...（.../...）
     */
    switchAccount() {
      this.currentAccount.isMainAccount = !this.currentAccount.isMainAccount;
      this.saveAccountSettings();

      // Редактировать
      this.updateAccountStatusInContext();

      console.log('[VkFeed Manager] ...:', this.currentAccount.isMainAccount ? '...' : '...');
      return this.currentAccount.isMainAccount;
    }

    /**
     * НастройкиПользователь...
     */
    setUsername(username, isMainAccount = null) {
      if (isMainAccount === null) {
        isMainAccount = this.currentAccount.isMainAccount;
      }

      if (isMainAccount) {
        this.currentAccount.mainAccountName = username || '{{user}}';
      } else {
        this.currentAccount.aliasAccountName = username || 'Alias';
      }

      this.saveAccountSettings();
      console.log('[VkFeed Manager] Пользователь...:', {
        isMainAccount,
        username: isMainAccount ? this.currentAccount.mainAccountName : this.currentAccount.aliasAccountName,
      });
    }

    /**
     * ...Пользователь...
     */
    getCurrentUsername() {
      return this.currentAccount.isMainAccount
        ? this.currentAccount.mainAccountName
        : this.currentAccount.aliasAccountName;
    }

    /**
     * Настройки...
     */
    setCurrentPage(page) {
      if (['hot', 'ranking', 'user'].includes(page)) {
        this.currentAccount.currentPage = page;
        this.saveAccountSettings();
        console.log('[VkFeed Manager] ...Настройки:', page);
      }
    }

    /**
     * ...Редактировать...Статус...
     */
    async updateAccountStatusInContext() {
      try {
        if (!window.mobileContextEditor) {
          console.warn('[VkFeed Manager] errorРедактироватьerror，errorСтатус');
          return;
        }

        const accountStatus = this.currentAccount.isMainAccount ? '...' : '...';
        const renderValue = `...ВКонтакте...：${accountStatus}`;

        // Редактировать
        // РедактироватьAPI
        console.log('[VkFeed Manager] ...Статус...:', renderValue);
      } catch (error) {
        console.error('[VkFeed Manager] errorСтатусerror:', error);
      }
    }

    /**
     * ...ВКонтакте...
     */
    async generateVkFeedContent(force = false) {
      const caller = force ? '...' : '...';
      console.log(`[VkFeed Manager] 📞 ...: ${caller}`);

      // 🔧 API -
      if (!this.isAPIConfigValid()) {
        const errorMsg = '...API';
        console.warn(`[VkFeed Manager] ❌ APIerror: ${errorMsg}`);

        // Если，，
        if (!force) {
          console.log('[VkFeed Manager] ...API...，...，...');
          // auto-listener，
          if (window.vk_feedAutoListener) {
            window.vk_feedAutoListener.disable();
            console.log('[VkFeed Manager] ...auto-listener，...');
          }
          return false;
        }

        this.updateStatus(`...: ${errorMsg}`, 'error');
        if (window.showMobileToast) {
          window.showMobileToast(`❌ ВКонтакте...: ${errorMsg}`, 'error');
        }
        return false;
      }

      // Если，auto-listener
      if (force && window.vk_feedAutoListener) {
        if (window.vk_feedAutoListener.isProcessingRequest) {
          console.log('[VkFeed Manager] ⚠️ auto-listener...，...');
        }
        window.vk_feedAutoListener.isProcessingRequest = true;
        console.log('[VkFeed Manager] 🚫 ...auto-listener...');
      }

      // - Safari
      if (this.isProcessing) {
        console.log('[VkFeed Manager] ...，...Safari......');

        // Safari：，Статус
        if (force) {
          console.log('[VkFeed Manager] 🍎 Safari...：...Статус');
          this.isProcessing = false;
          if (window.vk_feedAutoListener) {
            window.vk_feedAutoListener.isProcessingRequest = false;
          }
          // ，Назадfalse
        } else {
          console.log('[VkFeed Manager] ...，...');
          this.updateStatus('...，......', 'warning');

          // Если，auto-listenerСтатус
          if (force && window.vk_feedAutoListener) {
            window.vk_feedAutoListener.isProcessingRequest = false;
          }
          return false;
        }
      }

      // Если，auto-listener
      let autoListenerPaused = false;
      if (force && window.vk_feedAutoListener && window.vk_feedAutoListener.isListening) {
        autoListenerPaused = true;
        // Настройки，auto-listener
        window.vk_feedAutoListener.isProcessingRequest = true;
        console.log('[VkFeed Manager] 🔄 ...auto-listener（Настройки...）');
      }

      // Сообщения
      try {
        const chatData = await this.getCurrentChatData();
        if (!chatData || !chatData.messages || chatData.messages.length === 0) {
          console.log('[VkFeed Manager] ...，...');
          return false;
        }

        // Сообщения
        if (!force) {
          // Сообщения
          const currentCount = chatData.messages.length;
          const increment = currentCount - this.lastProcessedCount;

          if (increment < this.currentSettings.threshold) {
            console.log(
              `[VkFeed Manager] [...] Сообщения... (${increment}/${this.currentSettings.threshold})，...`,
            );
            return false;
          }
        } else {
          console.log('[VkFeed Manager] 🚀 ...，...Сообщения...');
        }

        this.isProcessing = true;
        this.updateStatus('...ВКонтакте......', 'info');

        const currentCount = chatData.messages.length;
        const increment = currentCount - this.lastProcessedCount;
        console.log(
          `[VkFeed Manager] ...ВКонтакте... (Сообщения...: ${currentCount}, ...: ${increment}, ...: ${force})`,
        );

        // APIВКонтакте
        const vk_feedContent = await this.callVkFeedAPI(chatData);
        if (!vk_feedContent) {
          throw new Error('APIНазадerror');
        }

        // Редактировать1（Статус）
        const success = await this.safeUpdateContextWithVkFeed(vk_feedContent);
        if (success) {
          this.updateStatus('ВКонтакте...1...', 'success');
          this.lastProcessedCount = currentCount;

          // Синхронизация сauto-listener
          if (window.vk_feedAutoListener) {
            window.vk_feedAutoListener.lastProcessedMessageCount = currentCount;
          }

          // ОбновитьВКонтактеUI
          this.clearVkFeedUICache();

          console.log(`[VkFeed Manager] ✅ ВКонтакте...`);
          return true;
        } else {
          throw new Error('error');
        }
      } catch (error) {
        // 🔧 -
        console.error('[VkFeed Manager] errorВКонтактеerror:', error);
        this.updateStatus(`...: ${error.message}`, 'error');

        // ЕслиAPI，auto-listener
        if (error.message.includes('...API') || error.message.includes('API...')) {
          if (window.vk_feedAutoListener && !force) {
            window.vk_feedAutoListener.disable();
            console.log('[VkFeed Manager] API...，...auto-listener');
          }
        }

        if (force && window.showMobileToast) {
          window.showMobileToast(`❌ ВКонтакте...: ${error.message}`, 'error');
        } else if (!force) {
          console.log('[VkFeed Manager] ...，...，...Пользователь');
        }

        this.resetRetryConfig();

        console.log('[VkFeed Manager] ⏳ ...Отменить...，...');
        return false;
      } finally {
        // Статус
        this.isProcessing = false;

        // auto-listener
        if (autoListenerPaused && force) {
          setTimeout(() => {
            if (window.vk_feedAutoListener) {
              window.vk_feedAutoListener.isProcessingRequest = false;
              console.log('[VkFeed Manager] 🔄 ...auto-listener（...）');
            }
          }, 2000); // 2...，...
        }

        // Статус，
        setTimeout(() => {
          if (this.isProcessing) {
            console.warn('[VkFeed Manager] errorСтатус');
            this.isProcessing = false;
          }
        }, 5000);

        // Уведомлениеauto-listener
        if (window.vk_feedAutoListener) {
          window.vk_feedAutoListener.isProcessingRequest = false;
        }
      }
    }

    /**
     * ...
     */
    async getCurrentChatData() {
      try {
        if (window.mobileContextEditor) {
          return window.mobileContextEditor.getCurrentChatData();
        } else if (window.MobileContext) {
          return await window.MobileContext.loadChatToEditor();
        } else {
          throw new Error('errorРедактироватьerror');
        }
      } catch (error) {
        console.error('[VkFeed Manager] error:', error);
        throw error;
      }
    }

    /**
     * ...API...（...Gemini URL...）
     */
    isAPIConfigValid() {
      if (!window.mobileCustomAPIConfig) {
        console.warn('[VkFeed Manager] mobileCustomAPIConfig error');
        return false;
      }

      const config = window.mobileCustomAPIConfig;
      const settings = config.currentSettings;

      if (!settings.enabled) {
        console.warn('[VkFeed Manager] APIerror');
        return false;
      }

      if (!settings.model) {
        console.warn('[VkFeed Manager] error');
        return false;
      }

      // API（）
      const providerConfig = config.supportedProviders[settings.provider];
      if (providerConfig?.requiresKey && !settings.apiKey) {
        console.warn('[VkFeed Manager] errorAPIerror');
        return false;
      }

      // API URL - Gemini URL
      let apiUrl;
      if (settings.provider === 'gemini') {
        // GeminiURL
        apiUrl = config.geminiUrl || config.supportedProviders.gemini.defaultUrl;
      } else {
        // URL
        apiUrl = settings.apiUrl || providerConfig?.defaultUrl;
      }

      if (!apiUrl) {
        console.warn('[VkFeed Manager] errorAPI URL');
        return false;
      }

      console.log('[VkFeed Manager] ✅ API...:', {
        provider: settings.provider,
        hasApiKey: !!settings.apiKey,
        hasModel: !!settings.model,
        hasUrl: !!apiUrl,
        enabled: settings.enabled
      });

      return true;
    }

    /**
     * ...ВКонтактеAPI
     */
    async callVkFeedAPI(chatData) {
      try {
        console.log('🚀 [ВКонтактеAPI] ===== ...ВКонтакте... =====');

        // API
        if (!this.isAPIConfigValid()) {
          throw new Error('errorAPI');
        }

        const contextInfo = this.buildContextInfo(chatData);

        // （ВКонтакте）
        const stylePrompt = window.vk_feedStyles
          ? window.vk_feedStyles.getStylePrompt(
              'generate',
              this.currentAccount.isMainAccount,
              this.currentAccount.currentPage,
            )
          : '';

        console.log('📋 [ВКонтактеAPI] ...（...ВКонтакте）:');
        console.log(stylePrompt);
        console.log('\n📝 [ВКонтактеAPI] ПользовательСообщения...:');
        console.log(`...ВКонтакте...：\n\n${contextInfo}`);

        // API
        const messages = [
          {
            role: 'system',
            content: `${stylePrompt}\n\n🎯 【...】：\n- ...ПодписатьсяПользователь...，...⭐...\n- ...Пользователь...、...\n- ...ВКонтакте...Пользователь...\n- ...Пользователь...，...ВКонтакте...`,
          },
          {
            role: 'user',
            content: `🎯 ...ВКонтакте...，...Пользователь...：\n\n${contextInfo}`,
          },
        ];

        console.log('📡 [ВКонтактеAPI] ...API...:');
        console.log(JSON.stringify(messages, null, 2));

        // API
        const response = await window.mobileCustomAPIConfig.callAPI(messages, {
          temperature: 0.8,
          max_tokens: 2000,
        });

        console.log('📥 [ВКонтактеAPI] ...Назад...:');
        console.log(response);

        if (response && response.content) {
          console.log('✅ [ВКонтактеAPI] ...ВКонтакте...:');
          console.log(response.content);
          console.log('🏁 [ВКонтактеAPI] ===== ВКонтакте... =====\n');
          return response.content;
        } else {
          throw new Error('APIНазадerror');
        }
      } catch (error) {
        console.error('❌ [ВКонтактеAPI] APIerror:', error);
        console.log('🏁 [ВКонтактеAPI] ===== ВКонтакте... =====\n');
        throw error;
      }
    }

    /**
     * ...（...5...1...）
     */
    buildContextInfo(chatData) {
      let contextInfo = `...: ${chatData.characterName || '...'}\n`;
      contextInfo += `Сообщения...: ${chatData.messages.length}\n`;
      contextInfo += `...: ${this.currentAccount.isMainAccount ? '...' : '...'}\n`;
      contextInfo += `...Пользователь...: ${this.getCurrentUsername()}\n`;
      contextInfo += `...: ${this.currentAccount.currentPage}\n\n`;

      const messages = chatData.messages;
      const selectedMessages = [];

      // 1. 1（0），，/* Список */
      if (messages.length > 0 && messages[0].mes && messages[0].mes.trim()) {
        let firstFloorContent = messages[0].mes;

        // ВКонтакте
        const vk_feedRegex = /<!-- WEIBO_CONTENT_START -->([\s\S]*?)<!-- WEIBO_CONTENT_END -->/;
        const vk_feedMatch = firstFloorContent.match(vk_feedRegex);
        const hasVkFeedContent = !!vk_feedMatch;

        // ЕслиВКонтакте，ВКонтакте
        if (hasVkFeedContent) {
          firstFloorContent = vk_feedMatch[1].trim(); // ...
          console.log('📋 [...] ...1...：...ВКонтакте...');
          console.log('...:', firstFloorContent);
        } else {
          console.log('📋 [...] ...1...：...ВКонтакте...，...');
        }

        selectedMessages.push({
          ...messages[0],
          mes: firstFloorContent,
          floor: 1,
          isFirstFloor: true,
          hasVkFeedContent: hasVkFeedContent,
        });
      }

      // 2. 3Сообщения（1，）
      const lastThreeMessages = messages.slice(-3);
      lastThreeMessages.forEach((msg, index) => {
        // 1（）
        if (messages.indexOf(msg) !== 0) {
          selectedMessages.push({
            ...msg,
            floor: messages.indexOf(msg) + 1,
            isRecentMessage: true,
          });
        }
      });

      // 3.
      const uniqueMessages = [];
      const addedIndices = new Set();

      selectedMessages.forEach(msg => {
        const originalIndex = messages.findIndex(m => m === msg || (m.mes === msg.mes && m.is_user === msg.is_user));
        if (!addedIndices.has(originalIndex)) {
          addedIndices.add(originalIndex);
          uniqueMessages.push({
            ...msg,
            originalIndex,
          });
        }
      });

      uniqueMessages.sort((a, b) => a.originalIndex - b.originalIndex);

      // 4. Пользователь
      const userMessages = uniqueMessages.filter(msg => msg.is_user);
      const userVkFeedPosts = [];
      const userReplies = [];

      userMessages.forEach(msg => {
        if (msg.isFirstFloor && msg.hasVkFeedContent) {
          userVkFeedPosts.push(msg);
        } else if (msg.mes && msg.mes.trim()) {
          userReplies.push(msg);
        }
      });

      // 5.
      contextInfo += '...:\n';

      // ПользовательВКонтакте
      if (userVkFeedPosts.length > 0 || userReplies.length > 0) {
        contextInfo += '\n⭐ 【...Подписаться：ПользовательВКонтакте...】\n';

        if (userVkFeedPosts.length > 0) {
          contextInfo += '👤 Пользователь...：\n';
          userVkFeedPosts.forEach(msg => {
            contextInfo += `  📝 [Пользователь...] ${msg.mes}\n`;
          });
          contextInfo += '\n';
        }

        if (userReplies.length > 0) {
          contextInfo += '💬 Пользователь...：\n';
          userReplies.forEach(msg => {
            contextInfo += `  💭 [ПользовательОтветить] ${msg.mes}\n`;
          });
          contextInfo += '\n';
        }

        contextInfo += '⚠️ ...ВКонтакте.../* Приложение */...、...！\n\n';
      }

      contextInfo += '...:\n';
      uniqueMessages.forEach(msg => {
        const speaker = msg.is_user ? '👤Пользователь' : `🤖${chatData.characterName || '...'}`;
        let floorInfo = '';
        let attentionMark = '';

        if (msg.isFirstFloor) {
          floorInfo = msg.hasVkFeedContent ? '[...1...-...ВКонтакте]' : '[...1...]';
        } else if (msg.isRecentMessage) {
          floorInfo = '[...Сообщения]';
        }

        // ПользовательСообщения
        if (msg.is_user) {
          attentionMark = '⭐ ';
        }

        contextInfo += `${attentionMark}${speaker}${floorInfo}: ${msg.mes}\n`;
      });

      console.log('📋 [...] ===== ... =====');
      console.log(`[...] ...Сообщения...: ${chatData.messages.length}`);
      console.log(`[...] ...Сообщения...: ${uniqueMessages.length}`);
      console.log(`[...] ...1...: ${uniqueMessages.some(m => m.isFirstFloor)}`);
      console.log(`[...] ...1...ВКонтакте...: ${uniqueMessages.some(m => m.isFirstFloor && m.hasVkFeedContent)}`);
      console.log(`[...] ...Сообщения...: ${uniqueMessages.filter(m => m.isRecentMessage).length}`);
      console.log('📝 [...] ...:');
      console.log(contextInfo);
      console.log('🏁 [...] ===== ... =====\n');

      return contextInfo;
    }

    /**
     * ...（...Статус...）
     */
    async safeUpdateContextWithVkFeed(vk_feedContent) {
      try {
        console.log('[VkFeed Manager] 🔒 ...ВКонтакте...1......');

        if (this.checkGenerationStatus()) {
          console.log('[VkFeed Manager] ⚠️ ...SillyTavern...Ответить，......');
          return this.queueInsertion('vk_feed', vk_feedContent, { vk_feedContent });
        }

        return await this.updateContextWithVkFeed(vk_feedContent);
      } catch (error) {
        console.error('[VkFeed Manager] errorВКонтактеerror:', error);
        return false;
      }
    }

    /**
     * ...Редактировать...1...
     */
    async updateContextWithVkFeed(vk_feedContent) {
      try {
        console.log('[VkFeed Manager] ...1...ВКонтакте......');

        // Редактировать
        if (!window.mobileContextEditor) {
          throw new Error('errorРедактироватьerror');
        }

        const chatData = window.mobileContextEditor.getCurrentChatData();
        if (!chatData || !chatData.messages || chatData.messages.length === 0) {
          throw new Error('error');
        }

        // ВКонтакте（）
        const vk_feedSection = `\n\n<!-- WEIBO_CONTENT_START -->\n【ВКонтакте...】\n\n${vk_feedContent}\n\n---\n[...ВКонтакте...]\n<!-- WEIBO_CONTENT_END -->`;

        // 1
        if (chatData.messages.length >= 1) {
          const firstMessage = chatData.messages[0];
          let originalContent = firstMessage.mes || '';

          // ВКонтакте
          const existingVkFeedRegex = /<!-- WEIBO_CONTENT_START -->[\s\S]*?<!-- WEIBO_CONTENT_END -->/;
          if (existingVkFeedRegex.test(originalContent)) {
            // ЕслиВКонтакте，
            console.log('[VkFeed Manager] ...ВКонтакте...，......');

            // ВКонтакте
            const existingVkFeedMatch = originalContent.match(existingVkFeedRegex);
            const existingVkFeedContent = existingVkFeedMatch ? existingVkFeedMatch[0] : '';

            // Умное слияниеВКонтакте
            const mergedVkFeedContent = await this.mergeVkFeedContent(existingVkFeedContent, vk_feedContent);

            // ВКонтакте，
            originalContent = originalContent.replace(existingVkFeedRegex, '').trim();

            const mergedVkFeedSection = `\n\n<!-- WEIBO_CONTENT_START -->\n【ВКонтакте...】\n\n${mergedVkFeedContent}\n\n---\n[...ВКонтакте...]\n<!-- WEIBO_CONTENT_END -->`;

            // ВКонтакте
            const newContent = originalContent + mergedVkFeedSection;

            // 1
            const success = await window.mobileContextEditor.modifyMessage(0, newContent);
            if (success) {
              console.log('[VkFeed Manager] ✅ ВКонтакте...');
              return true;
            } else {
              throw new Error('modifyMessageНазадfalse');
            }
          }

          // ВКонтакте
          const newContent = originalContent + vk_feedSection;

          // 1
          const success = await window.mobileContextEditor.modifyMessage(0, newContent);
          if (success) {
            console.log('[VkFeed Manager] ✅ ...1...ВКонтакте...');
            return true;
          } else {
            throw new Error('modifyMessageНазадfalse');
          }
        } else {
          // ЕслиСообщения，Сообщения（ВКонтакте）
          const messageIndex = await window.mobileContextEditor.addMessage(vk_feedSection.trim(), false, 'ВКонтакте...');
          if (messageIndex >= 0) {
            console.log('[VkFeed Manager] ✅ ...1...（...ВКонтакте...）...');
            return true;
          } else {
            throw new Error('addMessageНазадerror');
          }
        }
      } catch (error) {
        console.error('[VkFeed Manager] error1error:', error);
        return false;
      }
    }

    /**
     * ...ВКонтакте...
     */
    async mergeVkFeedContent(existingVkFeedContent, newVkFeedContent) {
      try {
        console.log('[VkFeed Manager] 🔄 ...ВКонтакте......');

        // ВКонтакте（）
        const existingContentMatch = existingVkFeedContent.match(
          /<!-- WEIBO_CONTENT_START -->\s*【ВКонтакте...】\s*([\s\S]*?)\s*---\s*\[...ВКонтакте...\]\s*<!-- WEIBO_CONTENT_END -->/,
        );
        const existingContent = existingContentMatch ? existingContentMatch[1].trim() : '';

        console.log('[VkFeed Manager] 📋 ...ВКонтакте...:');
        console.log(existingContent);
        console.log('[VkFeed Manager] 📋 ...ВКонтакте...:');
        console.log(newVkFeedContent);

        const existingData = this.parseVkFeedContent(existingContent);
        console.log('[VkFeed Manager] 📊 ...:', existingData);

        const newData = this.parseVkFeedContent(newVkFeedContent);
        console.log('[VkFeed Manager] 📊 ...:', newData);
        console.log('[VkFeed Manager] 📊 ...Комментарий...:', JSON.stringify(newData.comments, null, 2));

        // 🔧 5：
        const hasNewHotSearches = /\[...\|/.test(newVkFeedContent);
        const hasNewRankings = /\[...\|/.test(newVkFeedContent) || /\[...\|/.test(newVkFeedContent);
        const hasNewRankingPosts = /\[...\|[^|]+\|r\d+\|/.test(newVkFeedContent);
        const hasNewUserStats = /\[Подписчики...\|/.test(newVkFeedContent);

        console.log('[VkFeed Manager] 🔍 ...:', {
          hasNewHotSearches,
          hasNewRankings,
          hasNewRankingPosts,
          hasNewUserStats,
        });

        const mergedPosts = new Map();
        const mergedComments = new Map();
        let mergedRankingPosts = []; // ...

        // 1. （）
        existingData.posts.forEach(post => {
          if (!post.id.startsWith('r')) {
            mergedPosts.set(post.id, post);
            mergedComments.set(post.id, existingData.comments[post.id] || []);
          }
        });

        // 1.1
        if (!hasNewRankingPosts) {
          // Если，
          mergedRankingPosts = existingData.posts.filter(post => post.id.startsWith('r'));
          console.log('[VkFeed Manager] 📊 ...:', mergedRankingPosts.length, '...');
        }

        // 2.
        const currentTime = new Date();
        newData.posts.forEach(newPost => {
          if (newPost.id.startsWith('r')) {
            // ：，
            if (hasNewRankingPosts) {
              mergedRankingPosts.push(newPost);
              console.log(`[VkFeed Manager] 📊 ...: ${newPost.id}`);
            }
          } else {
            // ：
            if (mergedPosts.has(newPost.id)) {
              // Если，，Комментарий
              console.log(`[VkFeed Manager] 📝 ... ${newPost.id} ...，...Комментарий...`);
            } else {
              // Если，НастройкиВремя
              console.log(`[VkFeed Manager] ✨ ...: ${newPost.id}`);
              newPost.timestamp = currentTime.toLocaleString();
              newPost.latestActivityTime = currentTime; // Настройки...Date...，...
              mergedPosts.set(newPost.id, newPost);
              mergedComments.set(newPost.id, []);
            }
          }
        });

        // Если，
        if (hasNewRankingPosts && mergedRankingPosts.length > 0) {
          console.log('[VkFeed Manager] ✅ ...，...:', mergedRankingPosts.length);
        }

        // 3. Комментарий - ：Комментарий，Комментарий
        // Комментарий
        newData.posts.forEach(newPost => {
          const newPostComments = newData.comments[newPost.id] || [];
          const existingComments = mergedComments.get(newPost.id) || [];

          // Комментарий，
          const allComments = [...existingComments];
          newPostComments.forEach(newComment => {
            // ：
            const isDuplicate = allComments.some(
              existingComment =>
                existingComment.author === newComment.author &&
                existingComment.content.includes(newComment.content.substring(0, 20)),
            );

            if (!isDuplicate) {
              // КомментарийНастройкиВремя，
              newComment.timestamp = currentTime.toLocaleString();
              newComment.sortTimestamp = currentTime.getTime(); // ...Время...

              allComments.push(newComment);
              console.log(`[VkFeed Manager] 💬 ...Комментарий... ${newPost.id}: ${newComment.author}`);

              // ЕслиКомментарий，НовоеВремя
              if (mergedPosts.has(newPost.id)) {
                const existingPost = mergedPosts.get(newPost.id);
                existingPost.latestActivityTime = currentTime;
                existingPost.timestamp = currentTime.toLocaleString(); // ...Время...
                console.log(`[VkFeed Manager] 📝 ... ${newPost.id} ...Новое...Время`);
              }
            }
          });

          mergedComments.set(newPost.id, allComments);
        });

        // ：Комментарий（）
        Object.keys(newData.comments).forEach(postId => {
          if (newData.posts.some(post => post.id === postId)) {
            return;
          }

          // ID
          if (mergedPosts.has(postId)) {
            const newPostComments = newData.comments[postId] || [];
            const existingComments = mergedComments.get(postId) || [];

            console.log(`[VkFeed Manager] 🔄 ... ${postId} ...Комментарий，...: ${newPostComments.length}`);

            // Комментарий，
            const allComments = [...existingComments];
            newPostComments.forEach(newComment => {
              console.log(
                `[VkFeed Manager] 🔍 ...Комментарий: ${newComment.author} - ${newComment.content.substring(0, 50)}...`,
              );

              // ：
              // ：Ответить"ОтветитьXXX："，
              const newContentForCheck = newComment.content.substring(0, 30);
              const isDuplicate = allComments.some(existingComment => {
                const authorMatch = existingComment.author === newComment.author;
                const contentMatch =
                  existingComment.content.includes(newContentForCheck) ||
                  newComment.content.includes(existingComment.content.substring(0, 20));
                console.log(`[VkFeed Manager] 🔍 ...Комментарий:
                  ...: ${existingComment.author} - ${existingComment.content.substring(0, 30)}...
                  ...: ${newComment.author} - ${newContentForCheck}...
                  ...: ${authorMatch}, ...: ${contentMatch}`);
                return authorMatch && contentMatch;
              });

              console.log(`[VkFeed Manager] 🔍 ...: ${isDuplicate ? '...' : '...'}`);

              if (!isDuplicate) {
                // КомментарийНастройкиВремя，
                newComment.timestamp = currentTime.toLocaleString();
                newComment.sortTimestamp = currentTime.getTime(); // ...Время...

                allComments.push(newComment);
                console.log(`[VkFeed Manager] 💬 ...Комментарий... ${postId}: ${newComment.author}`);

                // НовоеВремя
                const existingPost = mergedPosts.get(postId);
                existingPost.latestActivityTime = currentTime;
                existingPost.timestamp = currentTime.toLocaleString(); // ...Время...
                console.log(`[VkFeed Manager] 📝 ... ${postId} ...Новое...Время`);
              } else {
                console.log(`[VkFeed Manager] ⚠️ ...Комментарий: ${newComment.author}`);
              }
            });

            mergedComments.set(postId, allComments);
          } else {
            console.log(`[VkFeed Manager] ⚠️ ... ${postId} ...Комментарий，...`);
          }
        });

        // 4.
        let finalHotSearches = existingData.hotSearches || [];
        let finalRankings = existingData.rankings || [];
        let finalUserStats = existingData.userStats;

        if (hasNewHotSearches && newData.hotSearches && newData.hotSearches.length > 0) {
          finalHotSearches = newData.hotSearches;
          console.log('[VkFeed Manager] ✅ ...，...:', finalHotSearches.length);
        }

        if (hasNewRankings && newData.rankings && newData.rankings.length > 0) {
          finalRankings = newData.rankings;
          console.log('[VkFeed Manager] ✅ ...，...:', finalRankings.length);
        }

        if (hasNewUserStats && newData.userStats) {
          finalUserStats = newData.userStats;
          console.log(
            '[VkFeed Manager] ✅ Подписчики... - ...:',
            finalUserStats.mainAccountFans,
            '...:',
            finalUserStats.aliasAccountFans,
          );
        }

        // 5. ВКонтакте（）
        const mergedContent = this.buildVkFeedContent(
          mergedPosts,
          mergedComments,
          mergedRankingPosts,
          finalHotSearches,
          finalRankings,
          finalUserStats,
        );

        console.log('[VkFeed Manager] ✅ ВКонтакте...');
        console.log('[VkFeed Manager] 📋 ...:');
        console.log(mergedContent);

        return mergedContent;
      } catch (error) {
        console.error('[VkFeed Manager] ❌ errorВКонтактеerror:', error);
        // Если，Назад
        return newVkFeedContent;
      }
    }

    /**
     * ...ВКонтакте...
     */
    parseVkFeedContent(vk_feedContent) {
      const posts = [];
      const comments = {};

      if (!vk_feedContent || vk_feedContent.trim() === '') {
        return { posts, comments };
      }

      // : [|Никнейм|id|]
      const postRegex = /\[...\|([^|]+)\|([^|]+)\|([^\]]+)\]/g;
      // Комментарий: [Комментарий|КомментарийНикнейм|id|Комментарий]
      const commentRegex = /\[Комментарий\|([^|]+)\|([^|]+)\|([^\]]+)\]/g;
      // Ответить: [Ответ|ОтветитьНикнейм|id|ОтветитьКомментарий：Ответить]
      const replyRegex = /\[Ответить\|([^|]+)\|([^|]+)\|([^\]]+)\]/g;

      let match;

      let postIndex = 0;
      while ((match = postRegex.exec(vk_feedContent)) !== null) {
        // НастройкиВремя，
        const baseTime = new Date('2024-01-01 10:00:00');
        const postTime = new Date(baseTime.getTime() + postIndex * 60000); // ...1...

        const post = {
          id: match[2],
          author: match[1],
          content: match[3],
          timestamp: postTime.toLocaleString(),
          latestActivityTime: postTime, // ...Время...ОпубликоватьВремя
        };

        posts.push(post);
        comments[post.id] = [];
        postIndex++;
      }

      // Комментарий
      let commentIndex = 0;
      while ((match = commentRegex.exec(vk_feedContent)) !== null) {
        // КомментарийНастройкиВремя，
        const baseTime = new Date('2024-01-01 11:00:00');
        const commentTime = new Date(baseTime.getTime() + commentIndex * 30000); // ...Комментарий...30...

        const comment = {
          id: `comment_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
          postId: match[2],
          author: match[1],
          content: match[3],
          timestamp: commentTime.toLocaleString(),
          type: 'comment',
          replies: [],
        };

        // ：Комментарий，
        if (!comments[comment.postId]) {
          comments[comment.postId] = [];
        }

        comments[comment.postId].push(comment);
        console.log(`[VkFeed Manager] 📝 ...Комментарий... ${comment.postId}: ${comment.author}`);

        // НовоеВремя
        const post = posts.find(p => p.id === comment.postId);
        if (post && commentTime > post.latestActivityTime) {
          post.latestActivityTime = commentTime;
        }
        commentIndex++;
      }

      // Ответить
      let replyIndex = 0;
      while ((match = replyRegex.exec(vk_feedContent)) !== null) {
        // ОтветитьНастройкиВремя
        const baseTime = new Date('2024-01-01 12:00:00');
        const replyTime = new Date(baseTime.getTime() + replyIndex * 15000); // ...Ответить...15...

        const reply = {
          id: `reply_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
          postId: match[2],
          author: match[1],
          content: match[3],
          timestamp: replyTime.toLocaleString(),
          type: 'reply',
        };

        // КомментарийОтветить
        // ：Комментарий，
        if (!comments[reply.postId]) {
          comments[reply.postId] = [];
        }

        // ：ОтветитьКомментарий
        reply.type = 'comment';
        reply.replies = [];
        comments[reply.postId].push(reply);
        console.log(`[VkFeed Manager] 📝 ...Ответить... ${reply.postId}: ${reply.author}`);

        // НовоеВремя
        const post = posts.find(p => p.id === reply.postId);
        if (post && replyTime > post.latestActivityTime) {
          post.latestActivityTime = replyTime;
        }
        replyIndex++;
      }

      // （、、Подписчики）
      const hotSearches = [];
      const rankings = [];
      let userStats = null;

      // : [|||]
      const hotSearchRegex = /\[...\|([^|]+)\|([^|]+)\|([^\]]+)\]/g;
      let hotSearchMatch;
      while ((hotSearchMatch = hotSearchRegex.exec(vk_feedContent)) !== null) {
        hotSearches.push({
          rank: parseInt(hotSearchMatch[1]),
          title: hotSearchMatch[2],
          heat: hotSearchMatch[3],
        });
      }

      // : [||] [|||]
      const rankingTitleRegex = /\[...\|([^|]+)\|([^\]]+)\]/g;
      const rankingItemRegex = /\[...\|([^|]+)\|([^|]+)\|([^\]]+)\]/g;

      let rankingTitleMatch;
      while ((rankingTitleMatch = rankingTitleRegex.exec(vk_feedContent)) !== null) {
        rankings.push({
          title: rankingTitleMatch[1],
          type: rankingTitleMatch[2],
          items: [],
        });
      }

      let rankingItemMatch;
      while ((rankingItemMatch = rankingItemRegex.exec(vk_feedContent)) !== null) {
        const item = {
          rank: parseInt(rankingItemMatch[1]),
          name: rankingItemMatch[2],
          heat: rankingItemMatch[3],
        };

        if (rankings.length > 0) {
          rankings[rankings.length - 1].items.push(item);
        }
      }

      // Подписчики: [Подписчики|Подписчики|Подписчики]
      const fansRegex = /\[Подписчики...\|([^|]+)\|([^\]]+)\]/g;
      let fansMatch;
      while ((fansMatch = fansRegex.exec(vk_feedContent)) !== null) {
        userStats = {
          mainAccountFans: fansMatch[1], // ...Подписчики...
          aliasAccountFans: fansMatch[2], // ...Подписчики...
          following: '100', // ...Подписаться...
          posts: posts.length,
        };
        break; // ...Подписчики...
      }

      return { posts, comments, hotSearches, rankings, userStats };
    }

    /**
     * ...ВКонтакте...（...）
     */
    buildVkFeedContent(postsMap, commentsMap, rankingPosts = [], hotSearches = [], rankings = [], userStats = null) {
      let content = '';

      // НовоеВремя（КомментарийВремя）
      const postsWithActivity = Array.from(postsMap.values()).map(post => {
        const postComments = commentsMap.get(post.id) || [];
        let latestActivityTime = new Date(post.timestamp);

        // КомментарийВремя，Новое
        postComments.forEach(comment => {
          const commentTime = new Date(comment.timestamp);
          if (commentTime > latestActivityTime) {
            latestActivityTime = commentTime;
          }

          // ОтветитьВремя
          if (comment.replies && comment.replies.length > 0) {
            comment.replies.forEach(reply => {
              const replyTime = new Date(reply.timestamp);
              if (replyTime > latestActivityTime) {
                latestActivityTime = replyTime;
              }
            });
          }
        });

        return {
          ...post,
          latestActivityTime: latestActivityTime,
        };
      });

      // 1.
      if (hotSearches && hotSearches.length > 0) {
        hotSearches.forEach(hotSearch => {
          content += `[...|${hotSearch.rank}|${hotSearch.title}|${hotSearch.heat}]\n`;
        });
        content += '\n';
      }

      // 2.
      if (rankings && rankings.length > 0) {
        rankings.forEach(ranking => {
          content += `[...|${ranking.title}|${ranking.type}]\n`;
          if (ranking.items && ranking.items.length > 0) {
            ranking.items.forEach(item => {
              content += `[...|${item.rank}|${item.name}|${item.heat}]\n`;
            });
          }
        });
        content += '\n';
      }

      // НовоеВремя（Новое）
      const allPosts = [...postsWithActivity];

      // /* Список */
      if (rankingPosts && rankingPosts.length > 0) {
        rankingPosts.forEach(rankingPost => {
          // НастройкиВремя
          if (!rankingPost.latestActivityTime) {
            rankingPost.latestActivityTime = new Date(rankingPost.timestamp || new Date());
          }
          allPosts.push(rankingPost);
        });
      }

      const sortedPosts = allPosts.sort((a, b) => {
        return new Date(b.latestActivityTime) - new Date(a.latestActivityTime);
      });

      sortedPosts.forEach(post => {
        content += `[...|${post.author}|${post.id}|${post.content}]\n\n`;

        // Комментарий（Время，Новое）
        const postComments = commentsMap.get(post.id) || [];
        const sortedComments = postComments.sort((a, b) => {
          // sortTimestamp，timestamp
          const aTime = a.sortTimestamp || new Date(a.timestamp).getTime();
          const bTime = b.sortTimestamp || new Date(b.timestamp).getTime();
          return bTime - aTime; // ...，Новое...
        });

        sortedComments.forEach(comment => {
          content += `[Комментарий|${comment.author}|${comment.postId}|${comment.content}]\n`;

          // Ответить
          if (comment.replies && comment.replies.length > 0) {
            comment.replies.forEach(reply => {
              content += `[Ответ|${reply.author}|${reply.postId}|${reply.content}]\n`;
            });
          }
        });

        content += '\n';
      });

      // 3. Подписчики（）
      if (userStats && (userStats.mainAccountFans || userStats.aliasAccountFans)) {
        const mainFans = userStats.mainAccountFans || '0';
        const aliasFans = userStats.aliasAccountFans || '0';
        content += `[Подписчики...|${mainFans}|${aliasFans}]\n`;
      }

      return content.trim();
    }

    /**
     * ...ВКонтакте...
     */
    async clearVkFeedContent() {
      try {
        this.updateStatus('...ВКонтакте......', 'info');

        if (!window.mobileContextEditor) {
          throw new Error('errorРедактироватьerror');
        }

        const chatData = window.mobileContextEditor.getCurrentChatData();
        if (!chatData || !chatData.messages || chatData.messages.length === 0) {
          throw new Error('error');
        }

        // 1ВКонтакте
        const firstMessage = chatData.messages[0];
        if (firstMessage && firstMessage.mes) {
          const originalContent = firstMessage.mes;
          const vk_feedRegex = /<!-- WEIBO_CONTENT_START -->[\s\S]*?<!-- WEIBO_CONTENT_END -->/;

          if (vk_feedRegex.test(originalContent)) {
            // ВКонтакте
            const cleanedContent = originalContent.replace(vk_feedRegex, '').trim();

            if (cleanedContent === '') {
              // ЕслиВКонтактеСообщения，УдалитьСообщения
              const success = await window.mobileContextEditor.deleteMessage(0);
              if (success) {
                this.updateStatus('ВКонтакте...（Сообщения...Удалить）', 'success');
                console.log('[VkFeed Manager] ✅ ...1...ВКонтакте...，Сообщения...Удалить');
              } else {
                throw new Error('УдалитьerrorСообщенияerror');
              }
            } else {
              // Если，Сообщения
              const success = await window.mobileContextEditor.modifyMessage(0, cleanedContent);
              if (success) {
                this.updateStatus('ВКонтакте...（...）', 'success');
                console.log('[VkFeed Manager] ✅ ...1...ВКонтакте...，...');
              } else {
                throw new Error('errorСообщенияerror');
              }
            }
          } else {
            this.updateStatus('...1...ВКонтакте...', 'warning');
            console.log('[VkFeed Manager] ...1...ВКонтакте...');
          }
        } else {
          this.updateStatus('...1...Сообщения...', 'warning');
        }

        // Статус - Safari
        this.isProcessing = false;

        // auto-listenerСтатус -
        if (window.vk_feedAutoListener) {
          window.vk_feedAutoListener.isProcessingRequest = false;
        }

        // ОбновитьВКонтактеUI
        this.clearVkFeedUICache();

        console.log('[VkFeed Manager] 🔄 ...，Статус...（...Safari）');
      } catch (error) {
        console.error('[VkFeed Manager] errorВКонтактеerror:', error);
        this.updateStatus(`...: ${error.message}`, 'error');

        // Статус - ，setTimeout
        this.isProcessing = false;
        if (window.vk_feedAutoListener) {
          window.vk_feedAutoListener.isProcessingRequest = false;
        }
      } finally {
        // Safari：
        this.isProcessing = false;
        if (window.vk_feedAutoListener) {
          window.vk_feedAutoListener.isProcessingRequest = false;
        }

        // ：
        setTimeout(() => {
          this.isProcessing = false;
          if (window.vk_feedAutoListener) {
            window.vk_feedAutoListener.isProcessingRequest = false;
          }
          console.log('[VkFeed Manager] 🛡️ ...Статус...（...）');
        }, 500); // ...500ms，...
      }
    }

    /**
     * ОбновитьВКонтактеUI...
     */
    clearVkFeedUICache() {
      try {
        // ОбновитьВКонтактеUI
        if (window.vk_feedUI && window.vk_feedUI.refreshVkFeedList) {
          window.vk_feedUI.refreshVkFeedList();
          console.log('[VkFeed Manager] ✅ ВКонтактеUI...Обновить');
        }

        // localStorageВКонтакте（）
        const vk_feedDataKeys = ['mobile_vk_feed_posts', 'mobile_vk_feed_comments', 'mobile_vk_feed_cache'];

        vk_feedDataKeys.forEach(key => {
          if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
            console.log(`[VkFeed Manager] ✅ ...localStorage...${key}`);
          }
        });
      } catch (error) {
        console.warn('[VkFeed Manager] ОбновитьВКонтактеUIerror:', error);
      }
    }

    /**
     * .../* Отображение статуса */
     */
    updateStatus(message, type = 'info') {
      console.log(`[VkFeed Manager] Статус... [${type}]: ${message}`);

      // Если/* Отображение статуса */，
      const statusElement = document.getElementById('vk_feed-status');
      if (statusElement) {
        statusElement.textContent = message;
        statusElement.className = `status-${type}`;
      }
    }

    /**
     * ...Статус（...mobile-phone.js...）
     */
    updateGenerationStatus(message) {
      console.log(`[VkFeed Manager] ...Статус: ${message}`);
      this.updateStatus(message, 'info');
    }

    /**
     * ...Статус
     */
    checkGenerationStatus() {
      // SillyTavern
      // SillyTavernAPI
      return false;
    }

    /**
     * ...
     */
    queueInsertion(type, content, data) {
      this.pendingInsertions.push({
        type,
        content,
        data,
        timestamp: Date.now(),
      });
      console.log(`[VkFeed Manager] ...: ${type}`);
      return true;
    }

    /**
     * ...
     */
    async processInsertionQueue() {
      if (this.pendingInsertions.length === 0) {
        return;
      }

      console.log(`[VkFeed Manager] ...，... ${this.pendingInsertions.length} ...`);

      while (this.pendingInsertions.length > 0) {
        const insertion = this.pendingInsertions.shift();
        try {
          await this.updateContextWithVkFeed(insertion.content);
          console.log(`[VkFeed Manager] ...: ${insertion.type}`);
        } catch (error) {
          console.error(`[VkFeed Manager] error: ${insertion.type}`, error);
        }
      }
    }

    /**
     * ...
     */
    async waitForGenerationComplete() {
      return new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (!this.checkGenerationStatus()) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 1000);

        setTimeout(() => {
          clearInterval(checkInterval);
          resolve();
        }, this.maxWaitTime);
      });
    }

    /**
     * ...Пользователь...API
     */
    async sendPostToAPI(content) {
      try {
        console.log('🚀 [ВКонтактеAPI] ===== ...Пользователь... =====');

        // API
        if (!this.isAPIConfigValid()) {
          throw new Error('errorAPI');
        }

        const chatData = await this.getCurrentChatData();
        const contextInfo = this.buildContextInfo(chatData);

        // （Пользователь）
        const stylePrompt = window.vk_feedStyles
          ? window.vk_feedStyles.getStylePrompt(
              'post',
              this.currentAccount.isMainAccount,
              this.currentAccount.currentPage,
            )
          : '';

        console.log('📋 [ВКонтактеAPI] ...（Пользователь...）:');
        console.log(stylePrompt);
        console.log('\n📝 [ВКонтактеAPI] Пользователь...:');
        console.log(content);

        // API
        const messages = [
          {
            role: 'system',
            content: stylePrompt,
          },
          {
            role: 'user',
            content: `ПользовательОпубликовать...ВКонтакте：${content}\n\n...ВКонтакте...：\n\n${contextInfo}`,
          },
        ];

        console.log('📡 [ВКонтактеAPI] ...API...:');
        console.log(JSON.stringify(messages, null, 2));

        // API
        const response = await window.mobileCustomAPIConfig.callAPI(messages, {
          temperature: 0.8,
          max_tokens: 2000,
        });

        console.log('📥 [ВКонтактеAPI] ...Назад...:');
        console.log(response);

        if (response && response.content) {
          console.log('✅ [ВКонтактеAPI] Пользователь...:');
          console.log(response.content);

          const success = await this.safeUpdateContextWithVkFeed(response.content);
          if (success) {
            console.log('✅ [ВКонтактеAPI] Пользователь...');
          }

          console.log('🏁 [ВКонтактеAPI] ===== Пользователь... =====\n');
          return response.content;
        } else {
          throw new Error('APIНазадerror');
        }
      } catch (error) {
        console.error('❌ [ВКонтактеAPI] errorПользовательerror:', error);
        console.log('🏁 [ВКонтактеAPI] ===== Пользователь... =====\n');
        throw error;
      }
    }

    /**
     * ...ПользовательОтветить...API
     */
    async sendReplyToAPI(replyContent) {
      try {
        console.log('🚀 [ВКонтактеAPI] ===== ...ПользовательОтветить =====');

        // API
        if (!this.isAPIConfigValid()) {
          throw new Error('errorAPI');
        }

        const chatData = await this.getCurrentChatData();
        const contextInfo = this.buildContextInfo(chatData);

        // （ПользовательОтветить）
        const stylePrompt = window.vk_feedStyles
          ? window.vk_feedStyles.getStylePrompt(
              'reply',
              this.currentAccount.isMainAccount,
              this.currentAccount.currentPage,
            )
          : '';

        console.log('📋 [ВКонтактеAPI] ...（ПользовательОтветить）:');
        console.log(stylePrompt);
        console.log('\n📝 [ВКонтактеAPI] ПользовательОтветить...:');
        console.log(replyContent);

        // API
        const messages = [
          {
            role: 'system',
            content: stylePrompt,
          },
          {
            role: 'user',
            content: `Пользователь...Ответить：${replyContent}\n\n...ВКонтактеОтветить...：\n\n${contextInfo}`,
          },
        ];

        console.log('📡 [ВКонтактеAPI] ...API...:');
        console.log(JSON.stringify(messages, null, 2));

        // API
        const response = await window.mobileCustomAPIConfig.callAPI(messages, {
          temperature: 0.8,
          max_tokens: 1500,
        });

        console.log('📥 [ВКонтактеAPI] ...Назад...:');
        console.log(response);

        if (response && response.content) {
          console.log('✅ [ВКонтактеAPI] ПользовательОтветить...:');
          console.log(response.content);

          const success = await this.safeUpdateContextWithVkFeed(response.content);
          if (success) {
            console.log('✅ [ВКонтактеAPI] ПользовательОтветить...');
          }

          console.log('🏁 [ВКонтактеAPI] ===== ПользовательОтветить... =====\n');
          return response.content;
        } else {
          throw new Error('APIНазадerror');
        }
      } catch (error) {
        console.error('❌ [ВКонтактеAPI] errorПользовательОтветитьerror:', error);
        console.log('🏁 [ВКонтактеAPI] ===== ПользовательОтветить... =====\n');
        throw error;
      }
    }

    /**
     * ...ВКонтакте...
     */
    async checkAutoGenerate() {
      if (!this.currentSettings.autoUpdate || this.isProcessing) {
        return false;
      }

      // auto-listener
      if (window.vk_feedAutoListener && window.vk_feedAutoListener.isProcessingRequest) {
        console.log('[VkFeed Manager] Auto-listener...，...');
        return false;
      }

      try {
        const chatData = await this.getCurrentChatData();
        if (!chatData || !chatData.messages) {
          return false;
        }

        const currentCount = chatData.messages.length;
        const increment = currentCount - this.lastProcessedCount;

        console.log(
          `[VkFeed Manager] ...: ...Сообщения...=${currentCount}, ...=${this.lastProcessedCount}, ...=${increment}, ...=${this.currentSettings.threshold}`,
        );

        if (increment >= this.currentSettings.threshold) {
          console.log(`[VkFeed Manager] ...，...ВКонтакте...`);
          return await this.generateVkFeedContent(false);
        }

        return false;
      } catch (error) {
        console.error('[VkFeed Manager] error:', error);
        return false;
      }
    }

    /**
     * ... - ...
     */
    shouldRetry(error) {
      // ，Назад false
      console.log(`[VkFeed Manager] ⏳ ...，...。...: ${error.message}`);
      return false;
    }

    /**
     * ...
     */
    scheduleRetry(force = false) {
      this.retryConfig.currentRetryCount++;
      this.retryConfig.lastFailTime = Date.now();

      console.log(`[VkFeed Manager] 🔄 ... ${this.retryConfig.currentRetryCount} ...，... ${this.retryConfig.retryDelay / 1000} ...`);

      // Настройки
      setTimeout(async () => {
        try {
          console.log(`[VkFeed Manager] 🔄 ... ${this.retryConfig.currentRetryCount} ...`);
          this.updateStatus(`...ВКонтакте...... (${this.retryConfig.currentRetryCount}/${this.retryConfig.maxRetries})`, 'info');

          const success = await this.generateVkFeedContent(force);
          if (success) {
            console.log(`[VkFeed Manager] ✅ ... ${this.retryConfig.currentRetryCount} ...`);
            this.resetRetryConfig();
          }
        } catch (error) {
          console.error(`[VkFeed Manager] ❌ error ${this.retryConfig.currentRetryCount} error:`, error);
        }
      }, this.retryConfig.retryDelay);
    }

    /**
     * ...
     */
    resetRetryConfig() {
      this.retryConfig.currentRetryCount = 0;
      this.retryConfig.lastFailTime = null;
      console.log('[VkFeed Manager] 🔄 ...');
    }

    /**
     * ...API...，...auto-listener
     */
    enableAutoListenerIfConfigValid() {
      if (this.isAPIConfigValid() && window.vk_feedAutoListener && !window.vk_feedAutoListener.settings.enabled) {
        console.log('[VkFeed Manager] 🔄 API...，...auto-listener');
        window.vk_feedAutoListener.enable();
      }
    }
  }

  // - Forum-App
  if (typeof window !== 'undefined') {
    window.VkFeedManager = VkFeedManager;
    window.vk_feedManager = new VkFeedManager();

    // ：ВКонтакте
    function initializeVkFeedManager() {
      if (window.vk_feedManager && !window.vk_feedManager.isInitialized) {
        console.log('[VkFeed Manager] ...ВКонтакте......');
        window.vk_feedManager.initialize();
      }
    }

    // ，
    function delayedInitialization() {
      const contextEditorReady = window.mobileContextEditor !== undefined;
      const customAPIReady = window.mobileCustomAPIConfig !== undefined;
      const vk_feedStylesReady = window.vk_feedStyles !== undefined;

      console.log('[VkFeed Manager] 🔍 ...:', {
        contextEditor: contextEditorReady,
        customAPI: customAPIReady,
        vk_feedStyles: vk_feedStylesReady,
        vk_feedStylesType: typeof window.vk_feedStyles,
        vk_feedStylesClass: typeof window.VkFeedStyles,
        allVkFeedKeys: Object.keys(window).filter(key => key.toLowerCase().includes('vk_feed')),
      });

      // Если vk_feedStyles ，
      if (!vk_feedStylesReady) {
        console.log('[VkFeed Manager] 🔍 vk_feedStyles ...，...:');
        console.log('- window.VkFeedStyles ...:', typeof window.VkFeedStyles);

        if (typeof window.VkFeedStyles !== 'undefined') {
          console.log('[VkFeed Manager] 🔧 ... vk_feedStyles ...');
          try {
            window.vk_feedStyles = new window.VkFeedStyles();
            console.log('[VkFeed Manager] ✅ ... vk_feedStyles ...');
          } catch (error) {
            console.error('[VkFeed Manager] ❌ error vk_feedStyles error:', error);
          }
        }
      }

      // Статус
      const finalVkFeedStylesReady = window.vk_feedStyles !== undefined;

      if (contextEditorReady && customAPIReady && finalVkFeedStylesReady) {
        // ，
        console.log('[VkFeed Manager] ✅ ...，...');
        initializeVkFeedManager();
      } else {
        // ，（）
        console.log('[VkFeed Manager] ⏳ ...，...');
        setTimeout(initializeVkFeedManager, 2000); // 2...，...
      }
    }

    // ЕслиDOM，；DOMContentLoaded
    if (document.readyState === 'loading') {
      console.log('[VkFeed Manager] DOM...，...DOMContentLoaded...');
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(delayedInitialization, 1000); // DOM...1...
      });
    } else {
      console.log('[VkFeed Manager] DOM...，...');
      // setTimeout
      setTimeout(delayedInitialization, 1000);
    }

    console.log('[VkFeed Manager] ✅ ВКонтакте...');
  }
} // ...
