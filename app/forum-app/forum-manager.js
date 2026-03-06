// ==SillyTavern Forum Manager==
// @name         Forum Manager for Mobile Extension
// @version      1.0.0
// @description Форум
// @author       Assistant

/**
 * Форум...
 * ...ФорумПост...、API...Редактировать...
 */
class RedditForumManager {
  constructor() {
    this.isInitialized = false;
    this.currentSettings = {
      enabled: true,
      selectedStyle: 'Аноним',
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

    // ：Статус
    this.isMonitoringGeneration = false;
    this.pendingInsertions = []; // ...Сообщения...
    this.generationCheckInterval = null;
    this.statusUpdateTimer = null; // Статус...
    this.maxWaitTime = 300000; // ...Время: 5...

    this.initialize = this.initialize.bind(this);
    this.generateForumContent = this.generateForumContent.bind(this);
    this.updateContextWithForum = this.updateContextWithForum.bind(this);
    this.checkGenerationStatus = this.checkGenerationStatus.bind(this);
    this.waitForGenerationComplete = this.waitForGenerationComplete.bind(this);
    this.processInsertionQueue = this.processInsertionQueue.bind(this);
  }

  /**
   * ...Форум...
   */
  async initialize() {
    try {
      console.log('[Reddit/Forum Manager] ......');

      // Настройки
      this.loadSettings();

      await this.waitForDependencies();

      // UI
      this.createForumUI();

      this.registerConsoleCommands();

      this.isInitialized = true;
      console.log('[Reddit/Forum Manager] ✅ ...');

      this.detectBrowserAndShowTips();
    } catch (error) {
      console.error('[Reddit/Forum Manager] error:', error);
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
   * ...
   */
  async waitForDependencies() {
    return new Promise(resolve => {
      const checkDeps = () => {
        const contextEditorReady = window.mobileContextEditor !== undefined;
        const customAPIReady = window.mobileCustomAPIConfig !== undefined;

        if (contextEditorReady && customAPIReady) {
          console.log('[Reddit/Forum Manager] ...');
          resolve();
        } else {
          console.log('[Reddit/Forum Manager] ......', {
            contextEditor: contextEditorReady,
            customAPI: customAPIReady,
          });
          setTimeout(checkDeps, 500);
        }
      };
      checkDeps();
    });
  }

  /**
   * ...ФорумUI... - ...，...
   */
  createForumUI() {
    console.log('[Reddit/Forum Manager] ✅ ФорумUI...');
  }

  /**
   * ...Форум...
   */
  showForumPanel() {
    // Если，
    if (document.getElementById('forum-panel-overlay')) {
      document.getElementById('forum-panel-overlay').style.display = 'flex';
      return;
    }

    const overlay = document.createElement('div');
    overlay.id = 'forum-panel-overlay';
    overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

    const panel = document.createElement('div');
    panel.id = 'forum-control-panel';
    panel.style.cssText = `
            background: #fff;
            border-radius: 15px;
            padding: 30px;
            width: 90%;
            max-width: 500px;
            max-height: 80%;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            color: white;
        `;

    panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #667eea;">📰 Форум...</h2>
                <button id="close-forum-panel" style="background: none; border: none; color: #ccc; font-size: 24px; cursor: pointer;">×</button>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 10px; color: #333;">...Форум...:</label>
                <select id="forum-style-select" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #444; background: #eee; color: #333;">
                    <!-- ...JavaScript... -->
                </select>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 10px; color: #333;">... (...):</label>
                <textarea id="forum-custom-prefix" placeholder="...，......"
                          style="width: 100%; height: 80px; padding: 10px; border-radius: 5px; border: 1px solid #444; background: #eee; color: #333; resize: vertical; font-family: monospace; font-size: 16px;"></textarea>
                <div style="margin-top: 5px; font-size: 16px; color: #333;">
                    ...: ...、...
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 10px; color: #333;">Сообщения... (...Форум...):</label>
                <input type="number" id="forum-threshold" value="${this.currentSettings.threshold}" min="1" max="100"
                       style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #444; background: #eee; color: #333;">
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: flex; align-items: center; color: #333; cursor: pointer;">
                    <input type="checkbox" id="forum-auto-update" ${this.currentSettings.autoUpdate ? 'checked' : ''}
                           style="margin-right: 10px;background: #fff;color: #333;">
                    ...Форум...
                </label>
            </div>

            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button id="generate-forum-now" style="flex: 1; padding: 12px; background: #667eea; color: #fff; border: none; border-radius: 5px; cursor: pointer; min-width: 120px;">
                    ...Форум
                </button>
                <button id="clear-forum-content" style="flex: 1; padding: 12px; background: #e74c3c; color: #fff; border: none; border-radius: 5px; cursor: pointer; min-width: 120px;">
                    ...Форум...
                </button>
                <button id="forum-settings" style="flex: 1; padding: 12px; background: #95a5a6; color: #fff; border: none; border-radius: 5px; cursor: pointer; min-width: 120px;">
                    APIНастройки
                </button>
            </div>

            <div id="forum-status" style="margin-top: 20px; padding: 10px; background: #2c3e50; border-radius: 5px; font-size: 12px; color: #fff;">
                Статус: ...
            </div>

            <div id="forum-queue-status" style="margin-top: 10px; padding: 8px; background: #34495e; border-radius: 5px; font-size: 11px; color: #ecf0f1;">
                <div style="font-weight: bold; margin-bottom: 5px;">🔄 ...Статус...</div>
                <div>SillyTavern...Статус: <span id="generation-status">......</span></div>
                <div>...: <span id="queue-count">0</span> ...</div>
                <div style="margin-top: 5px;">
                    <button id="clear-queue-btn" style="background: #e67e22; color: #fff; border: none; padding: 3px 8px; border-radius: 3px; font-size: 10px; cursor: pointer;">...</button>
                    <button id="refresh-status-btn" style="background: #3498db; color: #fff; border: none; padding: 3px 8px; border-radius: 3px; font-size: 10px; cursor: pointer; margin-left: 5px;">ОбновитьСтатус</button>
                </div>
            </div>
        `;

    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    this.initializePanelStyleSelector();

    // Настройки
    if (window.forumStyles) {
      document.getElementById('forum-custom-prefix').value = window.forumStyles.getCustomPrefix();
    }

    this.bindPanelEvents();
  }

  /**
   * ...
   */
  initializePanelStyleSelector() {
    const styleSelect = document.getElementById('forum-style-select');
    if (!styleSelect) return;

    try {
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
            customGroup.appendChild(option);
          });

          styleSelect.appendChild(customGroup);
        }
      }

      // Настройки
      if (this.currentSettings.selectedStyle) {
        styleSelect.value = this.currentSettings.selectedStyle;
      }

      // Если，
      if (!styleSelect.value && styleSelect.options.length > 0) {
        styleSelect.selectedIndex = 0;
        this.currentSettings.selectedStyle = styleSelect.value;
        this.saveSettings();
      }

      console.log('[RedditForumManager] ...，...', styleSelect.options.length, '...');
    } catch (error) {
      console.error('[RedditForumManager] error:', error);

      // ：
      styleSelect.innerHTML = '<option value="Аноним">Аноним</option>';
      styleSelect.value = 'Аноним';
      this.currentSettings.selectedStyle = 'Аноним';
    }
  }

  /**
   * ...
   */
  bindPanelEvents() {
    const overlay = document.getElementById('forum-panel-overlay');

    // Закрыть
    document.getElementById('close-forum-panel').addEventListener('click', () => {
      overlay.style.display = 'none';
      this.stopStatusUpdateTimer();
    });

    // Закрыть
    overlay.addEventListener('click', e => {
      if (e.target === overlay) {
        overlay.style.display = 'none';
        this.stopStatusUpdateTimer();
      }
    });

    // Стиль
    document.getElementById('forum-style-select').addEventListener('change', e => {
      this.currentSettings.selectedStyle = e.target.value;
      this.saveSettings();
    });

    // Настройки
    document.getElementById('forum-custom-prefix').addEventListener('input', e => {
      if (window.forumStyles) {
        window.forumStyles.setCustomPrefix(e.target.value);
      }
    });

    // /* Поле ввода */Сохранить
    document.getElementById('forum-custom-prefix').addEventListener('blur', e => {
      if (window.forumStyles) {
        window.forumStyles.setCustomPrefix(e.target.value);
        console.log('[Reddit/Forum Manager] ...');
      }
    });

    // Настройки
    document.getElementById('forum-threshold').addEventListener('change', e => {
      this.currentSettings.threshold = parseInt(e.target.value);
      this.saveSettings();
    });

    document.getElementById('forum-auto-update').addEventListener('change', e => {
      this.currentSettings.autoUpdate = e.target.checked;
      this.saveSettings();
    });

    // Форум
    document.getElementById('generate-forum-now').addEventListener('click', () => {
      console.log('[Reddit/Forum Manager] 🔘 ...（...forum-manager.js）');
      this.generateForumContent(true); // ...，...Сообщения...
    });

    // Форум
    document.getElementById('clear-forum-content').addEventListener('click', () => {
      this.clearForumContent();
    });

    // APIНастройки
    document.getElementById('forum-settings').addEventListener('click', () => {
      if (window.mobileCustomAPIConfig) {
        window.mobileCustomAPIConfig.showConfigPanel();
      } else {
        this.updateStatus('API...', 'error');
      }
    });

    // ：
    document.getElementById('clear-queue-btn').addEventListener('click', () => {
      this.clearQueue();
      this.updateQueueStatusDisplay();
    });

    document.getElementById('refresh-status-btn').addEventListener('click', () => {
      this.updateQueueStatusDisplay();
    });

    // Статус
    this.startStatusUpdateTimer();
  }

  /**
   * ...Форум...
   */
  async generateForumContent(force = false) {
    const caller = force ? '...' : '...';
    console.log(`[Reddit/Forum Manager] 📞 ...: ${caller}`);

    // Если，auto-listener
    if (force && window.forumAutoListener) {
      if (window.forumAutoListener.isProcessingRequest) {
        console.log('[Reddit/Forum Manager] ⚠️ auto-listener...，...');
      }
      window.forumAutoListener.isProcessingRequest = true;
      console.log('[Reddit/Forum Manager] 🚫 ...auto-listener...');
    }

    // - Safari
    if (this.isProcessing) {
      console.log('[Reddit/Forum Manager] ...，...Safari......');

      // Safari：，Статус
      if (force) {
        console.log('[Reddit/Forum Manager] 🍎 Safari...：...Статус');
        this.isProcessing = false;
        if (window.forumAutoListener) {
          window.forumAutoListener.isProcessingRequest = false;
        }
        // ，Назадfalse
      } else {
        console.log('[Reddit/Forum Manager] ...，...');
        this.updateStatus('...，......', 'warning');

        // Если，auto-listenerСтатус
        if (force && window.forumAutoListener) {
          window.forumAutoListener.isProcessingRequest = false;
        }
        return false;
      }
    }

    // Если，auto-listener
    let autoListenerPaused = false;
    if (force && window.forumAutoListener && window.forumAutoListener.isListening) {
      autoListenerPaused = true;
      // Настройки，auto-listener
      window.forumAutoListener.isProcessingRequest = true;
      console.log('[Reddit/Forum Manager] 🔄 ...auto-listener（Настройки...）');
    }

    // Сообщения
    try {
      const chatData = await this.getCurrentChatData();
      if (!chatData || !chatData.messages || chatData.messages.length === 0) {
        console.log('[Reddit/Forum Manager] ...，...');
        return false;
      }

      // Сообщения
      if (!force) {
        // Сообщения
        const currentCount = chatData.messages.length;
        const increment = currentCount - this.lastProcessedCount;

        if (increment < this.currentSettings.threshold) {
          console.log(
            `[Reddit/Forum Manager] [...] Сообщения... (${increment}/${this.currentSettings.threshold})，...`,
          );
          return false;
        }
      } else {
        console.log('[Reddit/Forum Manager] 🚀 ...，...Сообщения...');
      }

      this.isProcessing = true;
      this.updateStatus('...Форум......', 'info');

      const currentCount = chatData.messages.length;
      const increment = currentCount - this.lastProcessedCount;
      console.log(`[Reddit/Forum Manager] ...Форум... (Сообщения...: ${currentCount}, ...: ${increment}, ...: ${force})`);

      // 2. APIФорум
      const forumContent = await this.callForumAPI(chatData);
      if (!forumContent) {
        throw new Error('APIНазадerror');
      }

      // 3. Редактировать1（Статус）
      const success = await this.safeUpdateContextWithForum(forumContent);
      if (success) {
        this.updateStatus('Форум...1...', 'success');
        this.lastProcessedCount = currentCount;

        // Синхронизация сauto-listener
        if (window.forumAutoListener) {
          window.forumAutoListener.lastProcessedMessageCount = currentCount;
        }

        // ОбновитьФорумUI
        this.clearForumUICache();

        console.log(`[Reddit/Forum Manager] ✅ Форум...`);
        return true;
      } else {
        throw new Error('error');
      }
    } catch (error) {
      console.error('[Reddit/Forum Manager] errorФорумerror:', error);
      this.updateStatus(`...: ${error.message}`, 'error');

      if (window.showMobileToast) {
        window.showMobileToast(`❌ Форум...: ${error.message}`, 'error');
      }

      return false;
    } finally {
      // Статус
      this.isProcessing = false;

      // auto-listener
      if (autoListenerPaused && force) {
        setTimeout(() => {
          if (window.forumAutoListener) {
            window.forumAutoListener.isProcessingRequest = false;
            console.log('[Reddit/Forum Manager] 🔄 ...auto-listener（...）');
          }
        }, 2000); // 2...，...
      }

      // Статус，
      setTimeout(() => {
        if (this.isProcessing) {
          console.warn('[Reddit/Forum Manager] errorСтатус');
          this.isProcessing = false;
        }
      }, 5000);

      // Уведомлениеauto-listener
      if (window.forumAutoListener) {
        window.forumAutoListener.isProcessingRequest = false;
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
      console.error('[Reddit/Forum Manager] error:', error);
      throw error;
    }
  }

  /**
   * ...ФорумAPI
   */
  async callForumAPI(chatData) {
    try {
      console.log('🚀 [ФорумAPI] ===== ...Форум... =====');

      // API
      if (!window.mobileCustomAPIConfig || !window.mobileCustomAPIConfig.isAPIAvailable()) {
        throw new Error('errorAPI');
      }

      const contextInfo = this.buildContextInfo(chatData);

      // （Форум）
      const stylePrompt = window.forumStyles
        ? window.forumStyles.getStylePrompt(this.currentSettings.selectedStyle, 'generate')
        : '';

      console.log('📋 [ФорумAPI] ...（...Форум）:');
      console.log(stylePrompt);
      console.log('\n📝 [ФорумAPI] ПользовательСообщения...:');
      console.log(`...Форум...：\n\n${contextInfo}`);

      // API
      const messages = [
        {
          role: 'system',
          content: `${stylePrompt}\n\n🎯 【...】：\n- ...ПодписатьсяПользователь...Написать пост...，...⭐...\n- ...Пользователь...、...\n- ...Форум...Пользователь...\n- ...Пользователь...，...Форум...`,
        },
        {
          role: 'user',
          content: `🎯 ...Форум...，...Пользователь...Написать пост...：\n\n${contextInfo}`,
        },
      ];

      console.log('📡 [ФорумAPI] ...API...:');
      console.log(JSON.stringify(messages, null, 2));

      // API
      const response = await window.mobileCustomAPIConfig.callAPI(messages, {
        temperature: 0.8,
        max_tokens: 2000,
      });

      console.log('📥 [ФорумAPI] ...Назад...:');
      console.log(response);

      if (response && response.content) {
        console.log('✅ [ФорумAPI] ...Форум...:');
        console.log(response.content);
        console.log('🏁 [ФорумAPI] ===== Форум... =====\n');
        return response.content;
      } else {
        throw new Error('APIНазадerror');
      }
    } catch (error) {
      console.error('❌ [ФорумAPI] APIerror:', error);
      console.log('🏁 [ФорумAPI] ===== Форум... =====\n');
      throw error;
    }
  }

  /**
   * ...（...5...1...）
   */
  buildContextInfo(chatData) {
    let contextInfo = `...: ${chatData.characterName || '...'}\n`;
    contextInfo += `Сообщения...: ${chatData.messages.length}\n\n`;

    const messages = chatData.messages;
    const selectedMessages = [];

    // 1. 1（0），，/* Список */
    if (messages.length > 0 && messages[0].mes && messages[0].mes.trim()) {
      let firstFloorContent = messages[0].mes;

      // Форум
      const forumRegex = /<!-- FORUM_CONTENT_START -->([\s\S]*?)<!-- FORUM_CONTENT_END -->/;
      const forumMatch = firstFloorContent.match(forumRegex);
      const hasForumContent = !!forumMatch;

      // ЕслиФорум，Форум
      if (hasForumContent) {
        firstFloorContent = forumMatch[1].trim(); // ...
        console.log('📋 [...] ...1...：...Форум...');
        console.log('...:', firstFloorContent);
      } else {
        console.log('📋 [...] ...1...：...Форум...，...');
      }

      selectedMessages.push({
        ...messages[0],
        mes: firstFloorContent,
        floor: 1,
        isFirstFloor: true,
        hasForumContent: hasForumContent,
      });
    }

    // 2. 3Сообщения（1，）
    const lastFiveMessages = messages.slice(-3);
    lastFiveMessages.forEach((msg, index) => {
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
    const userForumPosts = [];
    const userReplies = [];

    userMessages.forEach(msg => {
      if (msg.isFirstFloor && msg.hasForumContent) {
        userForumPosts.push(msg);
      } else if (msg.mes && msg.mes.trim()) {
        userReplies.push(msg);
      }
    });

    // 5.
    contextInfo += '...:\n';

    // ПользовательФорум
    if (userForumPosts.length > 0 || userReplies.length > 0) {
      contextInfo += '\n⭐ 【...Подписаться：ПользовательФорум...】\n';

      if (userForumPosts.length > 0) {
        contextInfo += '👤 Пользователь...Написать пост...：\n';
        userForumPosts.forEach(msg => {
          contextInfo += `  📝 [ПользовательНаписать пост] ${msg.mes}\n`;
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

      contextInfo += '⚠️ ...Форум.../* Приложение */...Написать пост...、...！\n\n';
    }

    contextInfo += '...:\n';
    uniqueMessages.forEach(msg => {
      const speaker = msg.is_user ? '👤Пользователь' : `🤖${chatData.characterName || '...'}`;
      let floorInfo = '';
      let attentionMark = '';

      if (msg.isFirstFloor) {
        floorInfo = msg.hasForumContent ? '[...1...-...Форум]' : '[...1...]';
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
    console.log(`[...] ...1...Форум...: ${uniqueMessages.some(m => m.isFirstFloor && m.hasForumContent)}`);
    console.log(`[...] ...Сообщения...: ${uniqueMessages.filter(m => m.isRecentMessage).length}`);
    console.log('📝 [...] ...:');
    console.log(contextInfo);
    console.log('🏁 [...] ===== ... =====\n');

    return contextInfo;
  }

  /**
   * ...Редактировать...1...
   */
  async updateContextWithForum(forumContent) {
    try {
      console.log('[Reddit/Forum Manager] ...1...Форум......');

      // Редактировать
      if (!window.mobileContextEditor) {
        throw new Error('errorРедактироватьerror');
      }

      const chatData = window.mobileContextEditor.getCurrentChatData();
      if (!chatData || !chatData.messages || chatData.messages.length === 0) {
        throw new Error('error');
      }

      // Форум（）
      const forumSection = `\n\n<!-- FORUM_CONTENT_START -->\n【Форум...】\n\n${forumContent}\n\n---\n[...Форум...]\n<!-- FORUM_CONTENT_END -->`;

      // 1
      if (chatData.messages.length >= 1) {
        const firstMessage = chatData.messages[0];
        let originalContent = firstMessage.mes || '';

        // Форум
        const existingForumRegex = /<!-- FORUM_CONTENT_START -->[\s\S]*?<!-- FORUM_CONTENT_END -->/;
        if (existingForumRegex.test(originalContent)) {
          // ЕслиФорум，
          console.log('[Reddit/Forum Manager] ...Форум...，......');

          // Форум
          const existingForumMatch = originalContent.match(existingForumRegex);
          const existingForumContent = existingForumMatch ? existingForumMatch[0] : '';

          // Умное слияниеФорум
          const mergedForumContent = await this.mergeForumContent(existingForumContent, forumContent);

          // Форум，
          originalContent = originalContent.replace(existingForumRegex, '').trim();

          const mergedForumSection = `\n\n<!-- FORUM_CONTENT_START -->\n【Форум...】\n\n${mergedForumContent}\n\n---\n[...Форум...]\n<!-- FORUM_CONTENT_END -->`;

          // Форум
          const newContent = originalContent + mergedForumSection;

          // 1
          const success = await window.mobileContextEditor.modifyMessage(0, newContent);
          if (success) {
            console.log('[Reddit/Forum Manager] ✅ Форум...');
            return true;
          } else {
            throw new Error('modifyMessageНазадfalse');
          }
        }

        // Форум
        const newContent = originalContent + forumSection;

        // 1
        const success = await window.mobileContextEditor.modifyMessage(0, newContent);
        if (success) {
          console.log('[Reddit/Forum Manager] ✅ ...1...Форум...');
          return true;
        } else {
          throw new Error('modifyMessageНазадfalse');
        }
      } else {
        // ЕслиСообщения，Сообщения（Форум）
        const messageIndex = await window.mobileContextEditor.addMessage(forumSection.trim(), false, 'Форум...');
        if (messageIndex >= 0) {
          console.log('[Reddit/Forum Manager] ✅ ...1...（...Форум...）...');
          return true;
        } else {
          throw new Error('addMessageНазадerror');
        }
      }
    } catch (error) {
      console.error('[Reddit/Forum Manager] error1error:', error);
      return false;
    }
  }

  /**
   * ...Форум...
   * @param {string} existingForumContent - ...Форум...（...）
   * @param {string} newForumContent - ...Форум...
   * @returns {string} ...Форум...
   */
  async mergeForumContent(existingForumContent, newForumContent) {
    try {
      console.log('[Reddit/Forum Manager] 🔄 ...Форум......');

      // Форум（）
      const existingContentMatch = existingForumContent.match(
        /<!-- FORUM_CONTENT_START -->\s*【Форум...】\s*([\s\S]*?)\s*---\s*\[...Форум...\]\s*<!-- FORUM_CONTENT_END -->/,
      );
      const existingContent = existingContentMatch ? existingContentMatch[1].trim() : '';

      console.log('[Reddit/Forum Manager] 📋 ...Форум...:');
      console.log(existingContent);
      console.log('[Reddit/Forum Manager] 📋 ...Форум...:');
      console.log(newForumContent);

      const existingData = this.parseForumContent(existingContent);
      console.log('[Reddit/Forum Manager] 📊 ...:', existingData);

      const newData = this.parseForumContent(newForumContent);
      console.log('[Reddit/Forum Manager] 📊 ...:', newData);

      const mergedThreads = new Map();
      const mergedReplies = new Map();

      // 1. Пост
      existingData.threads.forEach(thread => {
        mergedThreads.set(thread.id, thread);
        mergedReplies.set(thread.id, existingData.replies[thread.id] || []);
      });

      // 2.
      const currentTime = new Date();
      newData.threads.forEach(newThread => {
        if (mergedThreads.has(newThread.id)) {
          // ЕслиПост，，Ответить
          console.log(`[Reddit/Forum Manager] 📝 ...Пост ${newThread.id} ...，...Ответить...`);
        } else {
          // ЕслиПост，НастройкиВремя
          console.log(`[Reddit/Forum Manager] ✨ ...Пост: ${newThread.id}`);
          newThread.timestamp = currentTime.toLocaleString();
          newThread.latestActivityTime = currentTime; // Настройки...Date...，...
          mergedThreads.set(newThread.id, newThread);
          mergedReplies.set(newThread.id, []);
        }
      });

      // 3. Ответить
      newData.threads.forEach(newThread => {
        const newThreadReplies = newData.replies[newThread.id] || [];
        const existingReplies = mergedReplies.get(newThread.id) || [];

        // Ответить，
        const allReplies = [...existingReplies];
        newThreadReplies.forEach(newReply => {
          // ：
          const isDuplicate = allReplies.some(
            existingReply =>
              existingReply.author === newReply.author &&
              existingReply.content.includes(newReply.content.substring(0, 20)),
          );

          if (!isDuplicate) {
            // ОтветитьНастройкиВремя，
            newReply.timestamp = currentTime.toLocaleString();
            newReply.sortTimestamp = currentTime.getTime(); // ...Время...

            allReplies.push(newReply);
            console.log(`[Reddit/Forum Manager] 💬 ...Ответить...Пост ${newThread.id}: ${newReply.author}`);

            // ЕслиПостОтветить，ПостНовоеВремя
            if (mergedThreads.has(newThread.id)) {
              const existingThread = mergedThreads.get(newThread.id);
              existingThread.latestActivityTime = currentTime;
              existingThread.timestamp = currentTime.toLocaleString(); // ...Время...
              console.log(`[Reddit/Forum Manager] 📝 ...Пост ${newThread.id} ...Новое...Время`);
            }
          }
        });

        mergedReplies.set(newThread.id, allReplies);
      });

      // 4. Форум
      const mergedContent = this.buildForumContent(mergedThreads, mergedReplies);

      console.log('[Reddit/Forum Manager] ✅ Форум...');
      console.log('[Reddit/Forum Manager] 📋 ...:');
      console.log(mergedContent);

      return mergedContent;
    } catch (error) {
      console.error('[Reddit/Forum Manager] ❌ errorФорумerror:', error);
      // Если，Назад
      return newForumContent;
    }
  }

  /**
   * ...Форум...
   * @param {string} forumContent - Форум...
   * @returns {object} ... {threads: [], replies: {}}
   */
  parseForumContent(forumContent) {
    const threads = [];
    const replies = {};

    if (!forumContent || forumContent.trim() === '') {
      return { threads, replies };
    }

    // : [|Написать постНикнейм|Постid||Пост]
    const titleRegex = /\[...\|([^|]+)\|([^|]+)\|([^|]+)\|([^\]]+)\]/g;
    // Ответить: [Ответ|Никнейм|Постid|Ответить]
    const replyRegex = /\[Ответить\|([^|]+)\|([^|]+)\|([^\]]+)\]/g;
    // : [|Никнейм|Постid||Ответить]
    const subReplyRegex = /\[...\|([^|]+)\|([^|]+)\|([^|]+)\|([^\]]+)\]/g;

    let match;

    let threadIndex = 0;
    while ((match = titleRegex.exec(forumContent)) !== null) {
      // ПостНастройкиВремя，
      const baseTime = new Date('2024-01-01 10:00:00');
      const threadTime = new Date(baseTime.getTime() + threadIndex * 60000); // ...Пост...1...

      const thread = {
        id: match[2],
        author: match[1],
        title: match[3],
        content: match[4],
        timestamp: threadTime.toLocaleString(),
        latestActivityTime: threadTime, // ...Время...ОпубликоватьВремя
      };

      threads.push(thread);
      replies[thread.id] = [];
      threadIndex++;
    }

    // Ответить
    let replyIndex = 0;
    while ((match = replyRegex.exec(forumContent)) !== null) {
      // ОтветитьНастройкиВремя，
      const baseTime = new Date('2024-01-01 11:00:00');
      const replyTime = new Date(baseTime.getTime() + replyIndex * 30000); // ...Ответить...30...

      const reply = {
        id: `reply_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        threadId: match[2],
        author: match[1],
        content: match[3],
        timestamp: replyTime.toLocaleString(),
        type: 'reply',
        subReplies: [],
      };

      if (replies[reply.threadId]) {
        replies[reply.threadId].push(reply);

        // ПостНовоеВремя
        const thread = threads.find(t => t.id === reply.threadId);
        if (thread && replyTime > thread.latestActivityTime) {
          thread.latestActivityTime = replyTime;
        }
      }
      replyIndex++;
    }

    // Ответить
    let subReplyIndex = 0;
    while ((match = subReplyRegex.exec(forumContent)) !== null) {
      // ОтветитьНастройкиВремя
      const baseTime = new Date('2024-01-01 12:00:00');
      const subReplyTime = new Date(baseTime.getTime() + subReplyIndex * 15000); // ...Ответить...15...

      const subReply = {
        id: `subreply_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        threadId: match[2],
        author: match[1],
        content: match[4],
        parentFloor: match[3],
        timestamp: subReplyTime.toLocaleString(),
        type: 'subreply',
      };

      // ОтветитьОтветить
      if (replies[subReply.threadId]) {
        const parentReply = replies[subReply.threadId].find(r => r.author === subReply.parentFloor);
        if (parentReply) {
          if (!parentReply.subReplies) {
            parentReply.subReplies = [];
          }
          parentReply.subReplies.push(subReply);
        } else {
          // Если，Ответить
          subReply.type = 'reply';
          subReply.subReplies = [];
          replies[subReply.threadId].push(subReply);
        }

        // ПостНовоеВремя
        const thread = threads.find(t => t.id === subReply.threadId);
        if (thread && subReplyTime > thread.latestActivityTime) {
          thread.latestActivityTime = subReplyTime;
        }
      }
      subReplyIndex++;
    }

    return { threads, replies };
  }

  /**
   * ...Форум...
   * @param {Map} threadsMap - ПостMap
   * @param {Map} repliesMap - ОтветитьMap
   * @returns {string} ...Форум...
   */
  buildForumContent(threadsMap, repliesMap) {
    let content = '';

    // ПостНовоеВремя（ОтветитьВремя）
    const threadsWithActivity = Array.from(threadsMap.values()).map(thread => {
      const threadReplies = repliesMap.get(thread.id) || [];
      let latestActivityTime = new Date(thread.timestamp);

      // ОтветитьВремя，Новое
      threadReplies.forEach(reply => {
        const replyTime = new Date(reply.timestamp);
        if (replyTime > latestActivityTime) {
          latestActivityTime = replyTime;
        }

        // ОтветитьВремя
        if (reply.subReplies && reply.subReplies.length > 0) {
          reply.subReplies.forEach(subReply => {
            const subReplyTime = new Date(subReply.timestamp);
            if (subReplyTime > latestActivityTime) {
              latestActivityTime = subReplyTime;
            }
          });
        }
      });

      return {
        ...thread,
        latestActivityTime: latestActivityTime,
      };
    });

    // НовоеВремя（НовоеПост）
    const sortedThreads = threadsWithActivity.sort((a, b) => {
      return new Date(b.latestActivityTime) - new Date(a.latestActivityTime);
    });

    sortedThreads.forEach(thread => {
      // Пост
      content += `[...|${thread.author}|${thread.id}|${thread.title}|${thread.content}]\n\n`;

      // Ответить
      const threadReplies = repliesMap.get(thread.id) || [];
      threadReplies.forEach(reply => {
        content += `[Ответ|${reply.author}|${reply.threadId}|${reply.content}]\n`;

        // Ответить
        if (reply.subReplies && reply.subReplies.length > 0) {
          reply.subReplies.forEach(subReply => {
            content += `[...|${subReply.author}|${subReply.threadId}|${subReply.parentFloor}|${subReply.content}]\n`;
          });
        }
      });

      content += '\n';
    });

    return content.trim();
  }

  /**
   * ...Форум...
   * @returns {string} ...Форум...
   */
  async getCurrentForumContent() {
    try {
      if (!window.mobileContextEditor) {
        throw new Error('errorРедактироватьerror');
      }

      const chatData = window.mobileContextEditor.getCurrentChatData();
      if (!chatData || !chatData.messages || chatData.messages.length === 0) {
        return '';
      }

      const firstMessage = chatData.messages[0];
      if (!firstMessage || !firstMessage.mes) {
        return '';
      }

      // Форум
      const forumRegex =
        /<!-- FORUM_CONTENT_START -->\s*【Форум...】\s*([\s\S]*?)\s*---\s*\[...Форум...\]\s*<!-- FORUM_CONTENT_END -->/;
      const match = firstMessage.mes.match(forumRegex);

      return match ? match[1].trim() : '';
    } catch (error) {
      console.error('[Reddit/Forum Manager] errorФорумerror:', error);
      return '';
    }
  }

  /**
   * ...Форум...
   */
  async clearForumContent() {
    try {
      this.updateStatus('...Форум......', 'info');

      if (!window.mobileContextEditor) {
        throw new Error('errorРедактироватьerror');
      }

      const chatData = window.mobileContextEditor.getCurrentChatData();
      if (!chatData || !chatData.messages || chatData.messages.length === 0) {
        throw new Error('error');
      }

      // 1Форум
      const firstMessage = chatData.messages[0];
      if (firstMessage && firstMessage.mes) {
        const originalContent = firstMessage.mes;
        const forumRegex = /<!-- FORUM_CONTENT_START -->[\s\S]*?<!-- FORUM_CONTENT_END -->/;

        if (forumRegex.test(originalContent)) {
          // Форум
          const cleanedContent = originalContent.replace(forumRegex, '').trim();

          if (cleanedContent === '') {
            // ЕслиФорумСообщения，УдалитьСообщения
            const success = await window.mobileContextEditor.deleteMessage(0);
            if (success) {
              this.updateStatus('Форум...（Сообщения...Удалить）', 'success');
              console.log('[Reddit/Forum Manager] ✅ ...1...Форум...，Сообщения...Удалить');
            } else {
              throw new Error('УдалитьerrorСообщенияerror');
            }
          } else {
            // Если，Сообщения
            const success = await window.mobileContextEditor.modifyMessage(0, cleanedContent);
            if (success) {
              this.updateStatus('Форум...（...）', 'success');
              console.log('[Reddit/Forum Manager] ✅ ...1...Форум...，...');
            } else {
              throw new Error('errorСообщенияerror');
            }
          }
        } else {
          this.updateStatus('...1...Форум...', 'warning');
          console.log('[Reddit/Forum Manager] ...1...Форум...');
        }
      } else {
        this.updateStatus('...1...Сообщения...', 'warning');
      }

      // Статус - Safari
      this.isProcessing = false;

      // auto-listenerСтатус -
      if (window.forumAutoListener) {
        window.forumAutoListener.isProcessingRequest = false;
      }

      // ОбновитьФорумUI
      this.clearForumUICache();

      console.log('[Reddit/Forum Manager] 🔄 ...，Статус...（...Safari）');
    } catch (error) {
      console.error('[Reddit/Forum Manager] errorФорумerror:', error);
      this.updateStatus(`...: ${error.message}`, 'error');

      // Статус - ，setTimeout
      this.isProcessing = false;
      if (window.forumAutoListener) {
        window.forumAutoListener.isProcessingRequest = false;
      }
    } finally {
      // Safari：
      this.isProcessing = false;
      if (window.forumAutoListener) {
        window.forumAutoListener.isProcessingRequest = false;
      }

      // ：
      setTimeout(() => {
        this.isProcessing = false;
        if (window.forumAutoListener) {
          window.forumAutoListener.isProcessingRequest = false;
        }
        console.log('[Reddit/Forum Manager] 🛡️ ...Статус...（...）');
      }, 500); // ...500ms，...
    }
  }

  /**
   * ОбновитьФорумUI...
   */
  clearForumUICache() {
    try {
      // ОбновитьФорумUI，ФорумUI，
      if (window.forumUI && window.forumUI.refreshThreadList) {
        window.forumUI.refreshThreadList();
        console.log('[Reddit/Forum Manager] ✅ ФорумUI...Обновить');
      }

      // ЕслиФорумUI，Обновить
      if (window.mobileForumUI && window.mobileForumUI.refreshThreadList) {
        window.mobileForumUI.refreshThreadList();
        console.log('[Reddit/Forum Manager] ✅ ...ФорумUI...Обновить');
      }

      // localStorageФорум（）
      const forumDataKeys = ['mobile_forum_threads', 'mobile_forum_replies', 'mobile_forum_cache'];

      forumDataKeys.forEach(key => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          console.log(`[Reddit/Forum Manager] ✅ ...localStorage...${key}`);
        }
      });
    } catch (error) {
      console.warn('[Reddit/Forum Manager] ОбновитьФорумUIerror:', error);
    }
  }

  /**
   * ...Ответить...API
   */
  async sendReplyToAPI(replyFormat) {
    try {
      console.log('💬 [ОтветитьAPI] ===== ...ПользовательОтветить =====');
      this.updateStatus('...Ответить...', 'info');

      // API
      if (!window.mobileCustomAPIConfig || !window.mobileCustomAPIConfig.isAPIAvailable()) {
        throw new Error('errorAPI');
      }

      const chatData = await this.getCurrentChatData();
      if (!chatData || !chatData.messages || chatData.messages.length === 0) {
        throw new Error('error');
      }

      const contextInfo = this.buildContextInfo(chatData);

      // （ПользовательОтветить）
      const stylePrompt = window.forumStyles
        ? window.forumStyles.getStylePrompt(this.currentSettings.selectedStyle, 'reply')
        : '';

      console.log('📋 [ОтветитьAPI] ...（ПользовательОтветить）:');
      console.log(stylePrompt);
      console.log('\n💭 [ОтветитьAPI] ПользовательОтветить...:');
      console.log(replyFormat);
      console.log('\n📝 [ОтветитьAPI] ...ПользовательСообщения:');
      const userMessage = `🎯 ...ПользовательОтветить，...ПользовательОтветить...AIОтветить...Форум...：

📋 ...：
${contextInfo}

💬 Пользователь...Опубликовать...Ответить：
${replyFormat}

🎯 【...】：
1. ...Форум...Пользователь...Опубликовать...Ответить
2. ...ПользовательОтветить...Ответить...
3. ...Форум...
4. ...Форум...，...Пост、ПользовательОтветить、...AI...Ответить
5. ...Пользователь...Ответить...Форум...`;
      console.log(userMessage);

      // API，ПользовательОтветить
      const messages = [
        {
          role: 'system',
          content: `${stylePrompt}\n\n🎯 【Ответить...】：\n- ...Пользователь...ФорумОтветить\n- ...ПользовательОтветить...Форум...\n- Пользователь...Ответить...\n- ...Форум...\n- ...Форум...，...`,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ];

      console.log('📡 [ОтветитьAPI] ...API...:');
      console.log(JSON.stringify(messages, null, 2));

      // API
      const response = await window.mobileCustomAPIConfig.callAPI(messages, {
        temperature: 0.8,
        max_tokens: 2000,
      });

      console.log('📥 [ОтветитьAPI] ...Назад...:');
      console.log(response);

      if (response && response.content) {
        console.log('✅ [ОтветитьAPI] ...Форум...:');
        console.log(response.content);

        // Форум（Статус）
        const success = await this.safeUpdateContextWithForum(response.content);
        if (success) {
          this.updateStatus('Ответить...Форум...', 'success');
          this.clearForumUICache(); // ОбновитьUI
          console.log('🏁 [ОтветитьAPI] ===== ПользовательОтветить... =====\n');
          return true;
        } else {
          throw new Error('errorФорумerror');
        }
      } else {
        throw new Error('APIНазадerror');
      }
    } catch (error) {
      console.error('❌ [ОтветитьAPI] errorОтветитьerror:', error);
      console.log('🏁 [ОтветитьAPI] ===== ПользовательОтветить... =====\n');
      this.updateStatus(`...Ответить...: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * ...API
   */
  async sendPostToAPI(postFormat) {
    try {
      console.log('📝 [Написать постAPI] ===== ...Опубликовать... =====');
      this.updateStatus('...ОпубликоватьПост...', 'info');

      // API
      if (!window.mobileCustomAPIConfig || !window.mobileCustomAPIConfig.isAPIAvailable()) {
        throw new Error('errorAPI');
      }

      const chatData = await this.getCurrentChatData();
      if (!chatData || !chatData.messages || chatData.messages.length === 0) {
        throw new Error('error');
      }

      const contextInfo = this.buildContextInfo(chatData);

      // （ПользовательНаписать пост）
      const stylePrompt = window.forumStyles
        ? window.forumStyles.getStylePrompt(this.currentSettings.selectedStyle, 'post')
        : '';

      console.log('📋 [Написать постAPI] ...（ПользовательНаписать пост）:');
      console.log(stylePrompt);
      console.log('\n📝 [Написать постAPI] ПользовательОпубликовать...Пост:');
      console.log(postFormat);
      console.log('\n📝 [Написать постAPI] ...ПользовательСообщения:');
      const userMessage = `...ПользовательОпубликовать...Пост，...Форум...：\n\n${contextInfo}\n\nПользовательОпубликовать...Пост：${postFormat}`;
      console.log(userMessage);

      // API，Пользователь
      const messages = [
        {
          role: 'system',
          content: stylePrompt,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ];

      console.log('📡 [Написать постAPI] ...API...:');
      console.log(JSON.stringify(messages, null, 2));

      // API
      const response = await window.mobileCustomAPIConfig.callAPI(messages, {
        temperature: 0.8,
        max_tokens: 2000,
      });

      console.log('📥 [Написать постAPI] ...Назад...:');
      console.log(response);

      if (response && response.content) {
        console.log('✅ [Написать постAPI] ...Форум...:');
        console.log(response.content);

        // Форум（Статус）
        const success = await this.safeUpdateContextWithForum(response.content);
        if (success) {
          this.updateStatus('Пост...Опубликовать...Форум...', 'success');
          this.clearForumUICache(); // ОбновитьUI
          console.log('🏁 [Написать постAPI] ===== ...Опубликовать... =====\n');
          return true;
        } else {
          throw new Error('errorФорумerror');
        }
      } else {
        throw new Error('APIНазадerror');
      }
    } catch (error) {
      console.error('❌ [Написать постAPI] ОпубликоватьПостerror:', error);
      console.log('🏁 [Написать постAPI] ===== ...Опубликовать... =====\n');
      this.updateStatus(`ОпубликоватьПост...: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * ...Ответить...Сообщения...Форум...（...Статус...）
   */
  async insertReplyToFirstLayer(replyPrefix, replyFormat) {
    try {
      console.log('[Reddit/Forum Manager] 🔒 ...Ответить...1......');

      if (this.checkGenerationStatus()) {
        console.log('[Reddit/Forum Manager] ⚠️ ...SillyTavern...Ответить，...Ответить......');
        return this.queueInsertion('reply', replyFormat, { replyPrefix, replyFormat });
      }

      this.updateStatus('...Ответить...', 'info');

      if (!window.mobileContextEditor) {
        throw new Error('errorРедактироватьerror');
      }

      const chatData = window.mobileContextEditor.getCurrentChatData();
      if (!chatData || !chatData.messages || chatData.messages.length === 0) {
        throw new Error('error');
      }

      // Сообщения
      const firstMessage = chatData.messages[0];
      let newContent = '';

      if (firstMessage && firstMessage.mes) {
        const originalContent = firstMessage.mes;

        // Форум
        const forumStartMarker = '<!-- FORUM_CONTENT_START -->';
        const forumEndMarker = '<!-- FORUM_CONTENT_END -->';

        const startIndex = originalContent.indexOf(forumStartMarker);
        const endIndex = originalContent.indexOf(forumEndMarker);

        if (startIndex !== -1 && endIndex !== -1) {
          // ЕслиФорум，Ответить
          const beforeForum = originalContent.substring(0, endIndex);
          const afterForum = originalContent.substring(endIndex);

          // ФорумОтветить
          newContent = beforeForum + '\n\n' + replyPrefix + '\n' + replyFormat + '\n' + afterForum;
        } else {
          // ЕслиФорум，Ответить
          newContent =
            originalContent +
            '\n\n' +
            forumStartMarker +
            '\n\n' +
            replyPrefix +
            '\n' +
            replyFormat +
            '\n\n' +
            forumEndMarker;
        }
      } else {
        // ЕслиСообщения，Форум/* Структура */
        newContent = `<!-- FORUM_CONTENT_START -->\n\n${replyPrefix}\n${replyFormat}\n\n<!-- FORUM_CONTENT_END -->`;
      }

      // Сообщения
      const success = await window.mobileContextEditor.modifyMessage(0, newContent);
      if (success) {
        this.updateStatus('Ответить...Форум...', 'success');
        console.log('[Reddit/Forum Manager] ✅ Ответить...Форум...');

        // ОбновитьUI
        this.clearForumUICache();
        return true;
      } else {
        throw new Error('errorСообщенияerror');
      }
    } catch (error) {
      console.error('[Reddit/Forum Manager] errorОтветитьerror:', error);
      this.updateStatus(`...Ответить...: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * ...Форум...
   */
  async checkAutoGenerate() {
    if (!this.currentSettings.autoUpdate || this.isProcessing) {
      return false;
    }

    // auto-listener
    if (window.forumAutoListener && window.forumAutoListener.isProcessingRequest) {
      console.log('[Reddit/Forum Manager] Auto-listener...，...');
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
        `[Reddit/Forum Manager] ...: ...Сообщения...=${currentCount}, ...=${this.lastProcessedCount}, ...=${increment}, ...=${this.currentSettings.threshold}`,
      );

      if (increment >= this.currentSettings.threshold) {
        console.log(`[Reddit/Forum Manager] ...Форум... (...: ${increment})`);
        const result = await this.generateForumContent();
        return result;
      } else {
        console.log(`[Reddit/Forum Manager] ...，...`);
        return false;
      }
    } catch (error) {
      console.error('[Reddit/Forum Manager] error:', error);
      return false;
    }
  }

  /**
   * .../* Отображение статуса */
   */
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

    console.log(`[Reddit/Forum Manager] ${message}`);
  }

  /**
   * СохранитьНастройки
   */
  saveSettings() {
    try {
      localStorage.setItem('mobile_forum_settings', JSON.stringify(this.currentSettings));
      console.log('[Reddit/Forum Manager] Настройки...Сохранить');
    } catch (error) {
      console.error('[Reddit/Forum Manager] СохранитьНастройкиerror:', error);
    }
  }

  /**
   * ...Настройки
   */
  loadSettings() {
    try {
      const saved = localStorage.getItem('mobile_forum_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.currentSettings = { ...this.currentSettings, ...parsed };
        console.log('[Reddit/Forum Manager] Настройки...:', this.currentSettings);
      }
    } catch (error) {
      console.error('[Reddit/Forum Manager] errorНастройкиerror:', error);
    }
  }

  /**
   * ...
   */
  registerConsoleCommands() {
    if (!window.MobileContext) {
      window.MobileContext = {};
    }

    // Форум
    window.MobileContext.generateForum = (force = true) => this.generateForumContent(force); // ...
    window.MobileContext.forceGenerateForum = () => this.generateForumContent(true); // ...
    window.MobileContext.autoGenerateForum = () => this.generateForumContent(false); // ...
    window.MobileContext.showForum = () => this.showForumPanel();
    window.MobileContext.clearForum = () => this.clearForumContent();
    window.MobileContext.showForumPanel = () => this.showForumPanel();
    window.MobileContext.clearForumCache = () => this.clearForumUICache();
    window.MobileContext.sendReply = replyFormat => this.sendReplyToAPI(replyFormat);
    window.MobileContext.insertReply = (prefix, format) => this.insertReplyToFirstLayer(prefix, format);
    window.MobileContext.sendPost = postFormat => this.sendPostToAPI(postFormat);
    window.MobileContext.getForumStatus = () => this.getStatus();
    window.MobileContext.forceReset = () => this.forceReset(); // ...

    // ：
    window.MobileContext.testForceGenerate = () => {
      console.log('[Test] 🧪 ......');
      return this.generateForumContent(true);
    };
    window.MobileContext.testDuplicateProtection = () => this.testDuplicateProtection();
    window.MobileContext.getListenerStatus = () => this.getListenerStatus();
    window.MobileContext.resetForumState = () => this.resetForumState();
    window.MobileContext.simulateMessageSpam = (count = 10) => this.simulateMessageSpam(count);

    window.MobileContext.fixBrowserCompatibility = () => this.fixBrowserCompatibility();
    window.MobileContext.quickDiagnosis = () => this.quickDiagnosis();

    // Статус
    window.MobileContext.checkGenerating = () => this.checkGenerationStatus();
    window.MobileContext.getQueueStatus = () => this.getQueueStatus();
    window.MobileContext.clearQueue = () => this.clearQueue();
    window.MobileContext.forceStopQueue = () => this.stopInsertionQueueProcessor();

    // Форум
    window.MobileContext.testMergeContent = (existing, newContent) => this.mergeForumContent(existing, newContent);
    window.MobileContext.parseForumContent = content => this.parseForumContent(content);
    window.MobileContext.buildForumContent = (threads, replies) => this.buildForumContent(threads, replies);
    window.MobileContext.getCurrentForumContent = () => this.getCurrentForumContent();

    window.MobileContext.startAutoListener = () => {
      if (window.forumAutoListener) {
        window.forumAutoListener.start();
      }
    };
    window.MobileContext.stopAutoListener = () => {
      if (window.forumAutoListener) {
        window.forumAutoListener.stop();
      }
    };
    window.MobileContext.getAutoListenerDebug = () => {
      if (window.forumAutoListener) {
        return window.forumAutoListener.getDebugInfo();
      }
    };

    console.log('🚀 [Форум...] ...:');
    console.log('');
    console.log('📝 [...]:');
    console.log('  - MobileContext.generateForum(force=true) // ...Форум...（...）');
    console.log('  - MobileContext.forceGenerateForum() // ...Форум...（...）');
    console.log('  - MobileContext.autoGenerateForum() // ...（...）');
    console.log('  - MobileContext.showForum() // ...Форум...');
    console.log('  - MobileContext.clearForum() // ...Форум...');
    console.log('  - MobileContext.showForumPanel() // ...Форум...');
    console.log('  - MobileContext.clearForumCache() // ОбновитьФорум...');
    console.log('  - MobileContext.sendReply(replyFormat) // ...Ответить');
    console.log('  - MobileContext.insertReply(prefix, format) // ...Ответить...');
    console.log('  - MobileContext.sendPost(postFormat) // ...');
    console.log('  - MobileContext.getForumStatus() // ...ФорумСтатус');
    console.log('  - MobileContext.forceReset() // ...Статус');
    console.log('');
    console.log('🔧 [...]:');
    console.log('  - MobileContext.testForceGenerate() // ...');
    console.log('  - MobileContext.testDuplicateProtection() // ...');
    console.log('  - MobileContext.getListenerStatus() // ...Статус');
    console.log('  - MobileContext.resetForumState() // ...ФорумСтатус');
    console.log('  - MobileContext.simulateMessageSpam(count) // ...Сообщения...');
    console.log('');
    console.log('🍎 [...]:');
    console.log('  - MobileContext.fixBrowserCompatibility() // ...Safari/Via...');
    console.log('  - MobileContext.quickDiagnosis() // ...');
    console.log('');
    console.log('🎧 [...]:');
    console.log('  - MobileContext.startAutoListener() // ...');
    console.log('  - MobileContext.stopAutoListener() // ...');
    console.log('  - MobileContext.getAutoListenerDebug() // ...');
    console.log('');
    console.log('📊 [...Статус...]:');
    console.log('  - MobileContext.checkGenerating() // ...SillyTavern...');
    console.log('  - MobileContext.getQueueStatus() // ...Статус');
    console.log('  - MobileContext.clearQueue() // ...');
    console.log('  - MobileContext.forceStopQueue() // ...');
    console.log('');
    console.log('� [Форум...]:');
    console.log('  - MobileContext.getCurrentForumContent() // ...Форум...');
    console.log('  - MobileContext.parseForumContent(content) // ...Форум...');
    console.log('  - MobileContext.buildForumContent(threads, replies) // ...Форум...');
    console.log('  - MobileContext.testMergeContent(existing, newContent) // ...');
    console.log('');
    console.log('�📄 [Форум...] 📄 ...！');
    console.log('🔍 ...: ...、ПользовательСообщения、...API...、...Назад...');
    console.log('📋 ...Форум...');
    console.log('');
    console.log('📝 [Написать пост...] ...: MobileContext.sendPost("[...|...|Пост|...|...]")');
    console.log('💬 [Ответить...] ...: MobileContext.sendReply("...ОтветитьПост\'xxx\'\\n[Ответ|...|Постid|Ответить...]")');
    console.log('');
    console.log('🚀 [...]:');
    console.log('  - ...：...，...Сообщения...');
    console.log('  - ...：...Сообщения...');
    console.log('  - ... = ...');
    console.log('  - Auto-listener = ...');
    console.log('');
    console.log('🛡️ [...] ...，...: MobileContext.testDuplicateProtection()');
    console.log('');
    console.log('🔄 [...] ...:');
    console.log('  - ...Форум...，...Пост...');
    console.log('  - ...Пост...，...Пост...');
    console.log('  - ...Пост...Ответить，...Пост...');
    console.log('  - ...Ответить，...Форум...');
    console.log('');
    console.log('🍎 [Safari/Via...] ...，...: MobileContext.fixBrowserCompatibility()');
    console.log('📊 [...] ...，...: MobileContext.quickDiagnosis()');
    console.log('');
  }

  /**
   * ...
   */
  async testDuplicateProtection() {
    console.log('🛡️ [...] ......');

    const results = [];

    // 1: generateForumContent
    console.log('📋 ...1: ...generateForumContent');
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(this.generateForumContent());
    }

    const testResults = await Promise.all(promises);
    const successCount = testResults.filter(r => r === true).length;

    console.log(`✅ ...1...: ${successCount}/5 ...，...`);
    results.push(`...1: ${successCount}/5 ...`);

    // 2: Статус
    console.log('📋 ...2: ...Статус...');
    const managerStatus = this.isProcessing;
    const listenerStatus = window.forumAutoListener ? window.forumAutoListener.isProcessingRequest : false;

    console.log(`✅ ...2...: Manager...Статус=${managerStatus}, Listener...Статус=${listenerStatus}`);
    results.push(`...2: Manager=${managerStatus}, Listener=${listenerStatus}`);

    // 3:
    console.log('📋 ...3: ...');
    const managerCount = this.lastProcessedCount;
    const listenerCount = window.forumAutoListener ? window.forumAutoListener.lastProcessedMessageCount : 0;

    console.log(`✅ ...3...: Manager...=${managerCount}, Listener...=${listenerCount}`);
    results.push(`...3: Manager=${managerCount}, Listener=${listenerCount}`);

    console.log('🛡️ [...] ...');
    return results;
  }

  /**
   * ...Статус
   */
  getListenerStatus() {
    const status = {
      forumManager: {
        isProcessing: this.isProcessing,
        lastProcessedCount: this.lastProcessedCount,
        settings: this.currentSettings,
      },
      forumAutoListener: window.forumAutoListener ? window.forumAutoListener.getDebugInfo() : null,
    };

    console.log('📊 [...Статус]', status);
    return status;
  }

  /**
   * ...ФорумСтатус
   */
  resetForumState() {
    console.log('🔄 [...ФорумСтатус] ......');

    // Статус
    this.isProcessing = false;
    this.lastProcessedCount = 0;

    // Статус
    if (window.forumAutoListener) {
      window.forumAutoListener.reset();
    }

    console.log('✅ [...ФорумСтатус] ...');
  }

  /**
   * ...Сообщения...
   */
  async simulateMessageSpam(count = 10) {
    console.log(`🔥 [Сообщения...] ...${count}...Сообщения......`);

    if (!window.forumAutoListener) {
      console.log('❌ Auto-listener...');
      return;
    }

    const originalCount = window.forumAutoListener.lastMessageCount;

    for (let i = 0; i < count; i++) {
      window.forumAutoListener.onMessageReceived({ test: true, index: i });
      await new Promise(resolve => setTimeout(resolve, 100)); // 100ms...
    }

    const finalCount = window.forumAutoListener.lastMessageCount;
    console.log(`✅ [Сообщения...] ...。...: ${originalCount}, ...: ${finalCount}`);
  }

  /**
   * ...
   */
  static getInstance() {
    if (!window.forumManager) {
      window.forumManager = new RedditForumManager();
    }
    return window.forumManager;
  }

  /**
   * ...SillyTavern...Ответить
   */
  checkGenerationStatus() {
    try {
      // 1: is_send_press
      const is_send_press = window.is_send_press;
      if (is_send_press === true) {
        return true;
      }

      // 2: DOM data-generating
      const bodyElement = document.body;
      if (bodyElement && bodyElement.dataset.generating === 'true') {
        return true;
      }

      // 3:
      const is_generation_stopped = window.is_generation_stopped;
      if (is_generation_stopped === false) {
        return true;
      }

      // 4: Статус（）
      const is_group_generating = window.is_group_generating;
      if (is_group_generating === true) {
        return true;
      }

      return false;
    } catch (error) {
      console.warn('[Reddit/Forum Manager] errorСтатусerror:', error);
      return false; // ...
    }
  }

  /**
   * ...SillyTavern...
   * @param {number} timeout - ...Время（...）
   * @returns {Promise<boolean>} - ...
   */
  async waitForGenerationComplete(timeout = this.maxWaitTime) {
    return new Promise(resolve => {
      const startTime = Date.now();
      let checkCount = 0;

      console.log('[Reddit/Forum Manager] 🕐 ...SillyTavern......');

      const checkInterval = setInterval(() => {
        checkCount++;
        const isGenerating = this.checkGenerationStatus();
        const elapsed = Date.now() - startTime;

        // 10Статус
        if (checkCount % 10 === 0) {
          console.log(`[Reddit/Forum Manager] ⏳ ...... (${Math.round(elapsed / 1000)}s, ...: ${checkCount})`);
        }

        if (!isGenerating) {
          clearInterval(checkInterval);
          console.log(`[Reddit/Forum Manager] ✅ SillyTavern...Выполнено! (...Время: ${Math.round(elapsed / 1000)}s)`);
          resolve(true);
        } else if (elapsed >= timeout) {
          clearInterval(checkInterval);
          console.warn(`[Reddit/Forum Manager] ⏰ error (${Math.round(timeout / 1000)}s)，error`);
          resolve(false);
        }
      }, 500); // ...500ms...
    });
  }

  /**
   * ...1...（...Статус...）
   */
  async safeUpdateContextWithForum(forumContent) {
    try {
      console.log('[Reddit/Forum Manager] 🔒 ...1......');

      if (this.checkGenerationStatus()) {
        console.log('[Reddit/Forum Manager] ⚠️ ...SillyTavern...Ответить，......');
        this.updateStatus('...SillyTavern......', 'warning');

        const waitSuccess = await this.waitForGenerationComplete();
        if (!waitSuccess) {
          console.warn('[Reddit/Forum Manager] ⏰ error，error');
          this.updateStatus('...，......', 'warning');
        }
      }

      // ПодтвердитьСтатус
      if (this.checkGenerationStatus()) {
        console.warn('[Reddit/Forum Manager] ⚠️ errorСтатусerror，errorСообщенияerror');
        return this.queueInsertion('forum_content', forumContent);
      }

      console.log('[Reddit/Forum Manager] 🚀 ...1......');
      const result = await this.updateContextWithForum(forumContent);

      if (result && window.showMobileToast) {
        window.showMobileToast('✅ Форум...1...', 'success');
      } else if (!result && window.showMobileToast) {
        window.showMobileToast('❌ Форум...', 'error');
      }

      return result;
    } catch (error) {
      console.error('[Reddit/Forum Manager] error:', error);
      return false;
    }
  }

  /**
   * ...
   */
  async queueInsertion(type, content, additionalData = {}) {
    const insertion = {
      id: Date.now() + Math.random(),
      type: type,
      content: content,
      timestamp: new Date(),
      additionalData: additionalData,
    };

    this.pendingInsertions.push(insertion);
    console.log(`[Reddit/Forum Manager] 📝 Сообщения... (ID: ${insertion.id}, ...: ${type})`);

    this.updateStatus(`Сообщения...，... (...: ${this.pendingInsertions.length})`, 'info');

    this.startInsertionQueueProcessor();

    return true;
  }

  /**
   * ...
   */
  startInsertionQueueProcessor() {
    if (this.isMonitoringGeneration) {
      return; // ...
    }

    this.isMonitoringGeneration = true;
    console.log('[Reddit/Forum Manager] 🎛️ ......');

    this.generationCheckInterval = setInterval(async () => {
      await this.processInsertionQueue();
    }, 1000); // ...
  }

  /**
   * ...
   */
  async processInsertionQueue() {
    if (this.pendingInsertions.length === 0) {
      this.stopInsertionQueueProcessor();
      return;
    }

    if (this.checkGenerationStatus()) {
      console.log(`[Reddit/Forum Manager] ⏳ SillyTavern...，...... (...: ${this.pendingInsertions.length} ...)`);
      return;
    }

    const insertion = this.pendingInsertions.shift();
    if (!insertion) return;

    console.log(`[Reddit/Forum Manager] 🔄 ... (ID: ${insertion.id}, ...: ${insertion.type})`);

    try {
      let success = false;

      switch (insertion.type) {
        case 'forum_content':
          success = await this.updateContextWithForum(insertion.content);
          break;
        case 'reply':
          const { replyPrefix, replyFormat } = insertion.additionalData;
          success = await this.insertReplyToFirstLayer(replyPrefix, replyFormat);
          break;
        default:
          console.warn(`[Reddit/Forum Manager] error: ${insertion.type}`);
          success = false;
      }

      if (success) {
        console.log(`[Reddit/Forum Manager] ✅ ... (ID: ${insertion.id})`);
        this.updateStatus('Сообщения...', 'success');
      } else {
        console.error(`[Reddit/Forum Manager] ❌ error (ID: ${insertion.id})`);
        this.updateStatus('Сообщения...', 'error');
      }
    } catch (error) {
      console.error(`[Reddit/Forum Manager] error (ID: ${insertion.id}):`, error);
    }

    // Если，
    if (this.pendingInsertions.length > 0) {
      this.updateStatus(`...... (...: ${this.pendingInsertions.length} ...)`, 'info');
    }
  }

  /**
   * ...
   */
  stopInsertionQueueProcessor() {
    if (this.generationCheckInterval) {
      clearInterval(this.generationCheckInterval);
      this.generationCheckInterval = null;
    }
    this.isMonitoringGeneration = false;
    console.log('[Reddit/Forum Manager] 🛑 ...');
  }

  /**
   * ...Статус
   */
  getQueueStatus() {
    return {
      isMonitoring: this.isMonitoringGeneration,
      pendingCount: this.pendingInsertions.length,
      isGenerating: this.checkGenerationStatus(),
      queue: this.pendingInsertions.map(item => ({
        id: item.id,
        type: item.type,
        timestamp: item.timestamp,
      })),
    };
  }

  /**
   * ...
   */
  clearQueue() {
    this.pendingInsertions = [];
    this.stopInsertionQueueProcessor();
    console.log('[Reddit/Forum Manager] 🗑️ ...');
    this.updateStatus('...', 'info');
  }

  /**
   * .../* Отображение статуса */
   */
  updateQueueStatusDisplay() {
    try {
      const generationStatusEl = document.getElementById('generation-status');
      const queueCountEl = document.getElementById('queue-count');

      if (generationStatusEl) {
        const isGenerating = this.checkGenerationStatus();
        generationStatusEl.textContent = isGenerating ? '🟠 ...' : '🟢 ...';
        generationStatusEl.style.color = isGenerating ? '#f39c12' : '#27ae60';
      }

      if (queueCountEl) {
        queueCountEl.textContent = this.pendingInsertions.length;
        queueCountEl.style.color = this.pendingInsertions.length > 0 ? '#e74c3c' : '#95a5a6';
      }
    } catch (error) {
      console.warn('[Reddit/Forum Manager] error/* Отображение статуса */error:', error);
    }
  }

  /**
   * ...Статус...
   */
  startStatusUpdateTimer() {
    // Если，
    if (this.statusUpdateTimer) {
      clearInterval(this.statusUpdateTimer);
    }

    this.updateQueueStatusDisplay();

    // Настройки（2）
    this.statusUpdateTimer = setInterval(() => {
      this.updateQueueStatusDisplay();
    }, 2000);

    console.log('[Reddit/Forum Manager] 📊 Статус...');
  }

  /**
   * ...Статус...
   */
  stopStatusUpdateTimer() {
    if (this.statusUpdateTimer) {
      clearInterval(this.statusUpdateTimer);
      this.statusUpdateTimer = null;
      console.log('[Reddit/Forum Manager] 📊 Статус...');
    }
  }

  /**
   * ...Статус - ...
   */
  async forceReset() {
    console.log('[Reddit/Forum Manager] 🔄 ......');

    // Статус
    this.isProcessing = false;
    this.isMonitoringGeneration = false;

    if (this.generationCheckInterval) {
      clearInterval(this.generationCheckInterval);
      this.generationCheckInterval = null;
    }

    if (this.statusUpdateTimer) {
      clearTimeout(this.statusUpdateTimer);
      this.statusUpdateTimer = null;
    }

    if (this.pendingInsertions) {
      this.pendingInsertions = [];
    }

    this.stopInsertionQueueProcessor();

    // Сообщения
    await this.resetMessageCounts();

    // auto-listenerСтатус
    if (window.forumAutoListener) {
      window.forumAutoListener.isProcessingRequest = false;
      // auto-listenerСообщения
      try {
        const chatData = await this.getCurrentChatData();
        if (chatData && chatData.messages && window.forumAutoListener) {
          const currentCount = chatData.messages.length;
          window.forumAutoListener.lastProcessedMessageCount = currentCount;
          window.forumAutoListener.lastMessageCount = currentCount;
          console.log(`[Reddit/Forum Manager] 🔄 ...auto-listenerСообщения...: ${currentCount}`);
        }
      } catch (err) {
        console.warn('[Reddit/Forum Manager] errorСообщенияerror:', err);
      }
    }

    // /* Отображение статуса */
    this.updateStatus('...Статус', 'success');

    console.log('[Reddit/Forum Manager] ✅ ...');

    return true;
  }

  /**
   * ...
   */
  async fixBrowserCompatibility() {
    console.log('[Reddit/Forum Manager] 🍎 ......');

    const userAgent = navigator.userAgent;
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    const isVia = /Via/.test(userAgent);
    const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);

    console.log(`[Reddit/Forum Manager] ...:`, {
      userAgent: userAgent,
      isSafari: isSafari,
      isVia: isVia,
      isMobile: isMobile,
      currentProcessingState: this.isProcessing,
    });

    // Safari/Via
    if (isSafari || isVia) {
      console.log('[Reddit/Forum Manager] 🔧 ...Safari/Via...，/* Приложение */......');

      // 1. Статус
      this.isProcessing = false;
      if (window.forumAutoListener) {
        window.forumAutoListener.isProcessingRequest = false;
      }

      // 2.
      if (this.statusUpdateTimer) {
        clearTimeout(this.statusUpdateTimer);
        this.statusUpdateTimer = null;
      }

      // 3. /* Отображение статуса */
      this.updateStatus('Safari/Via...', 'success');

      console.log('[Reddit/Forum Manager] ✅ Safari/Via...');
      return true;
    } else {
      console.log('[Reddit/Forum Manager] ℹ️ Chrome...，...');
      return false;
    }
  }

  /**
   * ... - ...
   */
  quickDiagnosis() {
    const status = {
      timestamp: new Date().toISOString(),
      browser: navigator.userAgent,
      states: {
        isProcessing: this.isProcessing,
        isMonitoringGeneration: this.isMonitoringGeneration,
        pendingInsertionsCount: this.pendingInsertions.length,
        lastProcessedCount: this.lastProcessedCount,
      },
      timers: {
        generationCheckInterval: !!this.generationCheckInterval,
        statusUpdateTimer: !!this.statusUpdateTimer,
      },
      autoListener: window.forumAutoListener
        ? {
            isListening: window.forumAutoListener.isListening,
            isProcessingRequest: window.forumAutoListener.isProcessingRequest,
            lastProcessedMessageCount: window.forumAutoListener.lastProcessedMessageCount,
          }
        : null,
    };

    console.log('[Reddit/Forum Manager] 📊 ...:', status);
    return status;
  }

  /**
   * ...Сообщения...
   */
  async resetMessageCounts() {
    try {
      const chatData = await this.getCurrentChatData();
      if (chatData && chatData.messages) {
        const currentCount = chatData.messages.length;
        this.lastProcessedCount = currentCount;
        console.log(`[Reddit/Forum Manager] 🔄 ...Сообщения...: ${currentCount}`);
      }
    } catch (error) {
      console.warn('[Reddit/Forum Manager] errorСообщенияerror:', error);
    }
  }

  /**
   * ...
   */
  getDebugInfo() {
    return {
      isInitialized: this.isInitialized,
      isProcessing: this.isProcessing,
      lastProcessedCount: this.lastProcessedCount,
      currentSettings: this.currentSettings,
      isMonitoringGeneration: this.isMonitoringGeneration,
      pendingInsertionsCount: this.pendingInsertions ? this.pendingInsertions.length : 0,
      autoListenerStatus: window.forumAutoListener
        ? {
            isListening: window.forumAutoListener.isListening,
            isProcessingRequest: window.forumAutoListener.isProcessingRequest,
            lastProcessedMessageCount: window.forumAutoListener.lastProcessedMessageCount,
          }
        : null,
    };
  }
}

window.forumManager = RedditForumManager.getInstance();

// ：Форум
function initializeRedditForumManager() {
  if (window.forumManager && !window.forumManager.isInitialized) {
    console.log('[Reddit/Forum Manager] ...Форум......');
    window.forumManager.initialize();
  }
}

// ЕслиDOM，；DOMContentLoaded
if (document.readyState === 'loading') {
  console.log('[Reddit/Forum Manager] DOM...，...DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', initializeRedditForumManager);
} else {
  console.log('[Reddit/Forum Manager] DOM...，...');
  // setTimeout
  setTimeout(initializeRedditForumManager, 0);
}

// Экспорт класса
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RedditForumManager;
}
