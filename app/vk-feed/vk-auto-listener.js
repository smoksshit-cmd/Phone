// ==SillyTavern VkFeed Auto Listener==
// @name         VkFeed Auto Listener for Mobile Extension
// @version      1.0.0
// @description ВКонтакте，ВКонтакте
// @author       Assistant

if (typeof window.VkFeedAutoListener !== 'undefined') {
  console.log('[VkFeed Auto Listener] ...，...');
} else {
  /**
   * ВКонтакте...
   * ...ВКонтакте...
   */
  class VkFeedAutoListener {
    constructor() {
      this.isListening = false;
      this.isProcessingRequest = false;
      this.lastProcessedMessageCount = 0;
      this.checkInterval = null;
      this.checkIntervalMs = 3000; // ...：3...
      this.settings = {
        enabled: true,
        threshold: 10, // Сообщения...
      };

      this.startListening = this.startListening.bind(this);
      this.stopListening = this.stopListening.bind(this);
      this.checkForUpdates = this.checkForUpdates.bind(this);
      this.handleChatUpdate = this.handleChatUpdate.bind(this);

      this.init();
    }

    /**
     * ... - ...Forum-App...
     */
    init() {
      console.log('[VkFeed Auto Listener] ...ВКонтакте...');
      this.loadSettings();

      // Forum-App：НастройкиUI，
      setTimeout(() => {
        this.setupUIObserver();
      }, 2000);
    }

    /**
     * НастройкиUI... - ...Forum-App
     */
    setupUIObserver() {
      try {
        console.log('[VkFeed Auto Listener] НастройкиUI......');

        // ВКонтакте/* Приложение */Статус
        this.checkVkFeedAppState();

        // НастройкиUIСтатус（）
        setInterval(() => {
          this.checkVkFeedAppState();
        }, 10000); // ...10...UIСтатус
      } catch (error) {
        console.error('[VkFeed Auto Listener] НастройкиUIerror:', error);
      }
    }

    /**
     * ...ВКонтакте/* Приложение */Статус - ...Forum-App
     */
    checkVkFeedAppState() {
      try {
        // ВКонтакте/* Приложение */
        const vk_feedAppActive = this.isVkFeedAppActive();

        if (vk_feedAppActive && !this.isListening && this.settings.enabled) {
          console.log('[VkFeed Auto Listener] ...ВКонтакте/* Приложение */...，...');
          this.startListening();
        } else if (!vk_feedAppActive && this.isListening) {
          console.log('[VkFeed Auto Listener] ...ВКонтакте/* Приложение */...，...');
          this.stopListening();
        }
      } catch (error) {
        console.warn('[VkFeed Auto Listener] errorВКонтакте/* Приложение */Статусerror:', error);
      }
    }

    /**
     * ...ВКонтакте/* Приложение */...
     */
    isVkFeedAppActive() {
      try {
        // ВКонтактеDOM
        const vk_feedElements = document.querySelectorAll('.vk_feed-page, .vk_feed-container, [data-app="vk_feed"]');
        const hasVisibleVkFeedElements = Array.from(vk_feedElements).some(el => {
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        });

        // URLСтатус
        const urlContainsVkFeed = window.location.href.includes('vk_feed') || window.location.hash.includes('vk_feed');

        // /* Приложение */Статус
        const mobileFrameworkActive = window.mobileFramework && window.mobileFramework.currentApp === 'vk_feed';

        return hasVisibleVkFeedElements || urlContainsVkFeed || mobileFrameworkActive;
      } catch (error) {
        console.warn('[VkFeed Auto Listener] errorВКонтакте/* Приложение */errorСтатусerror:', error);
        // Если，（）
        return true;
      }
    }

    /**
     * ...Настройки
     */
    loadSettings() {
      try {
        const saved = localStorage.getItem('mobile_vk_feed_auto_listener_settings');
        if (saved) {
          const settings = JSON.parse(saved);
          this.settings = { ...this.settings, ...settings };
          console.log('[VkFeed Auto Listener] Настройки...:', this.settings);
        }
      } catch (error) {
        console.warn('[VkFeed Auto Listener] errorНастройкиerror:', error);
      }
    }

    /**
     * СохранитьНастройки
     */
    saveSettings() {
      try {
        localStorage.setItem('mobile_vk_feed_auto_listener_settings', JSON.stringify(this.settings));
        console.log('[VkFeed Auto Listener] Настройки...Сохранить:', this.settings);
      } catch (error) {
        console.warn('[VkFeed Auto Listener] СохранитьНастройкиerror:', error);
      }
    }

    /**
     * ...
     */
    startListening() {
      if (this.isListening) {
        console.log('[VkFeed Auto Listener] ...');
        return;
      }

      console.log('[VkFeed Auto Listener] 🎧 ......');
      this.isListening = true;

      // Сообщения
      this.updateLastProcessedCount();

      this.checkInterval = setInterval(this.checkForUpdates, this.checkIntervalMs);

      console.log(`[VkFeed Auto Listener] ✅ ...，...: ${this.checkIntervalMs}ms`);
    }

    /**
     * ...
     */
    stopListening() {
      if (!this.isListening) {
        console.log('[VkFeed Auto Listener] ...');
        return;
      }

      console.log('[VkFeed Auto Listener] 🔇 ......');
      this.isListening = false;

      if (this.checkInterval) {
        clearInterval(this.checkInterval);
        this.checkInterval = null;
      }

      console.log('[VkFeed Auto Listener] ✅ ...');
    }

    /**
     * ... - ...Forum-App...
     */
    async checkForUpdates() {
      // Если，
      if (!this.settings.enabled || this.isProcessingRequest) {
        return;
      }

      // ЕслиВКонтакте，
      if (window.vk_feedManager && window.vk_feedManager.isProcessing) {
        return; // ...
      }

      try {
        const chatData = await this.getCurrentChatData();
        if (!chatData || !chatData.messages) {
          return;
        }

        const currentCount = chatData.messages.length;
        const increment = currentCount - this.lastProcessedMessageCount;

        // Forum-App：Сообщения
        if (increment > 0) {
          if (window.DEBUG_WEIBO_AUTO_LISTENER) {
            console.log(
              `[VkFeed Auto Listener] ...Сообщения: +${increment} (${this.lastProcessedMessageCount} -> ${currentCount})`,
            );
          }

          if (increment >= this.settings.threshold) {
            console.log(`[VkFeed Auto Listener] 🚀 ... (${increment}/${this.settings.threshold})，...ВКонтакте...`);
            await this.handleChatUpdate(currentCount);
          } else {
            if (window.DEBUG_WEIBO_AUTO_LISTENER) {
              console.log(
                `[VkFeed Auto Listener] Сообщения... (${increment}/${this.settings.threshold})，...`,
              );
            }
          }
        }
        // ЕслиСообщения，（）
      } catch (error) {
        // ，
        if (Math.random() < 0.01) {
          console.error('[VkFeed Auto Listener] error:', error);
        }
      }
    }

    /**
     * ...
     */
    async handleChatUpdate(currentCount) {
      if (this.isProcessingRequest) {
        console.log('[VkFeed Auto Listener] ...，...');
        return;
      }

      try {
        this.isProcessingRequest = true;
        console.log('[VkFeed Auto Listener] 📝 ......');

        // ВКонтакте
        if (window.vk_feedManager && window.vk_feedManager.generateVkFeedContent) {
          const success = await window.vk_feedManager.generateVkFeedContent(false); // ...

          if (success) {
            console.log('[VkFeed Auto Listener] ✅ ВКонтакте...');
            this.lastProcessedMessageCount = currentCount;

            // Синхронизация сВКонтакте
            if (window.vk_feedManager) {
              window.vk_feedManager.lastProcessedCount = currentCount;
            }
          } else {
            console.log('[VkFeed Auto Listener] ⚠️ ВКонтакте...');
          }
        } else {
          console.warn('[VkFeed Auto Listener] ВКонтактеerror');
        }
      } catch (error) {
        console.error('[VkFeed Auto Listener] error:', error);
      } finally {
        // Статус，
        setTimeout(() => {
          this.isProcessingRequest = false;
          console.log('[VkFeed Auto Listener] 🔄 ...Статус...');
        }, 2000);
      }
    }

    /**
     * ... - ...Forum-App...
     */
    async getCurrentChatData() {
      try {
        if (window.mobileContextEditor) {
          return window.mobileContextEditor.getCurrentChatData();
        } else if (window.MobileContext) {
          return await window.MobileContext.loadChatToEditor();
        } else {
          // ，
          return null;
        }
      } catch (error) {
        // Forum-App：
        if (!this._lastErrorTime || Date.now() - this._lastErrorTime > 60000) {
          console.warn('[VkFeed Auto Listener] error:', error.message);
          this._lastErrorTime = Date.now();
        }
        return null;
      }
    }

    /**
     * ...Сообщения...
     */
    async updateLastProcessedCount() {
      try {
        const chatData = await this.getCurrentChatData();
        if (chatData && chatData.messages) {
          this.lastProcessedMessageCount = chatData.messages.length;
          console.log(`[VkFeed Auto Listener] ...Сообщения...: ${this.lastProcessedMessageCount}`);
        }
      } catch (error) {
        console.warn('[VkFeed Auto Listener] errorСообщенияerror:', error);
      }
    }

    /**
     * ...
     */
    enable() {
      this.settings.enabled = true;
      this.saveSettings();

      if (!this.isListening) {
        this.startListening();
      }

      console.log('[VkFeed Auto Listener] ✅ ...');
    }

    /**
     * ...
     */
    disable() {
      this.settings.enabled = false;
      this.saveSettings();

      if (this.isListening) {
        this.stopListening();
      }

      console.log('[VkFeed Auto Listener] ❌ ...');
    }

    /**
     * НастройкиСообщения...
     */
    setThreshold(threshold) {
      if (typeof threshold === 'number' && threshold > 0) {
        this.settings.threshold = threshold;
        this.saveSettings();
        console.log(`[VkFeed Auto Listener] ...Настройки...: ${threshold}`);
      } else {
        console.warn('[VkFeed Auto Listener] error:', threshold);
      }
    }

    /**
     * Настройки...
     */
    setCheckInterval(intervalMs) {
      if (typeof intervalMs === 'number' && intervalMs >= 1000) {
        this.checkIntervalMs = intervalMs;

        // Если，/* Приложение */
        if (this.isListening) {
          this.stopListening();
          setTimeout(() => {
            this.startListening();
          }, 100);
        }

        console.log(`[VkFeed Auto Listener] ...Настройки...: ${intervalMs}ms`);
      } else {
        console.warn('[VkFeed Auto Listener] error:', intervalMs);
      }
    }

    /**
     * ...
     */
    async manualCheck() {
      console.log('[VkFeed Auto Listener] 🔍 ......');

      try {
        // ，
        const originalEnabled = this.settings.enabled;
        this.settings.enabled = true;

        await this.checkForUpdates();

        // Настройки
        this.settings.enabled = originalEnabled;

        console.log('[VkFeed Auto Listener] ✅ ...');
      } catch (error) {
        console.error('[VkFeed Auto Listener] error:', error);
      }
    }

    /**
     * ...Статус
     */
    reset() {
      console.log('[VkFeed Auto Listener] 🔄 ...Статус...');

      this.stopListening();

      // Статус
      this.isProcessingRequest = false;
      this.lastProcessedMessageCount = 0;

      // Сообщения
      this.updateLastProcessedCount();

      // Если，
      if (this.settings.enabled) {
        setTimeout(() => {
          this.startListening();
        }, 1000);
      }

      console.log('[VkFeed Auto Listener] ✅ ...Статус...');
    }

    /**
     * ...Статус
     */
    getStatus() {
      return {
        isListening: this.isListening,
        isProcessingRequest: this.isProcessingRequest,
        lastProcessedMessageCount: this.lastProcessedMessageCount,
        settings: { ...this.settings },
        checkIntervalMs: this.checkIntervalMs,
      };
    }

    /**
     * ...
     */
    getDebugInfo() {
      const status = this.getStatus();

      return {
        ...status,
        hasVkFeedManager: !!window.vk_feedManager,
        hasContextEditor: !!window.mobileContextEditor,
        hasMobileContext: !!window.MobileContext,
        timestamp: new Date().toISOString(),
      };
    }

    /**
     * ...Сообщения...
     */
    async forceSyncMessageCount() {
      console.log('[VkFeed Auto Listener] 🔄 ...Сообщения......');

      try {
        const chatData = await this.getCurrentChatData();
        if (chatData && chatData.messages) {
          const oldCount = this.lastProcessedMessageCount;
          this.lastProcessedMessageCount = chatData.messages.length;

          // Синхронизация сВКонтакте
          if (window.vk_feedManager) {
            window.vk_feedManager.lastProcessedCount = this.lastProcessedMessageCount;
          }

          console.log(`[VkFeed Auto Listener] ✅ Сообщения...: ${oldCount} -> ${this.lastProcessedMessageCount}`);
        } else {
          console.warn('[VkFeed Auto Listener] error');
        }
      } catch (error) {
        console.error('[VkFeed Auto Listener] errorСообщенияerror:', error);
      }
    }

    /**
     * ...
     */
    checkDependencies() {
      const deps = {
        vk_feedManager: !!window.vk_feedManager,
        mobileContextEditor: !!window.mobileContextEditor,
        mobileContext: !!window.MobileContext,
      };

      // Статус
      const depsString = JSON.stringify(deps);
      if (this._lastDepsString !== depsString) {
        console.log('[VkFeed Auto Listener] ...Статус...:', deps);
        this._lastDepsString = depsString;
      }

      const allReady = Object.values(deps).some(ready => ready);
      if (!allReady && (!this._lastWarnTime || Date.now() - this._lastWarnTime > 300000)) {
        // 5
        console.warn('[VkFeed Auto Listener] ⚠️ error');
        this._lastWarnTime = Date.now();
      }

      return deps;
    }

    /**
     * ... - ...Forum-App...Статус...
     */
    ensureContinuousListening() {
      // ЕслиСтатус，
      if (this.isProcessingRequest) {
        const now = Date.now();
        const timeSinceLastCheck = now - (this._lastCheckTime || 0);

        // Если30Статус，
        if (timeSinceLastCheck > 30000) {
          console.warn('[VkFeed Auto Listener] errorСтатусerror，errorСтатус...');
          this.isProcessingRequest = false;
          this._lastCheckTime = now;
        }
      }

      // （）
      if (this.isListening && !this.checkInterval) {
        console.warn('[VkFeed Auto Listener] error，errorНастройки...');
        this.checkInterval = setInterval(this.checkForUpdates, this.checkIntervalMs);
      }
    }
  }

  // - Forum-App
  if (typeof window !== 'undefined') {
    // Настройки， forum-auto-listener.js
    window.VkFeedAutoListener = VkFeedAutoListener;
    window.vk_feedAutoListener = new VkFeedAutoListener();
    console.log('[VkFeed Auto Listener] ✅ ВКонтакте...');

    // Forum-App：Настройки（）
    setTimeout(() => {
      if (window.vk_feedAutoListener) {
        // 5Статус，
        setInterval(() => {
          try {
            window.vk_feedAutoListener.ensureContinuousListening();
          } catch (error) {
            console.error('[VkFeed Auto Listener] error:', error);
          }
        }, 300000); // 5...
      }
    }, 10000); // 10...
  }
} // ...
