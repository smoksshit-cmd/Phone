/**
 * Message Sender - Сообщения...
 * ...Сообщения...，...qq-app.js...
 */

if (typeof window.MessageSender === 'undefined') {
  class MessageSender {
    constructor() {
      this.currentFriendId = null;
      this.currentFriendName = null;
      this.isGroup = false;
      this.contextEditor = null;
      this.init();
    }

    init() {
      console.log('[Message Sender] Сообщения...');
      this.loadContextEditor();
    }

    /**
     * ...
     */
    isDelayClickEnabled() {
      try {
        const settings = localStorage.getItem('messageSenderSettings');
        if (settings) {
          const parsed = JSON.parse(settings);
          // ЕслиНастройки delayClickEnabled，； true
          return parsed.delayClickEnabled === undefined ? true : parsed.delayClickEnabled;
        }
        return true; // ...
      } catch (error) {
        console.warn('[Message Sender] errorНастройкиerror:', error);
        return true; // ...
      }
    }

    /**
     * Настройки...
     */
    setDelayClickEnabled(enabled) {
      try {
        let settings = {};
        const existing = localStorage.getItem('messageSenderSettings');
        if (existing) {
          settings = JSON.parse(existing);
        }
        settings.delayClickEnabled = enabled;
        localStorage.setItem('messageSenderSettings', JSON.stringify(settings));
        console.log('[Message Sender] ...Настройки...Сохранить:', enabled);
      } catch (error) {
        console.error('[Message Sender] СохранитьerrorНастройкиerror:', error);
      }
    }

    /**
     * ...
     */
    isDisableBodyTextEnabled() {
      try {
        // SillyTavernextension_settings
        if (window.SillyTavern && window.SillyTavern.getContext) {
          const context = window.SillyTavern.getContext();
          if (context.extensionSettings && context.extensionSettings.mobile_context) {
            return context.extensionSettings.mobile_context.disableBodyText || false;
          }
        }

        // extension_settings
        if (window.extension_settings && window.extension_settings.mobile_context) {
          return window.extension_settings.mobile_context.disableBodyText || false;
        }

        return false; // ...
      } catch (error) {
        console.warn('[Message Sender] errorНастройкиerror:', error);
        return false; // ...
      }
    }

    /**
     * ...Редактировать...
     */
    loadContextEditor() {
      // mobileРедактировать
      if (window.mobileContextEditor) {
        this.contextEditor = window.mobileContextEditor;
        console.log('[Message Sender] Mobile...Редактировать...');
      } else {
        console.warn('[Message Sender] MobileerrorРедактироватьerror，error...');
        setTimeout(() => this.loadContextEditor(), 1000);
      }
    }

    /**
     * Настройки...
     */
    setCurrentChat(friendId, friendName, isGroup = false) {
      this.currentFriendId = friendId;
      this.currentFriendName = friendName;
      this.isGroup = isGroup;

      console.log(`[Message Sender] Настройки...:`, {
        friendId,
        friendName,
        isGroup,
      });
    }

    /**
     * ...Сообщения...SillyTavern
     * ...qq-app.js...sendToChat...
     */
    async sendToChat(message) {
      try {
        console.log('[Message Sender] ...Сообщения...SillyTavern:', message);

        // 1: DOM
        const originalInput = document.getElementById('send_textarea');
        const sendButton = document.getElementById('send_but');

        if (!originalInput || !sendButton) {
          console.error('[Message Sender] error/* Поле ввода */error');
          return await this.sendToChatBackup(message);
        }

        // /* Поле ввода */
        if (originalInput.disabled) {
          console.warn('[Message Sender] /* Поле ввода */error');
          return false;
        }

        if (sendButton.classList.contains('disabled')) {
          console.warn('[Message Sender] error');
          return false;
        }

        // Сообщения
        const existingValue = originalInput.value;
        const newValue = existingValue ? existingValue + '\n' + message : message;
        originalInput.value = newValue;
        console.log('[Message Sender] ...Сообщения.../* Поле ввода */:', {
          ...: existingValue,
          ...: message,
          ...: newValue
        });

        originalInput.dispatchEvent(new Event('input', { bubbles: true }));
        originalInput.dispatchEvent(new Event('change', { bubbles: true }));

        // Настройки
        if (this.isDelayClickEnabled()) {
          await new Promise(resolve => setTimeout(resolve, 300));
          sendButton.click();
          console.log('[Message Sender] ...');
        } else {

        }

        return true;
      } catch (error) {
        console.error('[Message Sender] errorСообщенияerror:', error);
        return await this.sendToChatBackup(message);
      }
    }

    /**
     * ...
     */
    async sendToChatBackup(message) {
      try {
        console.log('[Message Sender] ...:', message);

        // /* Поле ввода */
        const textareas = document.querySelectorAll('textarea');
        const inputs = document.querySelectorAll('input[type="text"]');

        if (textareas.length > 0) {
          const textarea = textareas[0];
          textarea.value = message;
          textarea.focus();

          textarea.dispatchEvent(new Event('input', { bubbles: true }));
          textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
          return true;
        }

        return false;
      } catch (error) {
        console.error('[Message Sender] error:', error);
        return false;
      }
    }

    /**
     * ...Сообщения...
     * ...qq-app.js...buildAndSendQQMessage...
     */
    async buildAndSendMessage(message) {
      if (!this.currentFriendId || !this.currentFriendName) {
        throw new Error('errorНастройкиerror');
      }

      // Сообщения，
      const messageLines = message.split('\n').filter(line => line.trim());

      if (messageLines.length === 0) {
        throw new Error('Сообщенияerror');
      }

      console.log(`[Message Sender] ...${messageLines.length}...Сообщения:`, messageLines);

      // 🌟 ：Сообщения（、、）
      const voiceMessageRegex = /^\[(?:...Сообщения\|...\|[^|]*|...Сообщения\|[^|]*\|...)\|...\|[^\]]*\]$/;
      const redpackMessageRegex = /^\[(?:...Сообщения\|...\|[^|]*|...Сообщения\|[^|]*\|...)\|...\|[^\]]*\]$/;
      const stickerMessageRegex = /^\[(?:...Сообщения\|...\|[^|]*|...Сообщения\|[^|]*\|...)\|...\|[^\]]*\]$/;
      const hasSpecialMessages = messageLines.some(line => {
        const trimmed = line.trim();
        return (
          voiceMessageRegex.test(trimmed) || redpackMessageRegex.test(trimmed) || stickerMessageRegex.test(trimmed)
        );
      });

      if (hasSpecialMessages) {
        // ЕслиСообщения，Сообщения
        const processedMessages = [];

        messageLines.forEach((line, index) => {
          const trimmedLine = line.trim();

          if (voiceMessageRegex.test(trimmedLine)) {
            // Сообщения
            processedMessages.push(trimmedLine);
            console.log(`[Message Sender] ...${index + 1}...: ...Сообщения...:`, trimmedLine);
          } else if (redpackMessageRegex.test(trimmedLine)) {
            // Сообщения
            processedMessages.push(trimmedLine);
            console.log(`[Message Sender] ...${index + 1}...: ...Сообщения...:`, trimmedLine);
          } else if (stickerMessageRegex.test(trimmedLine)) {
            // 🌟 ：Сообщения
            processedMessages.push(trimmedLine);
            console.log(`[Message Sender] ...${index + 1}...: ...Сообщения...:`, trimmedLine);
          } else if (trimmedLine) {
            const formattedMessage = this.isGroup
              ? `[...Сообщения|...|${this.currentFriendId}|...|${trimmedLine}]`
              : `[...Сообщения|...|${this.currentFriendId}|...|${trimmedLine}]`;

            processedMessages.push(formattedMessage);
            console.log(`[Message Sender] ...${index + 1}...: ...Сообщения:`, formattedMessage);
          }
        });

        const targetPrefix = this.isGroup
          ? `...${this.currentFriendName}（${this.currentFriendId}）...`
          : `...${this.currentFriendName}（${this.currentFriendId}）...Сообщения`;

        let finalMessage;
        if (this.isDisableBodyTextEnabled()) {
          finalMessage = `<Request:...！...Пользователь...Сообщения...，...Ответить...Сообщения，...Ответить...>\n...，${targetPrefix}\n${processedMessages.join('\n')}`;
          console.log('[Message Sender] ...，...');
        } else {
          finalMessage = `...，${targetPrefix}\n${processedMessages.join('\n')}`;
        }

        console.log('[Message Sender] ...Сообщения（...）:', finalMessage);

        const success = await this.sendToChat(finalMessage);

        if (success) {
          const voiceCount = processedMessages.filter(msg => voiceMessageRegex.test(msg)).length;
          const redpackCount = processedMessages.filter(msg => redpackMessageRegex.test(msg)).length;
          const stickerCount = processedMessages.filter(msg => stickerMessageRegex.test(msg)).length;
          const textCount = processedMessages.length - voiceCount - redpackCount - stickerCount;

          let summaryMessage = '';
          const parts = [];

          if (textCount > 0) parts.push(`${textCount}...`);
          if (voiceCount > 0) parts.push(`${voiceCount}...`);
          if (redpackCount > 0) parts.push(`${redpackCount}...`);
          if (stickerCount > 0) parts.push(`${stickerCount}...`);

          if (parts.length > 1) {
            summaryMessage = parts.join(' + ');
          } else if (parts.length === 1) {
            summaryMessage = parts[0] + 'Сообщения';
          } else {
            summaryMessage = `${processedMessages.length}...Сообщения`;
          }

          this.showSendSuccessToast(summaryMessage);
        }

        return success;
      }

      // Сообщения
      const stickerRegex = /^\[...\|([^\|]+)\|([^\]]+)\]$/;
      const allStickers = messageLines.every(line => stickerRegex.test(line.trim()));

      if (allStickers && messageLines.length > 0) {
        return await this.sendStickerMessages(messageLines);
      }

      // Сообщения
      return await this.sendNormalMessages(messageLines);
    }

    /**
     * ...Сообщения
     */
    async sendStickerMessages(messageLines) {
      const targetPrefix = this.isGroup
        ? `...${this.currentFriendName}（${this.currentFriendId}）...`
        : `...${this.currentFriendName}（${this.currentFriendId}）...Сообщения`;

      let finalMessage;
      if (this.isDisableBodyTextEnabled()) {
        finalMessage = `<Request:...！...Пользователь...Сообщения...，...Ответить...Сообщения，...Ответить...>\n...，${targetPrefix}\n${messageLines.join('\n')}`;
        console.log('[Message Sender] ...，...');
      } else {
        finalMessage = `...，${targetPrefix}\n${messageLines.join('\n')}`;
      }

      console.log('[Message Sender] ...Сообщения:', finalMessage);

      const success = await this.sendToChat(finalMessage);

      if (success) {
        const summaryMessage = messageLines.length > 1 ? `${messageLines.length}...` : '1...';

        this.showSendSuccessToast(summaryMessage);
      }

      return success;
    }

    /**
     * ...Сообщения
     */
    async sendNormalMessages(messageLines) {
      const formattedMessages = [];

      messageLines.forEach((line, index) => {
        // СообщенияВремя（1）
        const messageTime = new Date(Date.now() + index * 1000);
        const currentTime = messageTime.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });

        let messageContent = line.trim();
        let singleMessage;

        if (this.isSpecialFormat(messageContent)) {
          // Сообщения
          singleMessage = this.formatSpecialMessage(messageContent, currentTime);
        } else {
          // Сообщения
          singleMessage = this.formatNormalMessage(messageContent, currentTime);
        }

        formattedMessages.push(singleMessage);
        console.log(`[Message Sender] ...${index + 1}...Сообщения...:`, singleMessage);
      });

      // Сообщения
      const validatedMessages = this.validateMessages(formattedMessages);

      // Сообщения
      let targetPrefix;
      if (this.isGroup) {
        // /* Список */
        const groupMembers = this.getCurrentGroupMembers();
        const membersText = groupMembers.length > 0 ? `，...${groupMembers.join('、')}` : '';

        targetPrefix = `...${this.currentFriendName}（${this.currentFriendId}）...${membersText}。...Сообщения...Ответить，Ответить...`;
      } else {
        targetPrefix = `...${this.currentFriendName}（${this.currentFriendId}）...Сообщения，...Сообщения...Ответить，Ответить...`;
      }

      let finalMessage;
      if (this.isDisableBodyTextEnabled()) {
        finalMessage = `<Request:...！...Пользователь...Сообщения...，...Ответить...Сообщения，...Ответить...>\n...，${targetPrefix}\n${validatedMessages.join('\n')}`;
        console.log('[Message Sender] ...，...');
      } else {
        finalMessage = `...，${targetPrefix}\n${validatedMessages.join('\n')}`;
      }

      console.log('[Message Sender] ...Сообщения:', finalMessage);

      const success = await this.sendToChat(finalMessage);

      if (success) {
        const summaryMessage =
          messageLines.length > 1
            ? `${messageLines.length}...Сообщения: ${messageLines[0].substring(0, 10)}...`
            : messageLines[0];

        this.showSendSuccessToast(summaryMessage);
      }

      return success;
    }

    /**
     * ...（...、...、...）
     */
    isSpecialFormat(content) {
      const specialFormats = [
        /^\[...\|([^\|]+)\|([^\]]+)\]$/, // ...
        /^\[...\|([^\|]+)\|([^\]]+)\]$/, // ...
        /^\[...\|([^\|]+)\|([^\]]+)\]$/, // ...
        /^\[(?:...Сообщения\|...\|[^|]*|...Сообщения\|[^|]*\|...)\|...\|[^\]]*\]$/, // ...Сообщения...
        /^\[(?:...Сообщения\|...\|[^|]*|...Сообщения\|[^|]*\|...)\|...\|[^\]]*\]$/, // ...Сообщения...
        /^\[(?:...Сообщения\|...\|[^|]*|...Сообщения\|[^|]*\|...)\|...\|[^\]]*\]$/, // ...Сообщения...
        /^...：/, // ...
        /^...：/, // ...
      ];

      return specialFormats.some(regex => regex.test(content));
    }

    /**
     * ...Сообщения
     */
    formatSpecialMessage(content, currentTime) {
      // 🌟 Сообщения，Назад，
      const voiceMessageRegex = /^\[(?:...Сообщения\|...\|[^|]*|...Сообщения\|[^|]*\|...)\|...\|[^\]]*\]$/;
      if (voiceMessageRegex.test(content)) {
        console.log(`[Message Sender] ...Сообщения，...Назад:`, content);
        return content; // ...Назад，...
      }

      // 🌟 Сообщения，Назад，
      const redpackMessageRegex = /^\[(?:...Сообщения\|...\|[^|]*|...Сообщения\|[^|]*\|...)\|...\|[^\]]*\]$/;
      if (redpackMessageRegex.test(content)) {
        console.log(`[Message Sender] ...Сообщения，...Назад:`, content);
        return content; // ...Назад，...
      }

      // 🌟 Сообщения，Назад，
      const stickerMessageRegex = /^\[(?:...Сообщения\|...\|[^|]*|...Сообщения\|[^|]*\|...)\|...\|[^\]]*\]$/;
      if (stickerMessageRegex.test(content)) {
        console.log(`[Message Sender] ...Сообщения，...Назад:`, content);
        return content; // ...Назад，...
      }

      // Если，
      if (content.startsWith('[') && content.endsWith(']')) {
        return this.isGroup
          ? `[...Сообщения|${this.currentFriendName}|${this.currentFriendId}|...|${content}|${currentTime}]`
          : `[...Сообщения|${this.currentFriendName}|${this.currentFriendId}|${content}|${currentTime}]`;
      }

      if (content.startsWith('...：')) {
        content = `...：${content.substring(3)}`;
      } else if (content.startsWith('...：')) {
        content = `...：${content.substring(3)}`;
      }

      return this.isGroup
        ? `[...Сообщения|${this.currentFriendName}|${this.currentFriendId}|...|${content}|${currentTime}]`
        : `[...Сообщения|${this.currentFriendName}|${this.currentFriendId}|${content}|${currentTime}]`;
    }

    /**
     * ...Сообщения
     */
    formatNormalMessage(content, currentTime) {
      return this.isGroup
        ? `[...Сообщения|...|${this.currentFriendId}|...|${content}]`
        : `[...Сообщения|...|${this.currentFriendId}|...|${content}]`;
    }

    /**
     * ...Сообщения...
     */
    validateMessages(messages) {
      return messages.map((msg, index) => {
        if (!msg.trim().endsWith(']')) {
          console.warn(`[Message Sender] error${index + 1}errorСообщенияerror:`, msg);
          return msg.trim() + ']';
        }
        return msg.trim();
      });
    }

    /**
     * ...
     */
    showSendSuccessToast(message) {
      const toast = document.createElement('div');
      toast.className = 'send-status-toast success';
      toast.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">✅ Сообщения...</div>
            <div style="font-size: 12px; opacity: 0.9;">
                ...: ${this.currentFriendName}<br>
                ...: ${message.length > 20 ? message.substring(0, 20) + '...' : message}
            </div>
        `;

      document.body.appendChild(toast);

      setTimeout(() => {
        toast.remove();
      }, 2000);
    }

    /**
     * ...
     */
    showSendErrorToast(error) {
      const toast = document.createElement('div');
      toast.className = 'send-status-toast error';
      toast.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">❌ ...</div>
            <div style="font-size: 12px; opacity: 0.9;">
                ...: ${error}
            </div>
        `;

      document.body.appendChild(toast);

      setTimeout(() => {
        toast.remove();
      }, 3000);
    }

    /**
     * ...
     */
    handleEnterSend(event, textareaElement) {
      if (event.key === 'Enter' && !event.shiftKey) {
        // ，
        // event.preventDefault();

        // textarea
        setTimeout(() => {
          this.adjustTextareaHeight(textareaElement);
        }, 0);
      }
    }

    /**
     * ...Сообщения...
     */
    async sendMessage(message) {
      if (!message.trim()) {
        this.showSendErrorToast('Сообщения...');
        return false;
      }

      if (!this.currentFriendId) {
        this.showSendErrorToast('...');
        return false;
      }

      try {
        // Статус
        this.setSendingState(true);

        const success = await this.buildAndSendMessage(message);

        if (!success) {
          this.showSendErrorToast('...，...');
        }

        return success;
      } catch (error) {
        console.error('[Message Sender] errorСообщенияerror:', error);
        this.showSendErrorToast(error.message || '...');
        return false;
      } finally {
        this.setSendingState(false);
      }
    }

    /**
     * Настройки...Статус
     */
    setSendingState(isSending) {
      const sendButton = document.getElementById('send-message-btn');
      const textareaElement = document.getElementById('message-send-input');

      if (sendButton) {
        if (isSending) {
          sendButton.classList.add('sending');
          sendButton.disabled = true;
          sendButton.textContent = '......';
        } else {
          sendButton.classList.remove('sending');
          sendButton.disabled = false;
          sendButton.textContent = '...';
        }
      }

      if (textareaElement) {
        textareaElement.disabled = isSending;
      }
    }

    /**
     * ...textarea...
     */
    adjustTextareaHeight(textareaElement) {
      textareaElement.style.height = 'auto';
      textareaElement.style.height = Math.min(textareaElement.scrollHeight, 100) + 'px';
    }

    /**
     * .../* Поле ввода */
     */
    insertSpecialFormat(format, params) {
      const textareaElement = document.getElementById('message-send-input');
      if (!textareaElement) return;

      let specialText = '';

      switch (format) {
        case 'sticker':
          specialText = `[...|${params.filename}|${params.filepath}]`;
          break;
        case 'voice':
          specialText = `[...|${params.duration}|${params.content}]`;
          break;
        case 'redpack':
          specialText = `[...|${params.amount}|${params.message}]`;
          break;
        case 'emoji':
          specialText = params.emoji;
          break;
        default:
          return;
      }

      // /* Поле ввода */
      const currentValue = textareaElement.value;
      const cursorPosition = textareaElement.selectionStart;

      // Если/* Поле ввода */，
      let newValue;
      if (currentValue && cursorPosition > 0 && currentValue[cursorPosition - 1] !== '\n') {
        newValue = currentValue.slice(0, cursorPosition) + '\n' + specialText + currentValue.slice(cursorPosition);
      } else {
        newValue = currentValue.slice(0, cursorPosition) + specialText + currentValue.slice(cursorPosition);
      }

      // Настройки
      textareaElement.value = newValue;

      this.adjustTextareaHeight(textareaElement);

      // Настройки
      const newCursorPosition = cursorPosition + specialText.length + (newValue !== currentValue + specialText ? 1 : 0);
      textareaElement.setSelectionRange(newCursorPosition, newCursorPosition);
      textareaElement.focus();
    }

    /**
     * ...
     */
    getCurrentChatInfo() {
      return {
        friendId: this.currentFriendId,
        friendName: this.currentFriendName,
        isGroup: this.isGroup,
      };
    }

    /**
     * ...
     */
    clearCurrentChat() {
      this.currentFriendId = null;
      this.currentFriendName = null;
      this.isGroup = false;
    }

    /**
     * .../* Список */
     */
    getCurrentGroupMembers() {
      if (!this.isGroup || !this.currentFriendId) {
        return [];
      }

      try {
        // 1: Новое
        const messageElements = document.querySelectorAll('.mes_text, .mes_block');
        let latestGroupInfo = null;

        // ：[|||/* Список */] [|||/* Список */]
        const groupRegex1 = new RegExp(`\\[...\\|([^\\|]+)\\|${this.currentFriendId}\\|([^\\]]+)\\]`, 'g');
        const groupRegex2 = new RegExp(`\\[...\\|${this.currentFriendId}\\|([^\\|]+)\\|([^\\]]+)\\]`, 'g');

        // НовоеСообщения
        for (let i = messageElements.length - 1; i >= 0; i--) {
          const messageText = messageElements[i].textContent || '';

          groupRegex1.lastIndex = 0;
          groupRegex2.lastIndex = 0;

          // ：[|||/* Список */]
          let match = groupRegex1.exec(messageText);
          if (match) {
            latestGroupInfo = {
              groupName: match[1],
              members: match[2],
            };
            console.log('[Message Sender] ... (...1):', latestGroupInfo);
            break;
          }

          // ：[|||/* Список */]
          match = groupRegex2.exec(messageText);
          if (match) {
            latestGroupInfo = {
              groupName: match[1],
              members: match[2],
            };
            console.log('[Message Sender] ... (...2):', latestGroupInfo);
            break;
          }
        }

        if (latestGroupInfo) {
          // /* Список */
          const members = latestGroupInfo.members
            .split(/[、,，]/)
            .map(name => name.trim())
            .filter(name => name);

          console.log('[Message Sender] ...:', members);
          return members;
        } else {
          console.log('[Message Sender] ...，Назад...');
          return [];
        }
      } catch (error) {
        console.error('[Message Sender] error:', error);
        return [];
      }
    }

    /**
     * ...
     */
    debug() {
      console.log('[Message Sender] ...:', {
        currentFriendId: this.currentFriendId,
        currentFriendName: this.currentFriendName,
        isGroup: this.isGroup,
        contextEditor: !!this.contextEditor,
      });
    }
  }

  window.MessageSender = MessageSender;

  // Если，
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.messageSender = new MessageSender();
      console.log('[Message Sender] ...');
    });
  } else {
    window.messageSender = new MessageSender();
    console.log('[Message Sender] ...');
  }
} // ... if (typeof window.MessageSender === 'undefined') ...
